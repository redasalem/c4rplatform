import Link from "next/link";
import Image from "next/image";
import { Article } from "@mui/icons-material";
import { Suspense } from "react";

export const metadata = {
  title: "مدونة C4R | نصائح وإرشادات حول تأجير السيارات",
  description:
    "مكتبة شاملة من المقالات، النصائح، وإرشادات حجز وعناية السيارات. تعرف على أفضل خيارات التأجير وأسرار توفير المال.",
  openGraph: {
    title: "مدونة C4R | المقالات والأخبار",
    description: "تصفح أحدث أخبار تأجير السيارات ونصائح السفر من منصة C4R.",
    url: "https://c4rplatform.com/blog",
  },
  alternates: {
    canonical: "https://c4rplatform.com/blog",
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://c4r-platform-backend.vercel.app/api";

async function getBlogs() {
  const res = await fetch(`${API_URL}/blogs?status=published`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return { data: [] };
  return res.json();
}

async function BlogList() {
  const data = await getBlogs();
  const blogs = data?.data || [];

  if (blogs.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem] mt-4">
        <Article sx={{ fontSize: 60, color: "rgba(255,255,255,0.2)" }} className="mb-4" />
        <h2 className="text-2xl font-black text-slate-500">لا يوجد مقالات حتى الآن</h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {blogs.map((blog) => (
        <Link 
          key={blog._id} 
          href={`/blog/${blog.category?.slug || 'general'}/${blog.slug}`}
          className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 group flex flex-col items-start"
        >
          <div className="relative h-56 w-full bg-slate-800 overflow-hidden">
            {blog.image && blog.image !== 'no-photo.jpg' ? (
              <Image 
                src={blog.image} 
                alt={blog.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <Article sx={{ fontSize: 60, opacity: 0.5 }} />
              </div>
            )}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-white font-black">
              {blog.category?.name || "عام"}
            </div>
          </div>
          
          <div className="p-6 md:p-8 flex-1 flex flex-col">
            <h2 className="text-xl md:text-2xl font-black text-white mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {blog.title}
            </h2>
            <p className="text-sm md:text-base text-slate-400 font-medium mb-6 line-clamp-3 leading-relaxed flex-1">
              {blog.summary}
            </p>
            
            <div className="flex justify-between items-center w-full pt-4 border-t border-white/5 mt-auto">
              <span className="text-xs font-bold text-slate-500">
                {new Date(blog.createdAt).toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="text-primary font-black text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                اقرأ المزيد <span>←</span>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function BlogPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": "https://c4rplatform.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "المدونة",
        "item": "https://c4rplatform.com/blog",
      },
    ],
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 sm:px-6 md:px-12 lg:px-24" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tighter">
            مدونة <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">C4R</span>
          </h1>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">
            دليلك الشامل لكل ما يخص تأجير السيارات، الصيانة، والسفر. أحدث المقالات والنصائح لتحسين تجربتك.
          </p>
        </div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center animate-pulse bg-white/5 rounded-[3rem]">جاري التحميل...</div>}>
          <BlogList />
        </Suspense>
      </div>
    </main>
  );
}
