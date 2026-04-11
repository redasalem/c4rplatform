import AllCarsPageClient from "./AllCarsPageClient";

export const metadata = {
  title: "تشكيلة سيارات للإيجار | أسعار تأجير السيارات في السعودية - C4R",
  description:
    "تصفح تشكيلة واسعة من السيارات للإيجار في السعودية. سيارات فارهة، عائلية، واقتصادية بأسعار منافسة في الرياض، جدة، وغيرها من المدن بشروط ميسرة.",
  openGraph: {
    title: "تشكيلة سيارات للإيجار | سيارات فارهة واقتصادية",
    description: "تصفح أسطول سيارات C4R واحجز سيارتك المفضلة اليوم.",
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
