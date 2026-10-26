import { BanksHero } from "@/components/bank-accounts/BanksHero";
import { BanksLedger } from "@/components/bank-accounts/BanksLedger";
import { BanksSteps } from "@/components/bank-accounts/BanksSteps";
import { BanksNotes } from "@/components/bank-accounts/BanksNotes";
import { BanksCta } from "@/components/bank-accounts/BanksCta";

/**
 * Bank accounts page: the official beneficiary card, a currency-filtered ledger with a transfer
 * sheet (#accounts), the three steps of a transfer donation, notes with a trust panel, and a CTA.
 * Account data lives in data/bankAccounts.ts; copy in the bank* keys of data/translations.ts.
 */
export default function BankAccountsPage() {
  return (
    <div>
      <BanksHero />
      <BanksLedger />
      <BanksSteps />
      <BanksNotes />
      <BanksCta />
    </div>
  );
}
