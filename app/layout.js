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
  title: "C4R-Platform | تأجير سيارات في السعودية",
  description:
    "منصة C4R لتأجير السيارات الفاخرة والاقتصادية في المملكة العربية السعودية. حجز سريع وآمن وخدمة عملاء 24/7.",
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
    title: "C4R-Platform | تأجير سيارات في السعودية",
    description:
      "منصة C4R لتأجير السيارات الفاخرة والاقتصادية في المملكة العربية السعودية.",
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
    title: "C4R-Platform | تأجير سيارات في السعودية",
    description:
      "منصة C4R لتأجير السيارات الفاخرة والاقتصادية في المملكة العربية السعودية.",
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
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CarRental",
              "name": "C4R Platform | سي فور آر لتأجير السيارات",
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
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "ما هي شروط تأجير السيارات في السعودية؟",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "يتطلب الحجز هوية سارية، رخصة قيادة معترف بها، وبطاقة ائتمان.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "هل توفرون سيارات مع سائق؟",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "نعم، لدينا خدمة تأجير سيارات بسائق خاص في جميع مدن المملكة.",
                  },
                },
              ],
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
