"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService, categoryService, carService } from "@/services/api";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Tabs,
  Tab,
  Typography,
  Autocomplete,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Article,
  AccessTime,
  Analytics,
  Settings,
  CloudUpload,
  AdsClick,
  AutoFixHigh,
  Visibility
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamic import for ReactQuill
const ReactQuill = dynamic(
  async () => {
    const { default: Quill } = await import("react-quill-new");
    return Quill;
  },
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress size={30} sx={{ color: 'var(--primary)' }} />
      </Box>
    ),
  }
);
import "react-quill-new/dist/quill.snow.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  );
}

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "1.25rem",
    bgcolor: "rgba(255,255,255,0.03)",
    color: "white",
    fontWeight: "bold",
    "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
    "&.Mui-focused fieldset": { borderColor: "var(--primary)" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)", fontWeight: "bold" },
};

export default function AdminBlogs() {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();

  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ["adminBlogs"],
    queryFn: () => blogService.getAll({ limit: 50, sort: '-createdAt' }),
  });

  const { data: catData } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => categoryService.getAll(),
  });

  const { data: carData } = useQuery({
    queryKey: ["adminCars"],
    queryFn: () => carService.getAll({ page: 1, limit: 100 }),
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [slugSync, setSlugSync] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const initialForm = {
    title: "",
    slug: "",
    category: "",
    content: "",
    summary: "",
    status: "draft",
    image: "",
    relatedCars: [],
    metaTitle: "",
    metaDescription: "",
    focusKeywords: "",
    faqs: [],
    primaryCta: { text: "", link: "", type: "custom" },
  };
  const [formData, setFormData] = useState(initialForm);
  const [localCategories, setLocalCategories] = useState([]);
  const [localCars, setLocalCars] = useState([]);

  // Sync Query Data with Local State to Force Rerenders
  useEffect(() => {
    if (catData?.data) setLocalCategories(Array.isArray(catData.data) ? catData.data : []);
    else if (Array.isArray(catData)) setLocalCategories(catData);
  }, [catData]);

  useEffect(() => {
    if (carData?.data?.cars) setLocalCars(carData.data.cars);
    else if (Array.isArray(carData?.data)) setLocalCars(carData.data);
    else if (Array.isArray(carData)) setLocalCars(carData);
  }, [carData]);

  // Intel: Slug Sync
  useEffect(() => {
    if (slugSync && formData.title) {
        const slug = formData.title.toLowerCase()
            .replace(/[^a-z0-9-ء-ي]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, slugSync]);

  const createMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      toast.success(t("feedback.admin.blogCreateSuccess"));
      queryClient.invalidateQueries(["adminBlogs"]);
      setOpenDialog(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }) => blogService.update(slug, data),
    onSuccess: () => {
      toast.success(t("feedback.admin.blogUpdateSuccess"));
      queryClient.invalidateQueries(["adminBlogs"]);
      setOpenDialog(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || t("notifications.error"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.delete,
    onSuccess: () => {
      toast.success(t("feedback.admin.blogDeleteSuccess"));
      queryClient.invalidateQueries(["adminBlogs"]);
      setDeleteDialog(false);
      setSelectedBlog(null);
    },
  });

  const resetForm = () => {
    setFormData(initialForm);
    setSelectedBlog(null);
    setTabValue(0);
    setFile(null);
    setUploading(false);
  };

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setSelectedBlog(blog);
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        category: blog.category?._id || blog.category || "",
        content: blog.content || "",
        summary: blog.summary || "",
        status: blog.status || "draft",
        image: blog.image === 'no-photo.jpg' ? '' : blog.image,
        relatedCars: blog.relatedCars ? blog.relatedCars.map(c => typeof c === 'object' ? c._id : c) : [],
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
        focusKeywords: Array.isArray(blog.focusKeywords) ? blog.focusKeywords.join(", ") : (blog.focusKeywords || ""),
        faqs: blog.faqs || [],
        primaryCta: blog.primaryCta || { text: "", link: "", type: "custom" },
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content || !formData.category) {
      toast.warning(t("notifications.requiredFields"));
      setTabValue(0);
      return;
    }

    setUploading(true);
    try {
      let currentImageUrl = formData.image;

      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || t("notifications.uploadError"));
        currentImageUrl = result.url;
        toast.success(t("notifications.uploadSuccess"));
      }

      const finalData = {
        ...formData,
        image: currentImageUrl,
        focusKeywords: typeof formData.focusKeywords === 'string' 
            ? formData.focusKeywords.split(",").map(k => k.trim()).filter(k => k) 
            : (Array.isArray(formData.focusKeywords) ? formData.focusKeywords : []),
        relatedCars: Array.isArray(formData.relatedCars) 
            ? formData.relatedCars.map(c => typeof c === 'object' ? c._id : c)
            : [],
        summary: formData.summary || (formData.content ? formData.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : ""),
      };

      if (selectedBlog) {
        updateMutation.mutate({ slug: selectedBlog?.slug, data: finalData });
      } else {
        createMutation.mutate(finalData);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Improved Data Mapping with Defensive Checks
  const blogs = blogsData?.data || blogsData?.data?.blogs || (Array.isArray(blogsData) ? blogsData : []);
  const categories = Array.isArray(catData?.data) ? catData.data : (Array.isArray(catData) ? catData : []);
  const cars = Array.isArray(carData?.data?.cars) ? carData.data.cars : (Array.isArray(carData?.data) ? carData.data : (Array.isArray(carData) ? carData : []));

  return (
    <div className="space-y-8" dir={i18n.dir()}>
      <div className="bg-[#020617] backdrop-blur-3xl p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/20 transition-all duration-700" />
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter flex items-center gap-3">
             {t("dashboard.admin.blog.elite.title")}
          </h1>
          <p className="text-slate-400 font-bold text-base md:text-lg flex items-center gap-2">
            <AutoFixHigh className="text-primary/50" fontSize="small" />
            {t("dashboard.admin.blog.elite.subtitle")}
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: "1.5rem",
            px: 6,
            py: 2,
            fontWeight: "900",
            fontSize: "1.1rem",
            bgcolor: "var(--primary)",
            backgroundImage: "linear-gradient(135deg, var(--primary) 0%, #f97316 100%)",
            boxShadow: "0 15px 30px rgba(249, 115, 22, 0.3)",
            "&:hover": { transform: "translateY(-3px)", boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)" },
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}
        >
          {t("dashboard.admin.blog.elite.addArticle")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogsLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
              <CircularProgress thickness={6} size={60} sx={{ color: 'var(--primary)' }} />
              <p className="text-white font-black animate-pulse">{t("dashboard.admin.blog.elite.loading")}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full text-center py-32 bg-white/5 border-2 border-dashed border-white/5 rounded-[3.5rem]">
            <Article sx={{ fontSize: 100, color: "rgba(255,255,255,0.05)" }} className="mb-6" />
            <h3 className="text-2xl font-black text-slate-400">{t("dashboard.admin.blog.elite.noArticles")}</h3>
            <Button onClick={() => handleOpenDialog()} className="mt-6 text-primary font-black uppercase tracking-widest">{t("dashboard.admin.blog.elite.startNow")}</Button>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="bg-[#0f172a]/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-[#0f172a] transition-all duration-500 group relative flex flex-col h-full shadow-xl">
               <div className="relative h-56 w-full overflow-hidden">
                   <Image src={blog.image || '/images/blog-placeholder.jpg'} alt={blog.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
                   <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Chip label={blog.category?.name || "بدون قسم"} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', color: 'white', fontWeight: 900, border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Chip label={blog.status === 'published' ? 'منشور' : 'مسودة'} size="small" sx={{ bgcolor: blog.status === 'published' ? '#16a34a' : '#f97316', color: 'white', fontWeight: 900 }} />
                   </div>
                   <div className="absolute bottom-4 left-4 flex gap-3">
                      <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] text-white flex items-center gap-1.5 font-black border border-white/10">
                         <AccessTime sx={{ fontSize: 14, color: 'var(--primary)' }} /> {blog.readingTime || 1} دقيقة
                      </div>
                      <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] text-white flex items-center gap-1.5 font-black border border-white/10">
                         <Analytics sx={{ fontSize: 14, color: 'var(--primary)' }} /> {blog.views || 0} مشاهدة
                      </div>
                   </div>
               </div>
               <div className="p-6 flex-1 flex flex-col gap-4">
                  <h3 className="text-xl font-black text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-slate-400 font-bold line-clamp-3 leading-relaxed flex-1">{blog.summary}</p>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                      <div className="flex -space-x-2">
                         {(blog.relatedCars || []).filter(car => car && typeof car === 'object').slice(0, 3).map((car, i) => (
                           <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#020617] overflow-hidden" title={car.name}>
                              <Image 
                                src={car.image && car.image !== 'no-photo.jpg' ? car.image : '/images/car-placeholder.png'} 
                                alt={car.name || "car"} 
                                width={32} 
                                height={32} 
                                className="object-cover"
                              />
                           </div>
                         ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="small"
                          component={Link}
                          href={`/blog/${blog.category?.slug || 'general'}/${blog.slug}`}
                          target="_blank"
                          startIcon={<Visibility />}
                          sx={{
                            color: '#94a3b8',
                            bgcolor: 'rgba(255,255,255,0.02)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' },
                            borderRadius: '1rem',
                            fontWeight: 900,
                            px: 1.5,
                            fontSize: '0.7rem',
                            textTransform: 'none'
                          }}
                        >
                          {t("common.view")}
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleOpenDialog(blog)}
                          startIcon={<Edit />}
                          sx={{
                            color: 'white',
                            bgcolor: 'rgba(255,255,255,0.05)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                            borderRadius: '1rem',
                            fontWeight: 900,
                            px: 2,
                            fontSize: '0.75rem'
                          }}
                        >
                          {t("common.edit")}
                        </Button>
                        <Button
                          size="small"
                          onClick={() => { setSelectedBlog(blog); setDeleteDialog(true); }}
                          startIcon={<Delete />}
                          sx={{
                            color: '#ef4444',
                            bgcolor: 'rgba(239,68,68,0.05)',
                            '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
                            borderRadius: '1rem',
                            fontWeight: 900,
                            px: 2,
                            fontSize: '0.75rem'
                          }}
                        >
                          {t("common.delete")}
                        </Button>
                      </div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Elite Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="lg" 
        fullWidth 
        PaperProps={{ 
            sx: { 
                borderRadius: "3rem", 
                bgcolor: "#020617", 
                border: "1px solid rgba(255,255,255,0.1)", 
                backgroundImage: "radial-gradient(at top right, rgba(249, 115, 22, 0.05) 0%, transparent 70%)"
            } 
        }}
      >
        <DialogTitle className="flex flex-col gap-4 p-10 border-b border-white/5">
            <div className="flex justify-between items-center">
                 <Typography variant="h4" className="text-white font-black tracking-tighter">
                    {selectedBlog ? t("dashboard.admin.blog.elite.editArticle") : t("dashboard.admin.blog.elite.addArticle")}
                 </Typography>
                 <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                    <Settings className="text-primary" />
                    <span className="text-xs text-white font-black uppercase tracking-widest">Advanced Suite</span>
                 </div>
            </div>
           
           <Tabs 
             value={tabValue} 
             onChange={(e, v) => setTabValue(v)}
             sx={{
                "& .MuiTabs-indicator": { height: 4, borderRadius: 2, bgcolor: 'var(--primary)' },
                "& .MuiTab-root": { color: 'rgba(255,255,255,0.4)', fontWeight: 900, minHeight: 60 },
                "& .Mui-selected": { color: 'white !important' }
             }}
           >
              <Tab icon={<AutoFixHigh />} iconPosition="start" label={t("dashboard.admin.blog.elite.generalTab")} />
              <Tab icon={<Article />} iconPosition="start" label={t("dashboard.admin.blog.elite.contentTab")} />
              <Tab icon={<Analytics />} iconPosition="start" label={t("dashboard.admin.blog.elite.seoTab")} />
              <Tab icon={<AdsClick />} iconPosition="start" label={t("dashboard.admin.blog.elite.conversionTab")} />
            </Tabs>
        </DialogTitle>

        <DialogContent className="p-10">
           <TabPanel value={tabValue} index={0}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <TextField fullWidth label={t("dashboard.admin.blog.addDialog.titleLabel")} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} sx={inputStyle} />
                        <div className="flex gap-4">
                            <TextField fullWidth label="Slug" value={formData.slug} disabled={slugSync} sx={inputStyle} />
                            <IconButton onClick={() => setSlugSync(!slugSync)} sx={{ color: slugSync ? 'var(--primary)' : 'rgba(255,255,255,0.2)' }}><Settings /></IconButton>
                        </div>
                        <FormControl fullWidth sx={inputStyle} error={!formData.category}>
                            <InputLabel>{t("dashboard.admin.blog.addDialog.categoryLabel")}</InputLabel>
                            <Select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                            label={t("dashboard.admin.blog.addDialog.categoryLabel")}
                            >
                                {localCategories.length === 0 ? (
                                <MenuItem disabled>{t("dashboard.admin.blog.elite.loading")}</MenuItem>
                                ) : (
                                localCategories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)
                                )}
                            </Select>
                            {!formData.category && <Typography variant="caption" color="error" sx={{ mt: 1, ml: 1 }}>يرجى اختيار قسم من القائمة</Typography>}
                        </FormControl>
                        <FormControl fullWidth sx={inputStyle}>
                            <InputLabel>{t("dashboard.admin.blog.addDialog.statusLabel")}</InputLabel>
                            <Select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} label={t("dashboard.admin.blog.addDialog.statusLabel")}>
                                <MenuItem value="draft">{t("dashboard.admin.blog.statuses.draft")}</MenuItem>
                                <MenuItem value="published">{t("dashboard.admin.blog.statuses.published")}</MenuItem>
                            </Select>
                        </FormControl>
                     </div>
                     <div className="space-y-6">
                        <div
                            className={`border-2 border-dashed rounded-[2rem] p-8 transition-all cursor-pointer relative group overflow-hidden ${file || formData.image
                              ? "border-primary/50 bg-primary/5"
                              : "border-white/10 hover:border-primary/30 hover:bg-white/5"
                              }`}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              onChange={(e) => setFile(e.target.files[0])}
                            />

                            {file || formData.image ? (
                              <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                <Image
                                  src={file ? URL.createObjectURL(file) : formData.image}
                                  alt="Preview"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                                  <div className="bg-primary px-6 py-2.5 rounded-full text-white font-black flex items-center gap-2 shadow-2xl">
                                    <CloudUpload /> {t("dashboard.admin.blog.elite.changeImage")}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-10 gap-5 text-slate-400">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-primary mb-1 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-2xl">
                                  <CloudUpload fontSize="large" />
                                </div>
                                <div className="text-center">
                                  <span className="block font-black text-2xl text-white mb-2 tracking-tight">
                                    {t("dashboard.admin.blog.elite.uploadImage")}
                                  </span>
                                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                    {t("dashboard.admin.blog.elite.imageHint")}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        <div className="space-y-4">
                            <Autocomplete
                                multiple
                                options={localCars}
                                loading={!localCars.length && !carData}
                                getOptionLabel={(option) => `${option.name} (${option.year})`}
                                isOptionEqualToValue={(option, value) => (option._id || option) === (value._id || value)}
                                value={localCars.filter(car => 
                                    Array.isArray(formData.relatedCars) && formData.relatedCars.includes(car._id)
                                )}
                                onChange={(event, newValue) => {
                                    setFormData({
                                        ...formData,
                                        relatedCars: newValue.map(car => car._id)
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("dashboard.admin.blog.addDialog.relatedCarsLabel")}
                                        placeholder="اختر السيارات المرتبطة"
                                        sx={inputStyle}
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option.name}
                                            {...getTagProps({ index })}
                                            sx={{ borderRadius: '0.75rem', fontWeight: 'bold' }}
                                        />
                                    ))
                                }
                                sx={{
                                    "& .MuiAutocomplete-tag": {
                                        borderRadius: "0.75rem",
                                        fontWeight: "bold",
                                        bgcolor: "primary.main",
                                        color: "white"
                                    }
                                }}
                            />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                                * ملاحظة: اختر السيارات المرتبطة من القائمة لضمان الربط التقني الصحيح في الموقع.
                            </Typography>
                        </div>
                     </div>
                </div>
           </TabPanel>

           <TabPanel value={tabValue} index={1}>
                <div className="space-y-8">
                    <TextField fullWidth multiline rows={2} label={t("dashboard.admin.blog.addDialog.summaryLabel")} value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} sx={inputStyle} />
                    <div className="min-h-[450px] border border-white/10 rounded-[2rem] overflow-hidden bg-white/5 p-4 ql-elite-editor">
                        <style>{`
                            .ql-elite-editor .ql-editor { font-size: 1.25rem !important; line-height: 1.8 !important; min-height: 350px; color: white; }
                            .ql-elite-editor .ql-toolbar { border-radius: 1.5rem 1.5rem 0 0 !important; background: rgba(255,255,255,0.05) !important; border: none !important; padding: 15px !important; }
                            .ql-elite-editor .ql-container { border: none !important; }
                        `}</style>
                        <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData({...formData, content: v})} 
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                    ['link', 'image', 'video'],
                                    ['clean']
                                ]
                            }}
                        />
                    </div>
                </div>
           </TabPanel>

           <TabPanel value={tabValue} index={2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <TextField fullWidth label={t("dashboard.admin.blog.addDialog.metaTitleLabel")} value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} helperText={`${formData.metaTitle.length}/60`} sx={inputStyle} />
                        <TextField fullWidth label={t("dashboard.admin.blog.addDialog.metaDescLabel")} multiline rows={4} value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} helperText={`${formData.metaDescription.length}/160`} sx={inputStyle} />
                        <TextField fullWidth label={t("dashboard.admin.blog.addDialog.keywordsLabel")} value={formData.focusKeywords} onChange={(e) => setFormData({...formData, focusKeywords: e.target.value})} sx={inputStyle} />
                    </div>
                    <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <Typography className="text-white/60 font-black">{t("dashboard.admin.blog.elite.faqBuilder")}</Typography>
                            <Button startIcon={<Add />} onClick={() => setFormData({...formData, faqs: [...formData.faqs, { question: "", answer: "" }]})}>{t("dashboard.admin.blog.elite.addFaq")}</Button>
                         </div>
                         <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                             {formData.faqs.map((faq, idx) => (
                                 <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4 relative">
                                     <IconButton onClick={() => setFormData({...formData, faqs: formData.faqs.filter((_, i) => i !== idx)})} sx={{ position:'absolute', top: 10, right: 10 }}><Delete fontSize="small" /></IconButton>
                                     <TextField fullWidth label={t("dashboard.admin.blog.elite.question")} value={faq.question} onChange={(e) => {
                                         const next = [...formData.faqs]; next[idx].question = e.target.value; setFormData({...formData, faqs: next});
                                     }} sx={inputStyle} />
                                     <TextField fullWidth multiline rows={2} label={t("dashboard.admin.blog.elite.answer")} value={faq.answer} onChange={(e) => {
                                         const next = [...formData.faqs]; next[idx].answer = e.target.value; setFormData({...formData, faqs: next});
                                     }} sx={inputStyle} />
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
           </TabPanel>

           <TabPanel value={tabValue} index={3}>
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField label={t("dashboard.admin.blog.elite.ctaText")} fullWidth value={formData.primaryCta.text} onChange={(e) => setFormData({...formData, primaryCta: {...formData.primaryCta, text: e.target.value}})} sx={inputStyle} />
                        <TextField label={t("dashboard.admin.blog.elite.ctaLink")} fullWidth value={formData.primaryCta.link} onChange={(e) => setFormData({...formData, primaryCta: {...formData.primaryCta, link: e.target.value}})} sx={inputStyle} />
                    </div>
                    <FormControl fullWidth sx={inputStyle}>
                        <InputLabel>{t("dashboard.admin.blog.elite.ctaType")}</InputLabel>
                        <Select value={formData.primaryCta.type} onChange={(e) => setFormData({...formData, primaryCta: {...formData.primaryCta, type: e.target.value}})} label={t("dashboard.admin.blog.elite.ctaType")}>
                            <MenuItem value="booking">Booking</MenuItem><MenuItem value="offer">Offer</MenuItem><MenuItem value="contact">Contact</MenuItem><MenuItem value="custom">Custom</MenuItem>
                        </Select>
                    </FormControl>
                </div>
           </TabPanel>
        </DialogContent>

        <DialogActions className="p-10 bg-white/5 border-t border-white/5 flex gap-6">
           <Button onClick={() => setOpenDialog(false)} sx={{ color: "rgba(255,255,255,0.4)", fontWeight: "900", px: 6 }}>{t("common.cancel")}</Button>
           <Button variant="contained" onClick={handleSubmit} fullWidth disabled={uploading || createMutation.isPending || updateMutation.isPending} sx={{ py: 2, borderRadius: "2rem", fontWeight: "900", bgcolor: "var(--primary)" }}>
             {uploading ? t("dashboard.admin.blog.elite.publishing") : (selectedBlog ? t("dashboard.admin.blog.elite.update") : t("dashboard.admin.blog.elite.publish"))}
           </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} PaperProps={{ sx: { borderRadius: "2.5rem", bgcolor: "#020617", border: "1px solid rgba(185,28,28,0.3)" } }}>
        <DialogTitle className="text-red-500 font-black p-8 pb-4">{t("dashboard.admin.blog.deleteDialog.title")}</DialogTitle>
        <DialogContent className="p-8 pt-0 text-slate-400 font-bold">{t("dashboard.admin.blog.deleteDialog.message")} ({selectedBlog?.title})?</DialogContent>
        <DialogActions className="p-8"><Button onClick={() => setDeleteDialog(false)} sx={{ color: "white" }}>{t("common.no")}</Button><Button variant="contained" color="error" onClick={() => deleteMutation.mutate(selectedBlog?.slug)}>{t("common.yes")}</Button></DialogActions>
      </Dialog>
    </div>
  );
}
