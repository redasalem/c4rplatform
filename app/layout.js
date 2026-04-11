import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import FloatingContact from "@/components/layout/FloatingContact";
import FooterWrapper from "@/components/layout/FooterWrapper";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import Providers from "./providers";
import { Almarai } from "next/font/google";
import "./globals.css";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
});

export const metadata = {
  title: {
    default: "منصة C4R | أفضل تأجير سيارات في السعودية | Car Rental KSA",
    template: "%s | C4R Platform | تأجير سيارات",
  },
  description:
    "احجز مع منصة C4R أفضل وأرخص سيارات للإيجار في السعودية. نوفر تأجير سيارات فخمة واقتصادية، إيجار يومي وشهري في الرياض، جدة والشرقية. Best & affordable car rental in KSA.",
  metadataBase: new URL("https://c4rplatform.com"),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/images/logo.jpeg", sizes: "180x180" }],
  },
  openGraph: {
    title: "منصة C4R | أفضل تأجير سيارات في السعودية | Car Rental KSA",
    description:
      "احجز مع منصة C4R أفضل وأرخص سيارات للإيجار في السعودية. تأجير سيارات فخمة واقتصادية. Best car rental KSA.",
    url: "https://c4rplatform.com",
    siteName: "C4R Platform",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/images/logo.jpeg",
        width: 400,
        height: 227,
        alt: "C4R Platform Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "منصة C4R | تأجير سيارات في السعودية | Car Rental KSA",
    description:
      "أفضل وأرخص سيارات للإيجار في السعودية. حجز سريع. Best car rental KSA.",
    images: ["/images/logo.jpeg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${almarai.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "CarRental",
                  "@id": "https://c4rplatform.com/#carrental",
                  "name": "C4R Platform | سي فور آر لتأجير السيارات",
                  "alternateName": "C4R Car Rental Saudi Arabia",
                  "description": "Best and affordable car rental services in Saudi Arabia. Rent cheap, luxury, and economy cars in Riyadh, Jeddah, and Eastern Province.",
                  "logo": "https://c4rplatform.com/images/logo.jpeg",
                  "url": "https://c4rplatform.com",
                  "telephone": "+966554118873",
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "SA",
                    "addressRegion": "KSA",
                  },
                  "sameAs": [
                    "https://facebook.com/c4rplatform",
                    "https://instagram.com/c4rplatform",
                    "https://twitter.com/c4rplatform",
                    "https://www.tiktok.com/@C4R.Platform"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://c4rplatform.com/#website",
                  "url": "https://c4rplatform.com/",
                  "name": "C4R Platform | سي فور آر لتأجير السيارات",
                  "description": "منصة C4R لتأجير السيارات الفاخرة والاقتصادية في المملكة العربية السعودية.",
                  "inLanguage": "ar-SA"
                }
              ]
            }),
          }}
        />

        <Providers>
          <Navbar />
          <BottomNav />
          <FloatingContact />
          <MainLayoutWrapper>{children}</MainLayoutWrapper>
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}
