import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import FloatingContact from "@/components/layout/FloatingContact";
import FooterWrapper from "@/components/layout/FooterWrapper";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "./providers";
import { Almarai } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
});

export const viewport = {
  themeColor: "#0D1117",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  // ... (keeping existing metadata)
  title: {
    default: "منصة C4R | أفضل تأجير سيارات في السعودية | Car Rental KSA",
    template: "%s | C4R Platform | تأجير سيارات",
  },
  description: "احجز مع منصة C4R أفضل وأرخص سيارات للإيجار في السعودية بأسعار تبدأ من 200 ريال. نوفر تأجير سيارات فخمة واقتصادية، إيجار يومي وشهري في الرياض، جدة والشرقية.",
  metadataBase: new URL("https://c4rplatform.com"),
};

export default async function RootLayout({ children }) {
  const headerList = await headers();
  const lang = headerList.get("x-lang") || "ar";
  const dir = headerList.get("x-dir") || "rtl";

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <body
        className={`${almarai.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
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
                    "description": "Best and affordable car rental services in Saudi Arabia starting from 200 SAR. Rent cheap, luxury, and economy cars in Riyadh, Jeddah, and Eastern Province.",
                    "logo": "https://c4rplatform.com/images/logo.jpeg",
                    "url": "https://c4rplatform.com",
                    "telephone": "+966554118873",
                    "priceRange": "SAR 200 - SAR 5000",
                    "address": {
                      "@type": "PostalAddress",
                      "addressCountry": "SA",
                      "addressRegion": "Riyadh",
                      "addressLocality": "Riyadh",
                      "streetAddress": "الرياض، المملكة العربية السعودية"
                    },
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": "4.9",
                      "reviewCount": "1250"
                    },
                    "sameAs": [
                      "https://www.instagram.com/C4R_Platform",
                      "https://x.com/C4R_Platform",
                      "https://www.tiktok.com/@C4R.Platform"
                    ]
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://c4rplatform.com/#website",
                    "url": "https://c4rplatform.com/",
                    "name": "C4R Platform | سي فور آر لتأجير السيارات",
                    "description": "منصة C4R لتأجير السيارات الفاخرة والاقتصادية في المملكة العربية السعودية بأسعار تبدأ من 200 ريال.",
                    "inLanguage": "ar-SA",
                    "potentialAction": {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://c4rplatform.com/cars?search={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }
                  }
                ]
              }),
            }}
          />

          <Providers lang={lang} dir={dir}>
            <Navbar />
            <BottomNav />
            <FloatingContact />
            <MainLayoutWrapper>{children}</MainLayoutWrapper>
            <FooterWrapper />
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
