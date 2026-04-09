import WithDriverPageClient from "./WithDriverPageClient";

export const metadata = {
  title: "سيارات بسائق - خدمة التوصيل الخاص في السعودية",
  description:
    "استأجر سيارة مع سائق خاص في الرياض وجدة والمنطقة الشرقية. خدمة احترافية للمشاوير، المناسبات، ورجال الأعمال مع C4R.",
  openGraph: {
    title: "سيارات بسائق - C4R Platform",
    description:
      "خدمة تأجير سيارات مع سائق محترف في جميع مدن المملكة.",
    url: "https://c4rplatform.com/with-driver",
  },
};

export default function WithDriverPage() {
  return (
    <main>
      <WithDriverPageClient />
    </main>
  );
}
