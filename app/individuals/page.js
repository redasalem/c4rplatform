import IndividualsPageClient from "./IndividualsPageClient";

export const metadata = {
  title: "قسم الأفراد - سيارات للإيجار بأسعار مناسبة",
  description:
    "سيارات للإيجار للأفراد في السعودية بأسعار تنافسية. اقتصادية، عائلية، وفاخرة مع حجز سريع عبر منصة C4R.",
  openGraph: {
    title: "قسم الأفراد - C4R Platform",
    description:
      "استأجر سيارتك المفضلة بأسعار مناسبة من C4R. حجز فوري في الرياض وجدة والشرقية.",
    url: "https://c4rplatform.com/individuals",
  },
};

export default function IndividualsPage() {
  return (
    <main>
      <IndividualsPageClient />
    </main>
  );
}
