import TermsPageClient from "./TermsPageClient";

export const metadata = {
  title: "الشروط والأحكام - تأجير السيارات",
  description:
    "شروط وأحكام استخدام منصة C4R لتأجير السيارات في السعودية: تأكيد الحجز، سياسة الإلغاء، طرق الدفع، والتوصيل.",
  openGraph: {
    title: "الشروط والأحكام - C4R Platform",
    description: "اطلع على شروط وأحكام تأجير السيارات مع منصة C4R.",
    url: "https://c4rplatform.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main>
      <TermsPageClient />
    </main>
  );
}
