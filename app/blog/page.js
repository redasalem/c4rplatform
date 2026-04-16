import Link from "next/link";
import Image from "next/image";
import { Article, Search } from "@mui/icons-material";
import { Suspense } from "react";
import React from "react";

export async function generateMetadata({ searchParams }) {
  const pParams = await searchParams;
  const q = pParams.q || "";
  const page = parseInt(pParams.page) || 1;

  const title = q 
    ? `نتائج البحث عن "${q}" | مدونة C4R` 
    : "المدونة | أخبار وعروض السيارات في السعودية - C4R";
  const description = q 
    ? `نتائج البحث عن ${q} في مدونة C4R. اكتشف أحدث المقالات والنصائح حول السيارات.`
    : "تابع أحدث أخبار السيارات، نصائح الصيانة، وعروض الإيجار في السعودية عبر مدونة C4R.";

  const canonical = q 
    ? "https://c4rplatform.com/blog"
    : page > 1 
      ? `https://c4rplatform.com/blog?page=${page}`
      : "https://c4rplatform.com/blog";

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: q ? "noindex, follow" : "index, follow",
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://c4r-platform-backend.vercel.app/api";

async function getBlogs(searchParams = {}) {
  const page = searchParams.page || 1;
  const search = searchParams.q || "";
  const limit = 9;
  
  const res = await fetch(`${API_URL}/blogs?status=published&page=${page}&limit=${limit}&search=${search}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return { data: [] };
  return res.json();
}

function BlogCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      <div className="relative h-56 w-full bg-slate-800 animate-pulse" />
      <div className="p-6 md:p-8 space-y-4">
        <div className="h-6 bg-slate-700 rounded animate-pulse w-1/4" />
        <div className="h-8 bg-slate-700 rounded animate-pulse w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-700 rounded animate-pulse w-full" />
          <div className="h-4 bg-slate-700 rounded animate-pulse w-2/3" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <div className="h-4 bg-slate-700 rounded animate-pulse w-24" />
          <div className="h-4 bg-slate-700 rounded animate-pulse w-20" />
        </div>
      </div>
    </div>
  );
}

async function BlogList({ searchParams }) {
  const data = await getBlogs(searchParams);
  const blogs = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1, currentPage: 1 };

  if (blogs.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem] mt-4">
        <Article sx={{ fontSize: 60, color: "rgba(255,255,255,0.2)" }} className="mb-4" />
        <h2 className="text-2xl font-black text-slate-500">لا يوجد مقالات حتى الآن</h2>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {blogs.map((blog) => (
          <Link 
            key={blog._id} 
            href={`/blog/${blog._id}`}
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
                <span className="text-xs font-bold text-slate-500" suppressHydrationWarning>
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

      {pagination.totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-3" role="navigation" aria-label="Pagination">
            {[...Array(pagination.totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = pagination.currentPage === pageNum;
              
              const shouldShowPage = 
                pageNum === 1 || 
                pageNum === pagination.totalPages ||
                Math.abs(pageNum - pagination.currentPage) <= 1 ||
                (pageNum <= 3 && pagination.currentPage <= 4) ||
                (pageNum >= pagination.totalPages - 2 && pagination.currentPage >= pagination.totalPages - 3);

              const shouldShowEllipsisBefore = pageNum === 4 && pagination.currentPage > 5;
              const shouldShowEllipsisAfter = pageNum === pagination.totalPages - 3 && pagination.currentPage < pagination.totalPages - 4;

              if (!shouldShowPage) return null;

              return (
                <React.Fragment key={i}>
                  {shouldShowEllipsisBefore && (
                    <span className="w-12 h-12 flex items-center justify-center text-slate-500">...</span>
                  )}
                  <Link
                    href={`/blog?page=${pageNum}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl font-black transition-all ${
                        isActive 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`Page ${pageNum}`}
                  >
                    {pageNum}
                  </Link>
                  {shouldShowEllipsisAfter && (
                    <span className="w-12 h-12 flex items-center justify-center text-slate-500">...</span>
                  )}
                </React.Fragment>
              );
            })}
        </div>
      )}
    </>
  );
}

export default async function BlogPage({ searchParams }) {
  const spa = await searchParams;
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
        <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
                مدونة <span className="text-primary italic">C4R</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                اكتشف عالم السيارات في السعودية. من أحدث تكنولوجيا القيادة إلى أفضل نصائح الصيانة وعروض الإيجار الحصرية.
            </p>
        </div>

        <div className="max-w-xl mx-auto mb-16">
            <form action="/blog" method="GET" className="relative group" role="search">
                <label htmlFor="blog-search" className="sr-only">البحث في المدونة</label>
                <input 
                    id="blog-search"
                    type="text" 
                    name="q"
                    placeholder="ابحث عن نصائح، صيانة، أو أخبار السيارات..."
                    defaultValue={spa.q || ""}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-14 text-white font-bold focus:outline-none focus:border-primary/50 transition-all group-hover:bg-white/10"
                    aria-label="البحث في المدونة"
                />
                <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors" aria-label="بحث">
                    <Search sx={{ fontSize: 24 }} />
                </button>
            </form>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => <BlogCardSkeleton key={i} />)}
          </div>
        }>
          <BlogList searchParams={spa} />
        </Suspense>
      </div>
    </main>
  );
}
