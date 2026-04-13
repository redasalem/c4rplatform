import Image from "next/image";
import Link from "next/link";
import { Article, Person, DateRange, ArrowBack } from "@mui/icons-material";
import CarCard from "@/components/cards/CarCard";
import DOMPurify from "isomorphic-dompurify";
import { cache } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://c4r-platform-backend.vercel.app/api";

// Cached fetch — React deduplicates this across generateMetadata + page render
const getBlog = cache(async (slug) => {
  const res = await fetch(`${API_URL}/blogs/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data;
});

// 1. Generation of Metadata
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    const blog = await getBlog(slug);
    if (!blog) throw new Error("Not found");
    
    return {
      title: `${blog.title} | مدونة C4R`,
      description: blog.summary || blog.title,
      openGraph: {
        title: blog.title,
        description: blog.summary || blog.title,
        images: [blog.image !== 'no-photo.jpg' ? blog.image : "https://c4rplatform.com/images/blog-default.jpg"],
      },
      alternates: {
        canonical: `https://c4rplatform.com/blog/${params.category}/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: "مقال غير موجود | C4R",
    };
  }
}

export default async function BlogPostPage({ params }) {
  const { category, slug } = params;
  const blog = await getBlog(slug);

  if (!blog) {
    return (
      <main className="min-h-screen pt-40 pb-20 px-4 text-center">
        <h1 className="text-3xl text-white font-black">عذراً، المقال غير موجود!</h1>
        <Link href="/blog" className="text-primary mt-4 inline-block font-bold">العودة للمدونة ←</Link>
      </main>
    );
  }

  // 3. Structured Data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.summary,
    "image": blog.image !== 'no-photo.jpg' ? blog.image : "https://c4rplatform.com/images/blog-default.jpg",
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt,
    "author": {
      "@type": "Organization",
      "name": "C4R Platform"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://c4rplatform.com" },
      { "@type": "ListItem", "position": 2, "name": "المدونة", "item": "https://c4rplatform.com/blog" },
      { "@type": "ListItem", "position": 3, "name": blog.category?.name || "عام", "item": `https://c4rplatform.com/blog/${category}` },
      { "@type": "ListItem", "position": 4, "name": blog.title, "item": `https://c4rplatform.com/blog/${category}/${slug}` },
    ],
  };

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24 min-h-screen" dir="rtl">
      {/* Inject Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-4xl mx-auto mb-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold mb-6">
          <ArrowBack fontSize="small" className="rotate-180" /> عودة للمقالات
        </Link>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-xs font-black">
            {blog.category?.name || "عام"}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-bold mb-10">
          <div className="flex items-center gap-1.5"><DateRange fontSize="small" /> {new Date(blog.createdAt).toLocaleDateString("ar-SA")}</div>
          <div className="flex items-center gap-1.5"><Person fontSize="small" /> فريق C4R</div>
          <div className="flex items-center gap-1.5">👁 {blog.views || 1} قراءة</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Main Article Content */}
        <article className="lg:w-2/3">
          {blog.image && blog.image !== 'no-photo.jpg' && (
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-10 shadow-2xl">
              <Image src={blog.image} alt={blog.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />
            </div>
          )}

          {/* Quick CTA Middle */}
          {blog.relatedCars?.length > 0 && (
             <div className="bg-gradient-to-r from-primary/10 to-transparent border-r-4 border-primary p-6 rounded-l-2xl mb-10">
               <h3 className="text-xl font-black text-white mb-2">🚗 مهتم بتأجير سيارة؟</h3>
               <p className="text-slate-300 font-medium mb-4">اكتشف السيارات المتعلقة بهذا المقال بأسعار تنافسية تبدأ من 200 ريال!</p>
               <Link href="#related-cars" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg inline-block">
                 شاهد السيارات المرتبطة
               </Link>
             </div>
          )}

          <div 
            className="prose prose-invert prose-orange max-w-none text-slate-300 prose-headings:text-white prose-a:text-primary hover:prose-a:text-orange-400 prose-img:rounded-2xl leading-loose font-medium"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content, { ADD_TAGS: ['iframe'], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target'] }) }}
          />

          {/* Final CTA — End of Article */}
          <div className="mt-14 bg-gradient-to-br from-primary/15 via-white/5 to-accent/10 border border-primary/20 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3">🚘 جاهز تحجز سيارتك؟</h3>
            <p className="text-slate-300 font-medium mb-6 max-w-lg mx-auto">تصفّح أفضل السيارات المتاحة للإيجار بأسعار تنافسية وخدمة عملاء مميزة من C4R.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cars" className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-[0_10px_30px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_15px_35px_-10px_rgba(249,115,22,0.6)] inline-block">
                تصفّح السيارات
              </Link>
              <Link href="/blog" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-bold border border-white/10 transition-all inline-block">
                المزيد من المقالات
              </Link>
            </div>
          </div>
        </article>

        {/* Sidebar: Related Cars */}
        {blog.relatedCars?.length > 0 && (
          <aside className="lg:w-1/3" id="related-cars">
            <div className="sticky top-32">
              <h3 className="text-2xl font-black text-white mb-6 border-b border-white/10 pb-4">
                سيارات يوصى بها
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {blog.relatedCars.map((car) => {
                  // Ensure backwards compatibility with CarCard depending on backend response shape
                  const formattedCar = {
                    ...car,
                    name: car.name || `${car.make} ${car.model}`,
                    brand: car.brand || car.make,
                  };
                  return <CarCard key={car._id} car={formattedCar} />;
                })}
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
