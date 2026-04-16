import Image from "next/image";
import Link from "next/link";
import { Person, DateRange, ArrowBack, AccessTime } from "@mui/icons-material";
import CarCard from "@/components/cards/CarCard";
import { notFound } from "next/navigation";
import { cache } from "react";

import BlogProgressBar from "@/components/blog/BlogProgressBar";
import BlogShare from "@/components/blog/BlogShare";
import TableOfContents from "@/components/blog/TableOfContents";
import TableOfContentsDrawer from "@/components/blog/TableOfContentsDrawer";
import RelatedArticles from "@/components/blog/RelatedArticles";
import { PopularArticles, TrendingCars } from "@/components/blog/SidebarWidgets";
import AuthorBio from "@/components/blog/AuthorBio";
import StickyMobileCTA from "@/components/blog/StickyMobileCTA";
import DynamicContentCTA from "@/components/blog/DynamicContentCTA";
import ContinueReading from "@/components/blog/ContinueReading";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://c4r-platform-backend.vercel.app/api";

const getBlog = cache(async (id) => {
  try {
    const apiUrl = `${API_URL}/blogs/${id}`;
    
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      return null;
    }
    
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
});

const formatArabicDate = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        const day = date.getDate();
        const year = date.getFullYear();
        const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        return `${day} ${monthNames[date.getMonth()]} ${year}`;
    } catch (e) {
        return "";
    }
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!id) return { title: "المدونة | C4R" };
  
  try {
    const blog = await getBlog(id);
    if (!blog) return { title: "مقال غير موجود | C4R" };
    
    const imageUrl = blog.image && blog.image !== 'no-photo.jpg' ? blog.image : "https://c4rplatform.com/images/blog-default.jpg";
    const metaTitle = blog.metaTitle || `${blog.title} | مدونة C4R`;
    const metaDescription = blog.metaDescription || blog.summary || blog.title;

    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical: `https://c4rplatform.com/blog/${id}`,
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        images: [{ url: imageUrl, width: 1200, height: 630 }],
        type: "article",
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
        authors: ["C4R Experts"],
        publisher: "C4R Platform",
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return { title: "مدونة C4R" };
  }
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  if (!id) return notFound();
  
  const blog = await getBlog(id);
  if (!blog) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.summary || blog.metaDescription || blog.title,
    image: blog.image && blog.image !== 'no-photo.jpg' ? blog.image : "https://c4rplatform.com/images/blog-default.jpg",
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://c4rplatform.com/blog/${id}`
    },
    author: {
      "@type": "Organization",
      "name": "C4R Experts",
      "url": "https://c4rplatform.com"
    },
    publisher: {
      "@type": "Organization",
      "name": "C4R Platform",
      "logo": {
        "@type": "ImageObject",
        "url": "https://c4rplatform.com/images/logo.jpeg"
      }
    },
    wordCount: blog.content ? blog.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0,
    timeRequired: blog.readingTime ? `PT${blog.readingTime}M` : undefined
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://c4rplatform.com" },
      { "@type": "ListItem", "position": 2, "name": "المدونة", "item": "https://c4rplatform.com/blog" },
      { "@type": "ListItem", "position": 3, "name": blog.category?.name || "عام" },
      { "@type": "ListItem", "position": 4, "name": blog.title, "item": `https://c4rplatform.com/blog/${id}` },
    ],
  };

  const sanitizedContent = (() => {
    try {
      const createDOMPurify = require('isomorphic-dompurify');
      return createDOMPurify.sanitize(blog.content || "", { 
        ADD_TAGS: ['iframe', 'h2', 'h3', 'p', 'ul', 'li', 'strong', 'em', 'img', 'blockquote', 'code', 'pre', 'figcaption'], 
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'src', 'alt', 'id'] 
      });
    } catch {
      console.error('[Security] DOMPurify failed to load — content blocked');
      return "<p>Content could not be displayed safely.</p>";
    }
  })();

  return (
    <main className="pt-20 pb-16 min-h-screen bg-midnight" dir="rtl">
      <BlogProgressBar />
      <StickyMobileCTA />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header Section - Medium Style */}
      <header className="max-w-[720px] mx-auto px-4 sm:px-6 pt-8 pb-0">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-8 group"
          aria-label="العودة للمقالات"
        >
          <ArrowBack fontSize="small" className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
          المقالات
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide">
            {blog.category?.name || "عام"}
          </span>
          {blog.readingTime && (
            <span className="bg-slate-800/50 backdrop-blur-sm text-slate-300 rounded-full px-4 py-1.5 text-sm flex items-center gap-1.5">
              <AccessTime sx={{ fontSize: 14 }} /> 
              {blog.readingTime} دقائق للقراءة
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            <DateRange sx={{ fontSize: 16, color: "#f97316" }} />
            <span>{formatArabicDate(blog.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Person sx={{ fontSize: 16, color: "#f97316" }} />
            <span>خبراء C4R</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">👁</span>
            <span>{blog.views || 1} مشاهدات</span>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {blog.image && blog.image !== 'no-photo.jpg' && (
        <figure className="max-w-[900px] mx-auto px-4 sm:px-6 mt-8">
          <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <Image 
              src={blog.image} 
              alt={blog.title} 
              fill 
              className="object-cover" 
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 900px"
            />
          </div>
        </figure>
      )}

      {/* Content Layout - Two Column on Desktop */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Mobile ToC Drawer */}
        <TableOfContentsDrawer />

        <div className="flex gap-12 lg:gap-16">
          {/* Main Content */}
          <article className="flex-1 min-w-0 max-w-[720px] mx-auto lg:mx-0">
            {/* Enhanced Prose Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none text-slate-300 
                prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:leading-loose prose-p:my-6
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-2xl prose-img:shadow-2xl prose-img:ring-1 prose-img:ring-white/10
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-white/5 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-300
                prose-code:text-primary prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-slate-900 prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto
                prose-ul:my-4 prose-li:my-2
                leading-loose"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Dynamic CTA */}
            <DynamicContentCTA />

            {/* Author Bio - Elite Style */}
            <AuthorBio />

            {/* Share Section */}
            <BlogShare title={blog.title} url={`/blog/${id}`} />

            {/* Navigation */}
            <ContinueReading currentBlogId={blog._id} categoryId={blog.category?._id} />
            <RelatedArticles currentBlogId={blog._id} />
          </article>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              <TableOfContents />
              
              {blog.relatedCars && blog.relatedCars.filter(c => c && typeof c === 'object').length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full" />
                    سيارات موصى بها
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {blog.relatedCars.filter(c => c && typeof c === 'object').slice(0, 2).map((car) => {
                      const carImage = Array.isArray(car.image) ? car.image[0] : (car.image || "/images/car-placeholder.png");
                      const formattedCar = { ...car, image: carImage, name: car.name || `${car.brand || ""} ${car.model || ""}`.trim() };
                      return <CarCard key={car._id} car={formattedCar} variant="dark" />;
                    })}
                  </div>
                </div>
              ) : (
                <TrendingCars />
              )}
              
              <PopularArticles excludeId={blog._id} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
