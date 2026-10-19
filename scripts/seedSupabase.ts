import { createClient } from "@supabase/supabase-js";
import { translations } from "../data/translations";
import { aboutData } from "../data/about";
import { sectorsData } from "../data/sectors";
import { regionsData } from "../data/regions";
import { initialProjects } from "../data/projects";
import { bankAccountsData } from "../data/bankAccounts";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://auxdpgqqlcrpmdzjgnky.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eGRwZ3FxbGNycG1kempnbmt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjQwOTQwMSwiZXhwIjoyMTA3OTg1NDAxfQ.1Cv1sSUXFB1Q1f6csEbyoE6QrW8AAWUvl7XsPNKPWvQ";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seed() {
  console.log("Seeding Supabase Database...");

  // 1. Translations
  console.log("1. Seeding translations...");
  const { error: trError } = await supabase.from("translations").upsert({
    id: "main",
    ar: translations.ar,
    tr: translations.tr,
    en: translations.en,
    updated_at: new Date().toISOString(),
  });
  if (trError) console.error("Error seeding translations:", trError.message);
  else console.log("✓ Translations seeded successfully.");

  // 2. Organization Info
  console.log("2. Seeding organization info...");
  const orgKeys = [
    { key: "general", data: { licenseNumber: aboutData.licenseNumber, foundedYear: aboutData.foundedYear, foundationCity: aboutData.foundationCity, originHeritage: aboutData.originHeritage } },
    { key: "our_story", data: aboutData.ourStory },
    { key: "who_we_are", data: aboutData.whoWeAre },
    { key: "vision", data: aboutData.vision },
    { key: "mission", data: aboutData.mission },
    { key: "goals", data: aboutData.goals },
    { key: "values", data: aboutData.values },
    { key: "governance", data: aboutData.governance },
    { key: "partners", data: aboutData.partners },
    { key: "target_groups", data: aboutData.targetGroups },
  ];

  for (const item of orgKeys) {
    const { error } = await supabase.from("organization_info").upsert({
      key: item.key,
      data: item.data,
      updated_at: new Date().toISOString(),
    });
    if (error) console.error(`Error seeding org info (${item.key}):`, error.message);
  }
  console.log("✓ Organization info seeded successfully.");

  // 3. Sectors
  console.log("3. Seeding sectors...");
  for (let i = 0; i < sectorsData.length; i++) {
    const sec = sectorsData[i];
    const { error } = await supabase.from("sectors").upsert({
      id: sec.id,
      slug: sec.slug,
      icon_name: sec.iconName,
      cover_image: sec.coverImage,
      title: sec.title,
      subtitle: sec.subtitle,
      description: sec.description,
      objectives: sec.objectives,
      stats: sec.stats,
      sort_order: i + 1,
      updated_at: new Date().toISOString(),
    });
    if (error) console.error(`Error seeding sector (${sec.slug}):`, error.message);
  }
  console.log("✓ Sectors seeded successfully.");

  // 4. Regions
  console.log("4. Seeding regions...");
  for (let i = 0; i < regionsData.length; i++) {
    const reg = regionsData[i];
    const { error } = await supabase.from("regions").upsert({
      id: reg.id,
      slug: reg.slug,
      flag: reg.flag,
      cover_image: reg.coverImage,
      name: reg.name,
      headline: reg.headline,
      overview: reg.overview,
      beneficiaries_count: reg.beneficiariesCount,
      active_projects_count: reg.activeProjectsCount,
      key_interventions: reg.keyInterventions,
      sort_order: i + 1,
      updated_at: new Date().toISOString(),
    });
    if (error) console.error(`Error seeding region (${reg.slug}):`, error.message);
  }
  console.log("✓ Regions seeded successfully.");

  // 5. Projects
  console.log("5. Seeding projects...");
  for (const proj of initialProjects) {
    const { error } = await supabase.from("projects").upsert({
      id: proj.id,
      slug: proj.slug,
      title: proj.title,
      summary: proj.summary,
      description: proj.description,
      sector_slug: proj.sectorSlug,
      country_slug: proj.countrySlug,
      country_name: proj.countryName,
      target_groups: proj.targetGroups,
      beneficiaries_count: proj.beneficiariesCount,
      goal_amount: proj.goalAmount,
      raised_amount: proj.raisedAmount,
      donors_count: proj.donorsCount,
      status: proj.status,
      featured: proj.featured || false,
      cover_image: proj.coverImage,
      gallery: proj.gallery,
      updates: proj.updates,
      updated_at: new Date().toISOString(),
    });
    if (error) console.error(`Error seeding project (${proj.slug}):`, error.message);
  }
  console.log("✓ Projects seeded successfully.");

  // 6. Bank Accounts
  console.log("6. Seeding bank accounts...");
  for (let i = 0; i < bankAccountsData.length; i++) {
    const b = bankAccountsData[i];
    const { error } = await supabase.from("bank_accounts").upsert({
      id: b.id,
      bank_name: b.bankName,
      account_holder: b.accountHolder,
      currency: b.currency,
      iban: b.iban,
      swift_code: b.swiftCode,
      branch_name: b.branchName,
      icon_color: b.iconColor,
      sort_order: i + 1,
      is_active: true,
    });
    if (error) console.error(`Error seeding bank account (${b.id}):`, error.message);
  }
  console.log("✓ Bank accounts seeded successfully.");

  console.log("\nALL SEEDING OPERATIONS FINISHED!");
}

seed().catch(console.error);
