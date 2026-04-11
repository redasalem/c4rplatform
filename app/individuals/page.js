import IndividualsPageClient from "./IndividualsPageClient";

export const metadata = {
  title: "تأجير سيارات أفراد | عروض حصرية يومية وشهرية - C4R",
  description:
    "احجز سيارتك المفضلة للإيجار اليومي أو الشهري بأفضل الأسعار. تشكيلة سيارات اقتصادية وعائلية وفاخرة من منصة C4R في الرياض، جدة، والدمام.",
  openGraph: {
    title: "تأجير سيارات أفراد | عروض حصرية يومية وشهرية - C4R",
    description: "اطلع على أفضل عروض الإيجار اليومي والشهري للسيارات في السعودية.",
    url: "https://c4rplatform.com/individuals",
  },
  alternates: {
    canonical: "https://c4rplatform.com/individuals",
  },
};

export default function IndividualsPage() {
  return (
    <main>
      <IndividualsPageClient />
    </main>
  );
}
