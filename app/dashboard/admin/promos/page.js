"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api, { promoService } from "@/services/api";
import {
  Button,
  CircularProgress,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Add,
  UploadFile,
  Edit,
  Delete,
  ArrowForward,
  Star,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

export default function PromosManagementPage() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const initialForm = {
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    layoutType: "image-right",
    isActive: true,
    priority: 0,
  };
  const [formData, setFormData] = useState(initialForm);

  const { data: promoData, isLoading } = useQuery({
    queryKey: ["allPromosAdmin"],
    queryFn: () => promoService.getAllAdmin(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => promoService.create(data),
    onSuccess: () => {
      toast.success(t("dashboard.admin.promos.createSuccess", "تم إنشاء العرض بنجاح"));
      queryClient.invalidateQueries({ queryKey: ["allPromosAdmin"] });
      setIsFormOpen(false);
      setFormData(initialForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => promoService.update(id, data),
    onSuccess: () => {
      toast.success(t("dashboard.admin.promos.updateSuccess", "تم تحديث العرض بنجاح"));
      queryClient.invalidateQueries({ queryKey: ["allPromosAdmin"] });
      setIsFormOpen(false);
      setEditingPromo(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => promoService.delete(id),
    onSuccess: () => {
      toast.success(t("dashboard.admin.promos.deleteSuccess", "تم حذف العرض"));
      queryClient.invalidateQueries({ queryKey: ["allPromosAdmin"] });
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await api.post("/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, imageUrl: response.data.url }));
      toast.success(t("common.uploadSuccess", "تم رفع الصورة بنجاح"));
    } catch (error) {
      toast.error(t("common.uploadError", "فشل رفع الصورة"));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleOpenForm = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({ ...promo });
    } else {
      setEditingPromo(null);
      setFormData(initialForm);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPromo) {
      updateMutation.mutate({ id: editingPromo._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <CircularProgress />
    </div>
  );

  const promos = promoData?.data || [];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
          <div className="space-y-2">
            <Breadcrumbs sx={{ color: "slate.500", mb: 1 }}>
              <Link component="button" onClick={() => router.push("/dashboard/admin")} sx={{ color: "slate.400", fontWeight: "bold", textDecoration: "none" }}>Dashboard</Link>
              <Typography sx={{ color: "primary.main", fontWeight: "black" }}>Promos CMS</Typography>
            </Breadcrumbs>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              Elite Promos <SettingsIcon sx={{ color: "primary.main" }} />
            </h1>
            <p className="text-slate-400 font-bold text-lg">تحكم في العروض والبنرات الديناميكية بواجهة احترافية</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <Button
                variant="outlined"
                startIcon={<ArrowForward sx={{ transform: i18n.dir() === 'rtl' ? 'rotate(0deg)' : 'rotate(180deg)' }} />}
                onClick={() => router.push("/dashboard/admin")}
                sx={{ borderRadius: "1.5rem", fontWeight: "900", px: 4, py: 2, color: "white", borderColor: "rgba(255,255,255,0.1)" }}
              >
                العودة للوحة التحكم
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenForm()}
                sx={{ borderRadius: "1.5rem", fontWeight: "900", px: 4, py: 2, boxShadow: "0 10px 40px rgba(249, 115, 22, 0.4)" }}
              >
                إضافة عرض جديد
              </Button>
          </div>
        </div>

        {/* Promos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promos.map((promo) => (
            <div 
              key={promo._id} 
              className="group bg-white/5 rounded-[2.5rem] border border-white/10 p-6 flex flex-col md:flex-row gap-6 items-center hover:bg-white/10 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
            >
              <div className="relative w-full md:w-48 aspect-video rounded-3xl overflow-hidden shrink-0 border border-white/10 shadow-xl">
                <Image src={promo.imageUrl} alt={promo.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                {!promo.isActive && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <Typography sx={{ fontWeight: "900", color: "white", fontSize: "0.75rem", textTransform: "uppercase" }}>Hidden</Typography>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-black text-white truncate leading-tight">{promo.title}</h3>
                  <div className="flex gap-1">
                    <IconButton onClick={() => handleOpenForm(promo)} sx={{ color: "primary.main", bgcolor: "rgba(249,115,22,0.1)" }}><Edit fontSize="small" /></IconButton>
                    <IconButton onClick={() => deleteMutation.mutate(promo._id)} sx={{ color: "#ef4444", bgcolor: "rgba(239,68,68,0.1)" }}><Delete fontSize="small" /></IconButton>
                  </div>
                </div>
                <p className="text-slate-400 font-medium line-clamp-2">{promo.subtitle}</p>
                <div className="flex gap-3 flex-wrap">
                  <Chip label={promo.layoutType} size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "slate.400", fontWeight: "900", fontSize: "0.65rem", textTransform: "uppercase" }} />
                  <Chip label={`Prio: ${promo.priority}`} size="small" sx={{ bgcolor: "rgba(259,115,22,0.1)", color: "primary.main", fontWeight: "900", fontSize: "0.65rem" }} />
                </div>
              </div>
            </div>
          ))}

          {promos.length === 0 && (
            <div className="col-span-full text-center py-32 bg-white/5 rounded-[4rem] border border-dashed border-white/10 backdrop-blur-xl">
              <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <SettingsIcon sx={{ fontSize: 64, color: "rgba(255,255,255,0.05)" }} />
              </div>
              <h3 className="text-2xl font-black text-slate-500">لا توجد عروض حالياً لبدء الحملة</h3>
              <Button
                variant="text"
                onClick={() => handleOpenForm()}
                sx={{ mt: 4, fontWeight: "900", fontSize: "1.2rem", color: "primary.main" }}
              >
                إنشاء أول عرض الآن
              </Button>
            </div>
          )}
        </div>

        {/* Promo Form Dialog with Live Preview */}
        <Dialog
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: "#0f172a",
              backgroundImage: "radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.1) 0px, transparent 50%)",
              borderRadius: "4rem",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              p: { xs: 2, md: 5 },
              margin: 2,
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: "900", fontSize: { xs: "2rem", md: "3rem" }, textAlign: "center", mb: 2 }}>
            {editingPromo ? "تعديل محتوى العرض" : "إضافة محتوى إبداعي"}
          </DialogTitle>
          <DialogContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-6">
              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <TextField
                  fullWidth
                  label="العنوان (Max 60)"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  sx={formInputStyle}
                />
                <TextField
                  fullWidth
                  label="الوصف المختصر (Max 150)"
                  required
                  multiline
                  rows={3}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  sx={formInputStyle}
                />
                <TextField
                  fullWidth
                  label="رابط التوجيه الزر"
                  required
                  value={formData.linkUrl}
                  placeholder="https://example.com"
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  sx={formInputStyle}
                />

                <div className="grid grid-cols-2 gap-6">
                  <FormControl fullWidth sx={formInputStyle}>
                    <InputLabel sx={{ color: "slate.400" }}>تنسيق العرض</InputLabel>
                    <Select
                      value={formData.layoutType}
                      label="تنسيق العرض"
                      onChange={(e) => setFormData({ ...formData, layoutType: e.target.value })}
                      sx={{ borderRadius: "1.5rem" }}
                    >
                      <MenuItem value="image-right">صورة لليمين (Classic)</MenuItem>
                      <MenuItem value="image-left">صورة لليسار (Inverted)</MenuItem>
                      <MenuItem value="full-bg">خلفية كاملة (Immersive)</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    type="number"
                    label="الأولوية في الترتيب"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    sx={formInputStyle}
                  />
                </div>

                <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5">
                  <div>
                    <Typography sx={{ fontWeight: "900", fontSize: "1.1rem" }}>تفعيل وحالة العرض</Typography>
                    <Typography sx={{ color: "slate.500", fontSize: "0.8rem", fontWeight: "bold" }}>تحكم في ظهور هذا العرض للمستخدمين فوراً</Typography>
                  </div>
                  <Select
                    size="small"
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                    sx={{ color: "white", "& fieldset": { border: "none" }, fontWeight: "900", bgcolor: "rgba(255,255,255,0.05)", borderRadius: "1rem", px: 2 }}
                  >
                    <MenuItem value={true}>مرئي (Active)</MenuItem>
                    <MenuItem value={false}>مخفي (Inactive)</MenuItem>
                  </Select>
                </div>

                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  disabled={uploadLoading}
                  startIcon={uploadLoading ? <CircularProgress size={20} /> : <UploadFile />}
                  sx={{ borderRadius: "1.5rem", py: 2.5, borderColor: "rgba(255,255,255,0.1)", color: "white", fontWeight: "900", fontSize: "1.1rem", borderStyle: "dashed" }}
                >
                  {uploadLoading ? "جاري رفع التصميم..." : "رفع التصميم (المقاس المثالي 16:9)"}
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>
              </form>

              {/* Live Preview Column */}
              <div className="space-y-6">
                <Box className="flex items-center gap-3 mb-4">
                   <div className="h-0.5 flex-1 bg-white/10" />
                   <Typography sx={{ fontWeight: "black", color: "primary.main", textTransform: "uppercase", tracking: "3px", fontSize: "0.8rem" }}>
                      Live Preview & Interaction
                   </Typography>
                   <div className="h-0.5 flex-1 bg-white/10" />
                </Box>
                <div className="sticky top-0 transition-all duration-700">
                  <PromoPreviewCard data={formData} />
                  
                  <div className="mt-10 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                     <h4 className="text-primary font-black mb-4 flex items-center gap-2">
                        <Star /> نصيحة خبراء C4R
                     </h4>
                     <p className="text-slate-400 font-bold leading-relaxed">
                        استخدم صوراً عالية الجودة بنسبة أبعاد 16:9. Layout "الخلفية الكاملة" يعطي شعوراً بالفخامة إذا كانت الصورة داكنة قليلاً، بينما Layout "الصورة لليمين" هو الأفضل لزيادة نسبة النقر (CTR).
                     </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ p: { xs: 2, md: 5 }, pt: 0, gap: 3 }}>
            <Button 
               onClick={() => setIsFormOpen(false)} 
               sx={{ color: "slate.400", fontWeight: "900", fontSize: "1.2rem", px: 4 }}
            >
               إلغاء التعديلات
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              sx={{ 
                borderRadius: "1.75rem", 
                fontWeight: "900", 
                px: 8, 
                py: 2, 
                fontSize: "1.3rem",
                boxShadow: "0 15px 40px rgba(249, 115, 22, 0.4)"
              }}
            >
              {editingPromo ? "حفظ التغييرات" : "نشر العرض الآن"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

function PromoPreviewCard({ data }) {
  const { title, subtitle, imageUrl, layoutType } = data;

  return (
    <div className={`relative overflow-hidden rounded-[3rem] border border-white/10 glass shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 min-h-[320px] flex items-center group ${
      layoutType === 'full-bg' ? 'p-12 md:p-16' : ''
    }`}>
      {layoutType === 'full-bg' && imageUrl && (
        <div className="absolute inset-0 z-0">
          <Image src={imageUrl} alt="preview" fill className="object-cover opacity-40 blur-[2px] group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0f172a] via-[#0f172a]/90 to-transparent" />
        </div>
      )}

      <div className={`relative z-10 w-full flex flex-col md:flex-row items-center gap-10 ${
        layoutType === 'image-left' ? 'md:flex-row-reverse' : ''
      }`}>
        <div className={`flex-1 ${layoutType === 'full-bg' ? 'text-right' : 'text-right'}`}>
          <div className="inline-block px-4 py-1.5 bg-primary/20 rounded-full border border-primary/30 mb-6">
             <Typography sx={{ color: "primary.main", fontWeight: "900", fontSize: "0.7rem", textTransform: "uppercase" }}>Limited Offer</Typography>
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-[1.1] animate-in slide-in-from-right duration-500">
            {title || "اكتب عنوان العرض الجذاب هنا"}
          </h3>
          <p className="text-slate-400 font-bold text-lg md:text-xl leading-relaxed mb-8 max-w-xl animate-in fade-in duration-700 delay-200">
            {subtitle || "أضف وصفاً يشجع المستخدمين على اتخاذ إجراء فوري، سيظهر هذا المحتوى بشكل رائع هنا..."}
          </p>
          <Button 
            variant="contained" 
            sx={{ 
                borderRadius: '1.25rem', 
                fontWeight: '900', 
                px: 6, 
                py: 2, 
                fontSize: "1.1rem",
                boxShadow: "0 10px 30px rgba(249, 115, 22, 0.3)" 
            }}
          >
             احجز الآن
          </Button>
        </div>

        {layoutType !== 'full-bg' && (
          <div className="w-full md:w-1/2 aspect-video relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group/img">
             {imageUrl ? (
               <Image src={imageUrl} alt="preview" fill className="object-cover group-hover/img:scale-110 transition-transform duration-1000" />
             ) : (
               <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-slate-600 italic font-black text-xs uppercase tracking-widest">
                  Preview Image Waitlist
               </div>
             )}
             <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}

const formInputStyle = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      borderRadius: "1.5rem",
      bgcolor: "rgba(255,255,255,0.03)",
      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#f97316" }
    },
    "& .MuiInputLabel-root": { color: "slate.400", fontWeight: "bold" }
};
