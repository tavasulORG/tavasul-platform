import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactDepartments } from "@/components/contact/ContactDepartments";
import { ContactFaq } from "@/components/contact/ContactFaq";
import { ContactOffice } from "@/components/contact/ContactOffice";

/**
 * Contact page: a light hero with four live channels, the message form (#form, stored in the
 * contact_messages table) beside a "what happens next" panel, departments that preselect the
 * form topic, a short FAQ, and the office address with opening hours.
 * Copy lives in the contact* keys of data/translations.ts; phone/email/address are the shared keys.
 */
export default function ContactPage() {
  return (
    <div>
      <ContactHero />
      <ContactForm />
      <ContactDepartments />
      <ContactFaq />
      <ContactOffice />
    </div>
  );
}
