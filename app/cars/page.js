import AllCarsPageClient from "./AllCarsPageClient";

export const metadata = {
  title: "جميع السيارات المتاحة للإيجار في السعودية",
  description:
    "تصفح أسطول سيارات C4R المتنوع: سيارات فاخرة، اقتصادية، عائلية، وسيارات بسائق. حجز سريع وأسعار تنافسية في الرياض وجدة والشرقية.",
  openGraph: {
    title: "جميع السيارات - C4R Platform",
    description:
      "اكتشف أفضل عروض تأجير السيارات في السعودية مع منصة C4R.",
    url: "https://c4rplatform.com/cars",
  },
};

export default function AllCarsPage() {
  return (
    <main>
      <AllCarsPageClient />
    </main>
  );
}
