"use client";

import React from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  Info,
  SupportAgent,
  LibraryAddCheck,
  DirectionsCar,
} from "@mui/icons-material";
import Logo from "@/components/Logo";

const AboutPage = () => {
  const breadcrumbItems = [{ label: "من نحن" }];

  const features = [
    {
      title: "منصة وسيطة موثوقة",
      icon: <LibraryAddCheck />,
      description:
        "نعمل كوسيط بينك وبين أفضل مكاتب تأجير السيارات لضمان الجودة.",
    },
    {
      title: "تنوع الخيارات",
      icon: <DirectionsCar />,
      description:
        "نقدم تشكيلة هائلة من السيارات الفاخرة، الاقتصادية، والعائلية.",
    },
    {
      title: "دعم على مدار الساعة",
      icon: <SupportAgent />,
      description:
        "فريقنا متواجد دائماً لمساعدتك في أي استفسار أو مشكلة تواجهك.",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto mb-12">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-12 md:p-20 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            {/* Left Column: Text */}
            <div dir="rtl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-6 border border-primary/20">
                <Info fontSize="small" />
                <span className="font-black text-xs uppercase tracking-widest">
                  من نحن
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white mb-8 tracking-tighter leading-tight">
                قصتنا في <span className="text-primary italic">C4R</span>
              </h1>
              <p className="text-xl text-slate-400 font-bold leading-relaxed mb-10">
                منصة C4R هي وجهتك الأولى لتأجير السيارات في المملكة العربية
                السعودية. بدأنا بهدف واحد: جعل عملية تأجير السيارات أسهل، أسرع،
                وأكثر شفافية. نحن لسنا مجرد موقع حجز؛ نحن شريكك في الطريق.
              </p>

              <div className="space-y-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-500 font-bold">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Image/Visual */}
            <div className="relative">
              <div className="aspect-square rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                  <div className="h-20 md:h-24 px-8 md:px-10 rounded-full bg-midnight/80 border border-white/20 inline-flex items-center justify-center shadow-[0_0_16px_rgba(255,107,0,0.4)]">
                    <Logo size="lg" />
                  </div>
                </div>
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-8 -right-8 bg-midnight/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-xs md:max-w-none">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-primary">+١٠٠</div>
                  <div className="text-slate-300 font-bold">
                    مكتب تأجير <br />
                    متعاقد
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
