import CorporatePageClient from "./CorporatePageClient";

export const metadata = {
  title: "تأجير سيارات للشركات | عروض وخصومات حصرية - C4R",
  description:
    "حلول تأجير السيارات للشركات والمؤسسات في السعودية من منصة C4R. احصل على أسطول سيارات حديث بأسعار مخفضة وعقود تأجير طويلة وقصيرة الأجل.",
  openGraph: {
    title: "تأجير سيارات للشركات | عروض وخصومات حصرية - C4R",
    description: "حلول تأجير السيارات للشركات والمؤسسات بأسعار مميزة وعقود مرنة.",
    url: "https://c4rplatform.com/corporate",
  },
};

export default function CorporatePage() {
  return (
    <main>
      <CorporatePageClient />
    </main>
  );
}
