import WithDriverPageClient from "./WithDriverPageClient";

export const metadata = {
  title: "تأجير سيارات فخمة مع سائق | خدمة VIP توصيل واستقبال - C4R",
  description:
    "استأجر سيارة مع سائق محترف لخدمات التوصيل، استقبال الشخصيات VIP، والمشاوير الخاصة من وإلى المطارات (الرياض، جدة، الدمام). رفاهية واحترافية من C4R.",
  openGraph: {
    title: "تأجير سيارات فخمة مع سائق | خدمة VIP توصيل واستقبال - C4R",
    description: "سيارات فخمة مع سائقين محترفين لاستقبال الشخصيات والمشاوير الطويلة.",
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
