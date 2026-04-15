"use client";
import React, { useEffect, useState } from "react";
import { List, Link as ScrollLink, KeyboardArrowDown } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const TableOfContents = ({ contentSelector = ".prose" }) => {
  const { t, i18n } = useTranslation("common");
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const content = document.querySelector(contentSelector);
    if (!content) return;

    const elements = Array.from(content.querySelectorAll("h2, h3"));
    const headingData = elements.map((el, index) => {
      const id = el.id || `heading-${index}`;
      el.id = id;
      return {
        id,
        text: el.innerText,
        level: el.tagName.toLowerCase(),
      };
    });

    setHeadings(headingData);

    // ScrollSpy Logic
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 1.0 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [contentSelector]);

  if (headings.length === 0) return null;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:cursor-default"
      >
        <div className="flex items-center gap-3">
          <List className="text-primary" />
          <span className="font-black text-white">
            {i18n.language === "ar" ? "فهرس المحتويات" : "Table of Contents"}
          </span>
        </div>
        <KeyboardArrowDown 
          className={`md:hidden transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      <div className={`${isOpen ? "block" : "hidden"} md:block p-2 pt-0`}>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => scrollTo(heading.id)}
                className={`w-full text-right px-4 py-3 rounded-2xl text-sm transition-all duration-300 flex items-center gap-2 group ${
                  activeId === heading.id
                    ? "bg-primary/20 text-primary font-black"
                    : "text-slate-400 hover:bg-white/5 hover:text-white font-bold"
                } ${heading.level === 'h3' ? 'pr-8' : ''}`}
              >
                {heading.level === 'h2' && (
                  <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeId === heading.id ? "bg-primary scale-125" : "bg-white/10 group-hover:bg-white/30"
                  }`} />
                )}
                {heading.level === 'h3' && (
                  <div className={`w-1 h-1 rounded-full transition-all ${
                    activeId === heading.id ? "bg-primary" : "bg-white/10"
                  }`} />
                )}
                <span className="line-clamp-1">{heading.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TableOfContents;
