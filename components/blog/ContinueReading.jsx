"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowForward, DoubleArrow } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import api from "@/services/api";

const ContinueReading = ({ currentBlogId, categoryId }) => {
  const { i18n } = useTranslation("common");

  // Fetch the next article in the same category or latest
  const { data, isLoading } = useQuery({
    queryKey: ["nextBlog", currentBlogId],
    queryFn: async () => {
      // Get 2 blogs to ensure we have one that's not the current one
      const res = await api.get(`/blogs?category=${categoryId}&status=published&limit=2&sort=-createdAt`);
      return res.data;
    },
    enabled: !!categoryId,
  });

  const nextBlog = data?.data?.find(b => b._id !== currentBlogId);

  if (!nextBlog) return null;

  return (
    <div className="mt-24 mb-10 group">
      <div className="flex items-center gap-4 mb-8">
         <div className="h-px flex-1 bg-white/10" />
         <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
            {i18n.language === "ar" ? "تابع القراءة" : "Continue Reading"}
         </span>
         <div className="h-px flex-1 bg-white/10" />
      </div>

      <Link
        href={`/blog/${nextBlog._id}`}
        className="block relative p-10 md:p-16 rounded-[3rem] bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500 text-center"
      >
        <div className="relative z-10 flex flex-col items-center gap-6">
           <DoubleArrow sx={{ fontSize: 32 }} className="text-primary rotate-180 animate-pulse" />
           <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight max-w-3xl group-hover:text-primary transition-colors">
              {nextBlog.title}
           </h3>
           <div className="flex items-center gap-3 text-primary font-black uppercase text-sm tracking-widest mt-4">
              <span>{i18n.language === "ar" ? "المقال التالي" : "Next Article"}</span>
              <ArrowForward sx={{ fontSize: 18 }} className="rotate-180" />
           </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full translate-x-[-20%] translate-y-[-20%]" />
           <div className="absolute bottom-10 right-10 w-60 h-60 border border-white rounded-full translate-x-[30%] translate-y-[30%]" />
        </div>
      </Link>
    </div>
  );
};

export default ContinueReading;
