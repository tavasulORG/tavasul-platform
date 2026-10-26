import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { errorResponse, isMissingTable, requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

/** Dashboard figures. Tables that do not exist yet simply report zero and tablesReady=false. */
export async function GET(request: Request) {
  try {
    await requireAdmin(request, "editor");

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [projects, donations, recentDonations, messages, recentMessages, sectors, regions, banks, activity] =
      await Promise.all([
        supabaseAdmin.from("projects").select("id,status,goal_amount,raised_amount,featured"),
        supabaseAdmin.from("donations").select("amount_usd,created_at"),
        supabaseAdmin
          .from("donations")
          .select("id,receipt_number,donor_name,is_anonymous,amount,currency,amount_usd,project_title,created_at")
          .order("created_at", { ascending: false })
          .limit(6),
        supabaseAdmin.from("contact_messages").select("id,status"),
        supabaseAdmin
          .from("contact_messages")
          .select("id,reference,name,topic,status,created_at,message")
          .order("created_at", { ascending: false })
          .limit(6),
        supabaseAdmin.from("sectors").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("regions").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("bank_accounts").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("admin_audit_log").select("*").order("created_at", { ascending: false }).limit(8),
      ]);

    const tablesReady = !isMissingTable(projects.error);

    const projectRows: Row[] = projects.data ?? [];
    const donationRows: Row[] = donations.data ?? [];
    const messageRows: Row[] = messages.data ?? [];

    const sum = (rows: Row[], key: string) => rows.reduce((n, r) => n + Number(r[key] ?? 0), 0);
    const last30 = donationRows.filter((d) => String(d.created_at) >= since);

    return Response.json({
      tablesReady,
      projects: {
        total: projectRows.length,
        urgent: projectRows.filter((p) => p.status === "urgent").length,
        active: projectRows.filter((p) => p.status === "active").length,
        completed: projectRows.filter((p) => p.status === "completed").length,
        featured: projectRows.filter((p) => p.featured).length,
        goal: sum(projectRows, "goal_amount"),
        raised: sum(projectRows, "raised_amount"),
      },
      donations: {
        count: donationRows.length,
        totalUsd: sum(donationRows, "amount_usd"),
        last30Count: last30.length,
        last30Usd: sum(last30, "amount_usd"),
        recent: recentDonations.data ?? [],
      },
      messages: {
        total: messageRows.length,
        unread: messageRows.filter((m) => m.status === "new").length,
        recent: recentMessages.data ?? [],
      },
      counts: {
        sectors: sectors.count ?? 0,
        regions: regions.count ?? 0,
        bankAccounts: banks.count ?? 0,
      },
      activity: activity.data ?? [],
    });
  } catch (err) {
    return errorResponse(err);
  }
}
