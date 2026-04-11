"use client";

import React from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  Gavel,
  Description,
  Payments,
  Schedule,
  DirectionsCar,
  Warning,
} from "@mui/icons-material";

const PolicyClient = () => {
  const breadcrumbItems = [{ label: "سياسة التأجير" }];

  const sections = [
    {
      title: "1. شروط المستأجر",
      icon: <Gavel />,
      content: [
        "أن يكون العمر 21 عاماً فما فوق للسيارات الاقتصادية، و25 عاماً للسيارات الفارهة (حسب الشريك).",
        "توفر رخصة قيادة سعودية أو دولية سارية المفعول.",
        "توفر هوية وطنية، إقامة، أو جواز سفر ساري.",
      ],
    },
    {
      title: "2. الحجز والتأكيد",
      icon: <Schedule />,
      content: [
        "يتم اختيار السيارة وإرسال طلب الحجز عبر المنصة.",
        "يتواصل فريق C4R مع العميل عبر الواتساب لتأكيد التوافر وإتمام إجراءات الحجز.",
        "الحجز لا يُعتبر نهائياً إلا بعد دفع العربون أو اكتمال الدفع (حسب سياسة السيارة).",
      ],
    },
    {
      title: "3. الاستلام والتسليم",
      icon: <DirectionsCar />,
      content: [
        "يجب تسليم السيارة في الوقت المحدد وفي نفس حالة الاستلام.",
        "قد تُطبق رسوم تأخير عند تجاوز وقت التسليم المسموح.",
        "يمكن ترتيب خدمة توصيل أو استلام السيارة من المطار برسوم إضافية.",
      ],
    },
    {
      title: "4. التأمين والحوادث",
      icon: <Warning />,
      content: [
        "تتوفر خيارات تأمين شامل وأساسي (حسب السيارة).",
        "في حال وقوع حادث (لا سمح الله)، يجب التواصل مع المرور وفريقنا فوراً، مع إحضار تقرير الحادث لضمان التغطية التأمينية.",
      ],
    },
    {
      title: "5. الوقود والنظافة",
      icon: <Description />,
      content: [
        "يجب إعادة السيارة بنفس مستوى الوقود عند الاستلام.",
        "يجب المحافظة على نظافة السيارة داخلياً وخارجياً؛ قد تُفرض رسوم تنظيف في حال استرجاعها بحالة غير لائقة.",
      ],
    },
    {
      title: "6. طرق الدفع والوديعة",
      icon: <Payments />,
      content: [
        "نقبل الدفع عبر التحويل البنكي، بطاقات مدى، البطاقات الائتمانية، أو نقداً.",
        "بعض السيارات قد تتطلب وديعة مستردة يتم حجزها كضمان عن المخالفات أو الأضرار، وتُسترد بعد مدة محددة.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto mb-12">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-12 md:p-20 border border-white/10 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

          <h1 className="text-3xl md:text-5xl font-black text-white mb-12 tracking-tighter relative z-10">
            سياسة <span className="text-primary italic">التأجير</span>
          </h1>

          <div className="space-y-12 relative z-10">
            {sections.map((section, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {section.icon}
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="pr-19">
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li
                        key={i}
                        className="text-slate-400 text-lg md:text-xl font-bold leading-relaxed flex items-center gap-3"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyClient;
