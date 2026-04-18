import Image from "next/image";
import Link from "next/link";
import { 
  ArrowBack, 
  BookmarkBorder, 
  CarRental,
  Facebook,
  Twitter,
  WhatsApp,
} from "@mui/icons-material";
import CarCard from "@/components/cards/CarCard";
import { notFound } from "next/navigation";
import { cache } from "react";
import DOMPurify from 'isomorphic-dompurify';

import BlogProgressBar from "@/components/blog/BlogProgressBar";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedArticles from "@/components/blog/RelatedArticles";
import { PopularArticles, TrendingCars } from "@/components/blog/SidebarWidgets";
import AuthorBio from "@/components/blog/AuthorBio";
import StickyMobileCTA from "@/components/blog/StickyMobileCTA";
import DynamicContentCTA from "@/components/blog/DynamicContentCTA";
import ContinueReading from "@/components/blog/ContinueReading";

import { Tooltip, IconButton } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://c4r-platform-backend.vercel.app/api";

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

const getBlog = cache(async (id) => {
  try {
    const apiUrl = `${API_URL}/blogs/${id}`;
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!id) return { title: "المدونة | C4R" };
  try {
    const blog = await getBlog(id);
    if (!blog) return { title: "مقال غير موجود | C4R" };
    const imageUrl = blog.image && blog.image !== 'no-photo.jpg' ? blog.image : "https://c4rplatform.com/images/blog-default.jpg";
    return {
      title: blog.metaTitle || `${blog.title} | مدونة C4R`,
      description: blog.metaDescription || blog.summary || blog.title,
      alternates: { canonical: `https://c4rplatform.com/blog/${id}` },
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.summary,
        images: [{ url: imageUrl, width: 1200, height: 630 }],
        type: "article",
        publishedTime: blog.createdAt,
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

  const wordCount = blog.content ? blog.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
  const calculatedReadingTime = Math.ceil(wordCount / 200) || 1;

  const sanitizedContent = (() => {
    try {
      return DOMPurify.sanitize(blog.content || "", { 
        ADD_TAGS: ['iframe', 'h2', 'h3', 'p', 'ul', 'li', 'strong', 'em', 'img', 'blockquote', 'code', 'pre', 'figcaption'], 
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'src', 'alt', 'id'] 
      });
    } catch {
      return "<p>Content could not be displayed safely.</p>";
    }
  })();

  const shareUrl = `https://c4rplatform.com/blog/${id}`;
  const shareTitle = blog.title;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden" dir="rtl">
      <BlogProgressBar />
      <StickyMobileCTA />
      
      {/* 1. Cinematic Header Area */}
      <header className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 bg-[#020617]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-4 hover:opacity-70 transition-opacity">
            <ArrowBack fontSize="small" className="rotate-180" /> 
            العودة للمقالات
          </Link>
          
          <div className="flex justify-center">
            <span className="bg-primary/20 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              {blog.category?.name || "تصنيف عام"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight text-white px-4">
            {blog.title}
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm font-bold text-slate-500 border-t border-white/5 pt-8">
            <div className="flex items-center gap-2 font-black text-primary/80 uppercase tracking-widest">فريق C4R</div>
            <div className="w-1 h-1 bg-white/10 rounded-full" />
            <div className="flex items-center gap-2" suppressHydrationWarning>{formatArabicDate(blog.createdAt)}</div>
            <div className="w-1 h-1 bg-white/10 rounded-full" />
            <div className="flex items-center gap-2">{calculatedReadingTime} دقائق للقراءة</div>
            <div className="w-1 h-1 bg-white/10 rounded-full" />
            <div className="flex items-center gap-2">{blog.views || 0} مشاهدة</div>
          </div>
        </div>
      </header>

      {/* 2. Main Article Content Area */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12 md:py-20 mb-20">
        <article className="w-full">
          {/* Featured Image */}
          <div className="relative w-full aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl mb-16 ring-1 ring-white/10 group">
            <Image 
              src={blog.image || "/images/blog-placeholder.jpg"} 
              alt={blog.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/40 to-transparent" />
          </div>

          {/* Description / Summary Area - Restored Standard Layout */}
          <div className="max-w-4xl mx-auto mb-16 px-8 text-center">
            {blog.summary && (
              <div className="relative inline-block w-full py-4">
                <div className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-6 bg-primary/10 px-5 py-2 rounded-full border border-primary/20">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                   مقدّمة المقال
                </div>
                
                <div 
                  className="text-xl md:text-2xl font-bold text-white leading-[1.8] text-center whitespace-normal"
                  dangerouslySetInnerHTML={{ __html: blog.summary }}
                />
              </div>
            )}
          </div>

          {/* Article Body Content - Optimized News-Style Narrow Column */}
          <div className="max-w-2xl mx-auto px-6 md:px-0 flex flex-col items-center">
            <div 
              className="prose prose-lg md:prose-xl prose-invert w-full
                prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight prose-headings:text-center
                prose-h2:text-3xl md:text-5xl prose-h2:mt-24 prose-h2:mb-12 prose-h2:leading-tight
                prose-p:text-slate-300 prose-p:leading-[2.2] prose-p:mb-12 prose-p:text-lg md:prose-p:text-xl prose-p:text-center prose-p:font-bold
                prose-a:text-primary prose-a:font-black prose-a:underline decoration-primary/30 hover:decoration-primary
                prose-strong:text-white prose-strong:font-black
                prose-li:text-lg md:text-xl prose-li:my-4 prose-li:text-slate-300 prose-li:text-center prose-li:list-none
                prose-blockquote:border-none prose-blockquote:bg-white/5 prose-blockquote:p-12 prose-blockquote:rounded-[3rem] prose-blockquote:text-white prose-blockquote:font-black prose-blockquote:not-italic prose-blockquote:my-20 prose-blockquote:text-center prose-blockquote:text-xl md:prose-blockquote:text-3xl prose-blockquote:leading-relaxed
                prose-img:rounded-[3rem] prose-img:shadow-2xl prose-img:my-20 prose-img:ring-1 prose-img:ring-white/10
                whitespace-normal break-words
              "
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>

          {/* Suggested Cars - Centered Grid */}
          {blog.relatedCars && blog.relatedCars.filter(c => c && typeof c === 'object').length > 0 && (
            <div className="mt-32 p-10 md:p-20 bg-white/5 border border-white/10 rounded-[4rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10 text-center">
                <h3 className="text-3xl md:text-5xl font-black text-white mb-12 flex items-center justify-center gap-6">
                  <CarRental sx={{ fontSize: 48, color: 'primary.main' }} />
                  سيارات مقترحة لتجربة لا تُنسى
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {blog.relatedCars.filter(c => c && typeof c === 'object').map((car) => {
                    const carImg = Array.isArray(car.image) ? car.image[0] : (car.image || "/images/car-placeholder.png");
                    return <CarCard key={car._id} car={{ ...car, image: carImg }} variant="dark" />;
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Share & Social Footer */}
          <footer className="mt-32 pt-20 border-t border-white/10 space-y-16">
            <AuthorBio />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 bg-[#0f172a]/40 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl">
              <div className="text-center md:text-right">
                <h4 className="text-2xl font-black text-white mb-3">هل أعجبك هذا المحتوى؟</h4>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">شاركه مع مجتمعك أو احفظه للعودة إليه لاحقاً</p>
              </div>
              <div className="flex items-center gap-6">
                <Tooltip title="حفظ المقال"><IconButton sx={{ width: 64, height: 64, bg: 'white/5', color: 'white', '&:hover': { bgcolor: 'primary.main', transform: 'scale(1.1)' }, transition: 'all 0.4s' }}><BookmarkBorder fontSize="large" /></IconButton></Tooltip>
                <div className="w-px h-12 bg-white/10 mx-2" />
                <Tooltip title="فيسبوك"><IconButton component="a" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" sx={{ width: 64, height: 64, bg: 'white/5', color: 'white', '&:hover': { color: '#1877f2', transform: 'scale(1.1)' }, transition: 'all 0.4s' }}><Facebook fontSize="large" /></IconButton></Tooltip>
                <Tooltip title="تويتر"><IconButton component="a" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" sx={{ width: 64, height: 64, bg: 'white/5', color: 'white', '&:hover': { color: '#1da1f2', transform: 'scale(1.1)' }, transition: 'all 0.4s' }}><Twitter fontSize="large" /></IconButton></Tooltip>
                <Tooltip title="واتساب"><IconButton component="a" href={`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`} target="_blank" sx={{ width: 64, height: 64, bg: 'white/5', color: 'white', '&:hover': { color: '#25d366', transform: 'scale(1.1)' }, transition: 'all 0.4s' }}><WhatsApp fontSize="large" /></IconButton></Tooltip>
              </div>
            </div>
          </footer>
        </article>
      </div>

      {/* 3. Global Discovery Area - Large Scale Navigation */}
      <div className="bg-[#0f172a]/30 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <ContinueReading currentBlogId={blog._id} categoryId={blog.category?._id} />
          <RelatedArticles currentBlogId={blog._id} />
        </div>
      </div>
    </main>
  );
}
