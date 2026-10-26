# Tawasul platform

Next.js 16 site of Tawasul Relief and Development Association with a built-in admin panel on Supabase.

```bash
npm install
npm run dev      # http://localhost:3000
```

Environment (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # server only: used by the admin API routes
```

## Admin panel (`/admin`)

First run, once:

1. Run `supabase/schema.sql` in the Supabase SQL editor (tables, policies, the `media` storage bucket). The login page shows these steps with a copy button until the tables exist.
2. Open `/admin/login` and create the first admin account.
3. On the dashboard click **استيراد المحتوى الافتراضي** to copy the content shipped in `data/*.ts` into the database.

What it manages, each with a live preview of the real page before saving:

| Section | Table | Site pages |
| --- | --- | --- |
| نصوص الموقع (ar / tr / en) | `translations` | all |
| الصفحة الرئيسية (hero video, impact stories) | `site_settings` | `/` |
| عن تواصل (story, vision, goals, values, board, reports, partners) | `organization_info` | `/about` |
| مجالات العمل · أين نعمل · المشاريع · الحسابات البنكية | `sectors` · `regions` · `projects` · `bank_accounts` | `/sectors` · `/where-we-work` · `/projects` · `/bank-accounts` |
| مكتبة الوسائط (upload from device) | Storage bucket `media` | — |
| الرسائل الواردة · التبرعات | `contact_messages` · `donations` | — |
| إعدادات الموقع · المستخدمون والصلاحيات · سجل النشاط | `site_settings` · Supabase Auth · `admin_audit_log` | — |

Roles: **admin** (everything) and **editor** (content, media, messages). The role is stored in the user's `app_metadata.role`; `ADMIN_EMAILS` (comma separated) can grant admin to extra emails.

How it fits together:

- `context/ContentContext.tsx` loads sectors, regions, bank accounts, organization info and settings from Supabase, with `data/*.ts` as the fallback. `context/LanguageContext.tsx` does the same for texts and `context/DonationContext.tsx` for projects.
- `lib/previewBridge.ts`: the admin embeds a page with `?preview=1` in an iframe and posts the unsaved draft; the providers above render the draft instead of the saved data.
- `app/api/admin/*`: all writes go through these routes with the service role key after verifying the admin's token (`lib/adminAuth.ts`); `lib/adminTables.ts` is the allowlist.
- `components/admin/SchemaForm.tsx` renders every editor from a field schema; `components/admin/editors/*` hold the schemas per content type.
