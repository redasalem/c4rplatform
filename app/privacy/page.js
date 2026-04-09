import PrivacyPageClient from "./PrivacyPageClient";

export const metadata = {
  title: "سياسة الخصوصية - حماية بياناتك مع C4R",
  description:
    "تعرف على سياسة الخصوصية لمنصة C4R وكيفية حماية بياناتك الشخصية أثناء استخدام خدمات تأجير السيارات.",
  openGraph: {
    title: "سياسة الخصوصية - C4R Platform",
    description: "سياسة حماية البيانات والخصوصية لمنصة C4R لتأجير السيارات.",
    url: "https://c4rplatform.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main>
      <PrivacyPageClient />
    </main>
  );
}
