import AboutPageClient from "./AboutPageClient";

export const metadata = {
  title: "من نحن - تعرف على منصة C4R لتأجير السيارات",
  description:
    "منصة C4R هي وجهتك الأولى لتأجير السيارات في السعودية. نعمل كوسيط موثوق بينك وبين أفضل مكاتب التأجير مع دعم 24/7.",
  openGraph: {
    title: "من نحن - C4R Platform",
    description:
      "تعرف على قصة C4R ورؤيتنا في تسهيل تأجير السيارات في المملكة العربية السعودية.",
    url: "https://c4rplatform.com/about",
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutPageClient />
    </main>
  );
}
