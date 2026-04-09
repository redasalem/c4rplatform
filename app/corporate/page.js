import CorporatePageClient from "./CorporatePageClient";

export const metadata = {
  title: "قسم الشركات - تأجير سيارات للمؤسسات والأعمال",
  description:
    "خدمات تأجير سيارات مخصصة للشركات والمؤسسات في السعودية. أسعار تنافسية، عقود مرنة، وأسطول متنوع يلبي احتياجات عملك.",
  openGraph: {
    title: "قسم الشركات - C4R Platform",
    description:
      "حلول تأجير سيارات متكاملة للشركات في الرياض وجدة والمنطقة الشرقية.",
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
