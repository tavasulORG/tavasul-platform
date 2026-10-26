/**
 * Visual identity of the banks that hold the association's accounts.
 * Logos are the banks' own SVG files (taken from their public websites) under public/images/banks/;
 * each entry is matched to data/bankAccounts.ts by the exact `bankName` string.
 */
export interface BankBrand {
  slug: string;
  /** Exact `bankName` used in data/bankAccounts.ts. */
  name: string;
  shortName: string;
  /** Primary brand colour, used only as a thin accent beside the bank's logo. */
  color: string;
  /** Full logo (mark + wordmark) for light backgrounds. */
  logo: string;
  /** Intrinsic width / height of the logo file. */
  ratio: number;
  website: string;
}

export const banksData: BankBrand[] = [
  {
    slug: "kuveyt-turk",
    name: "Kuveyt Türk Katılım Bankası",
    shortName: "Kuveyt Türk",
    color: "#43B02A",
    logo: "/images/banks/kuveyt-turk.svg",
    ratio: 227 / 41,
    website: "https://www.kuveytturk.com.tr",
  },
  {
    slug: "ziraat-katilim",
    name: "Ziraat Katılım Bankası",
    shortName: "Ziraat Katılım",
    color: "#EB2227",
    logo: "/images/banks/ziraat-katilim.svg",
    ratio: 283 / 53,
    website: "https://www.ziraatkatilim.com.tr",
  },
  {
    slug: "vakif-katilim",
    name: "Vakıf Katılım Bankası",
    shortName: "Vakıf Katılım",
    color: "#D12580",
    logo: "/images/banks/vakif-katilim.svg",
    ratio: 216 / 48,
    website: "https://www.vakifkatilim.com.tr",
  },
];

export function bankBrand(bankName: string): BankBrand | undefined {
  return banksData.find((bank) => bank.name === bankName);
}
