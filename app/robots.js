export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/booking/", "/auth/", "/api/"],
      },
    ],
<<<<<<< HEAD
    sitemap: "https://c4rplatform.com/sitemap.xml",
=======
    sitemap: "https://c4rplatform.vercel.app/sitemap.xml",
>>>>>>> a540829 (chore: major technical SEO overhaul, Server Components migration, structured data and footer links updates)
  };
}
