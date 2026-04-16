import Image from "next/image";
import Link from "next/link";
import { Article, Person, DateRange, ArrowBack, AccessTime } from "@mui/icons-material";
import CarCard from "@/components/cards/CarCard";
import { notFound, redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { cache } from "react";

// New High-Impact Components
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedArticles from "@/components/blog/RelatedArticles";
import { PopularArticles, TrendingCars } from "@/components/blog/SidebarWidgets";
import AuthorBio from "@/components/blog/AuthorBio";
import StickyMobileCTA from "@/components/blog/StickyMobileCTA";
import DynamicContentCTA from "@/components/blog/DynamicContentCTA";
import ContinueReading from "@/components/blog/ContinueReading";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://c4r-platform-backend.vercel.app/api";

// Cached fetch — React deduplicates this across generateMetadata + page render
const getBlog = cache(async (slug) => {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const res = await fetch(`${API_URL}/blogs/${encodedSlug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch blog error:", error);
    return null;
  }
});

// 1. Generation of Metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  try {
    const blog = await getBlog(decodedSlug);
    if (!blog) return { title: "مقال غير موجود | C4R", robots: { index: false } };
    
    const metaTitle = blog.metaTitle || `${blog.title} | مدونة C4R`;
    const metaDescription = blog.metaDescription || blog.summary || blog.title;
    const categorySlug = blog.category?.slug || "general";

    const seoTitle = metaTitle || `${blog.title} | مدونة C4R`;
    const seoDesc = metaDescription || blog.summary || blog.title;
    const imageUrl = blog.image !== 'no-photo.jpg' ? blog.image : "https://c4rplatform.com/images/blog-default.jpg";

    return {
      title: seoTitle,
      description: seoDesc,
      keywords: Array.isArray(blog.focusKeywords) ? blog.focusKeywords.join(", ") : "",
      openGraph: {
        type: "article",
        title: seoTitle,
        description: seoDesc,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: blog.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDesc,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://c4rplatform.com/blog/${categorySlug}/${decodedSlug}`,
      },
    };
  } catch (error) {
    return {
      title: "مقال غير موجود | C4R",
      robots: { index: false }
    };
  }
}

export default async function BlogPostPage({ params }) {
  const { category, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const decodedCategory = decodeURIComponent(category);
  
  const blog = await getBlog(decodedSlug);

  if (!blog) {
    notFound();
  }

  // SEO: Redirect to the correct category URL if there's a mismatch
  const correctCategorySlug = blog.category?.slug || "general";
  if (decodedCategory !== correctCategorySlug) {
      redirect(`/blog/${correctCategorySlug}/${decodedSlug}`);
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

  // 4. FAQ Schema if present
  let faqSchema = null;
  if (blog.faqs && blog.faqs.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": blog.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://c4rplatform.com" },
      { "@type": "ListItem", "position": 2, "name": "المدونة", "item": "https://c4rplatform.com/blog" },
      { "@type": "ListItem", "position": 3, "name": blog.category?.name || "عام" },
      { "@type": "ListItem", "position": 4, "name": blog.title, "item": `https://c4rplatform.com/blog/${category}/${slug}` },
    ],
  };

  return (
    <main className="pt-32 pb-10 px-4 sm:px-6 lg:px-12 xl:px-24 min-h-screen bg-midnight relative" dir="rtl">
      {/* Smart Components Injection */}
      <StickyMobileCTA />
      
      {/* Inject Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold mb-8 group">
          <ArrowBack fontSize="small" className="rotate-180 group-hover:-translate-x-1 transition-transform" /> عودة للمقالات
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">
            {blog.category?.name || "عام"}
          </span>
          {blog.readingTime && (
             <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                <AccessTime sx={{ fontSize: 14 }} /> {blog.readingTime} دقائق للقراءة
             </div>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.2] mb-8 tracking-tighter">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-bold border-y border-white/5 py-6">
          <div className="flex items-center gap-2" suppressHydrationWarning><DateRange fontSize="small" className="text-primary" /> {new Date(blog.createdAt).toLocaleDateString("ar-SA", { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div className="flex items-center gap-2"><Person fontSize="small" className="text-primary" /> بقلم خبراء C4R</div>
          <div className="flex items-center gap-2 text-white/80"><span className="text-primary">👁</span> {blog.views || 1} {blog.views === 1 ? 'مشاهدة' : 'مشاهدات'}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 relative">
        {/* Sidebar (Desktop Hidden on Mobile or move down) */}
        <aside className="lg:w-1/3 order-2">
          <div className="sticky top-32 space-y-8">
            <TableOfContents />
            
            {blog.relatedCars?.length > 0 ? (
              <div className="space-y-6">
                 <h3 className="text-xl font-black text-white px-2 border-r-4 border-primary">سيارات موصى بها</h3>
                 <div className="grid grid-cols-1 gap-6">
                    {blog.relatedCars.map((car) => {
                      const formattedCar = { ...car, name: car.name || `${car.make} ${car.model}`, brand: car.brand || car.make };
                      return <CarCard key={car._id} car={formattedCar} />;
                    })}
                 </div>
              </div>
            ) : (
              <TrendingCars />
            )}
            
            <PopularArticles excludeId={blog._id} />
          </div>
        </aside>

        {/* Main Article Content */}
        <article className="lg:w-2/3 order-1">
          {blog.image && blog.image !== 'no-photo.jpg' && (
            <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] rounded-[3rem] overflow-hidden mb-12 shadow-2xl border border-white/5">
              <Image src={blog.image} alt={blog.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          {/* Intro Section - Start of Content */}
          <div 
            className="prose prose-invert prose-orange max-w-none text-slate-300 prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-white/5 prose-a:text-primary hover:prose-a:text-orange-400 transition-all prose-img:rounded-[2rem] leading-loose font-medium text-lg lg:text-xl"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content, { ADD_TAGS: ['iframe', 'h2', 'h3', 'p', 'ul', 'li', 'strong', 'em', 'img'], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'src', 'alt', 'id'] }) }}
          />

          {/* Contextual CTA Injection */}
          <DynamicContentCTA />

          {/* Post Content Footwear */}
          <AuthorBio />
          
          <ContinueReading currentBlogId={blog._id} categoryId={blog.category?._id} />
          
          <RelatedArticles currentBlogId={blog._id} />
        </article>
      </div>
    </main>
  );
}

