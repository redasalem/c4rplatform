"use client";

import { useState, useEffect, useMemo } from "react";
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
  Visibility,
  Lock,
  CheckCircle,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import dynamic from "next/dynamic";

import SEOPreview from "@/components/admin/SEOPreview";
import ImageUpload from "@/components/admin/ImageUpload";

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
  if (value !== index) return null;
  return (
    <div role="tabpanel" {...other}>
      <Box sx={{ pt: 4 }}>{children}</Box>
    </div>
  );
}

const eliteInputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "1.25rem",
    bgcolor: "rgba(255,255,255,0.02)",
    color: "white",
    fontWeight: "500",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.3s ease",
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.04)",
      borderColor: "rgba(249,115,22,0.3)",
    },
    "&.Mui-focused": {
      bgcolor: "rgba(255,255,255,0.05)",
      borderColor: "var(--primary)",
      boxShadow: "0 0 0 4px rgba(249,115,22,0.15), 0 0 20px rgba(249,115,22,0.1)",
    },
  },
  "& .MuiInputLabel-root": { 
    color: "rgba(255,255,255,0.5)", 
    fontWeight: "600",
    "&.Mui-focused": { color: "var(--primary)" },
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
    fontWeight: "500",
    "&::placeholder": { color: "rgba(255,255,255,0.25)", opacity: 1 },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.08)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(249,115,22,0.3)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--primary)",
    borderWidth: "1px",
  },
  "& .MuiFormHelperText-root": {
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.75rem",
    marginTop: "0.5rem",
  },
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

  const [mounted, setMounted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [slugSync, setSlugSync] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    allCars: [],
  };
  const [formData, setFormData] = useState(initialForm);
  const [localCategories, setLocalCategories] = useState([]);
  const [localCars, setLocalCars] = useState([]);

  useEffect(() => {
    if (catData?.data) setLocalCategories(Array.isArray(catData.data) ? catData.data : []);
    else if (Array.isArray(catData)) setLocalCategories(catData);
  }, [catData]);

  useEffect(() => {
    let cars = [];
    if (carData?.data?.cars) cars = carData.data.cars;
    else if (Array.isArray(carData?.data)) cars = carData.data;
    else if (Array.isArray(carData)) cars = carData;
    
    setLocalCars(cars || []);
  }, [carData]);

  useEffect(() => {
    if (slugSync && formData?.title) {
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9-ء-ي]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug: slug }));
    }
  }, [formData?.title, slugSync]);

  const validation = useMemo(() => {
    const hasTitle = !!(formData?.title?.trim());
    const hasCategory = !!formData?.category;
    const hasContent = !!(formData?.content?.trim()) && formData?.content !== "<p><br></p>";
    const hasImage = !!(formData?.image || file);
    const hasMetaTitle = !!(formData?.metaTitle?.trim());
    const hasMetaDesc = !!(formData?.metaDescription?.trim());
    
    const isReady = hasTitle && hasCategory && hasContent && hasImage && hasMetaTitle && hasMetaDesc;
    
    return {
      isReady,
      hasTitle,
      hasCategory,
      hasContent,
      hasImage,
      hasMetaTitle,
      hasMetaDesc,
      errors: {
        title: !hasTitle,
        category: !hasCategory,
        content: !hasContent,
        image: !hasImage,
        metaTitle: !hasMetaTitle,
        metaDescription: !hasMetaDesc,
      }
    };
  }, [formData]);

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
    if (!mounted) return;
    
    setFormData({ 
      ...initialForm, 
      allCars: Array.isArray(localCars) ? localCars : [],
      relatedCars: [],
      faqs: [],
      primaryCta: { text: "", link: "", type: "custom" },
    });
    setSelectedBlog(null);
    setTabValue(0);
    setFile(null);
    setUploading(false);
  };

  const handleOpenDialog = (blog = null) => {
    if (!mounted) return;
    
    const safeBlog = blog || {};
    
    if (blog) {
      setSelectedBlog(blog);
    }
    
    setFormData({
      title: safeBlog.title || "",
      slug: safeBlog.slug || "",
      category: safeBlog.category?._id || safeBlog.category || "",
      content: safeBlog.content || "",
      summary: safeBlog.summary || "",
      status: safeBlog.status || "draft",
      image: safeBlog.image === 'no-photo.jpg' ? '' : (safeBlog.image || ""),
      relatedCars: Array.isArray(safeBlog.relatedCars) 
        ? safeBlog.relatedCars.map(c => typeof c === 'object' ? c?._id : c) 
        : [],
      metaTitle: safeBlog.metaTitle || "",
      metaDescription: safeBlog.metaDescription || "",
      focusKeywords: Array.isArray(safeBlog.focusKeywords) 
        ? safeBlog.focusKeywords.join(", ") 
        : (typeof safeBlog.focusKeywords === 'string' ? safeBlog.focusKeywords : ""),
      faqs: Array.isArray(safeBlog.faqs) ? safeBlog.faqs : [],
      primaryCta: safeBlog.primaryCta ? {
        text: safeBlog.primaryCta?.text || "",
        link: safeBlog.primaryCta?.link || "",
        type: safeBlog.primaryCta?.type || "custom"
      } : { text: "", link: "", type: "custom" },
      allCars: Array.isArray(localCars) ? localCars : [],
    });
    
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!mounted) return;
    
    if (!validation.isReady) {
      const missingFields = [];
      if (!formData?.title) missingFields.push(t("blog.validation.required.title"));
      if (!formData?.category) missingFields.push(t("blog.validation.required.category"));
      if (!formData?.content) missingFields.push(t("blog.validation.required.content"));
      if (!formData?.image && !file) missingFields.push(t("blog.validation.seoStats.image"));
      if (!formData?.metaTitle) missingFields.push(t("blog.validation.seoStats.title"));
      if (!formData?.metaDescription) missingFields.push(t("blog.validation.seoStats.description"));
      
      if (missingFields.length > 0) {
        toast.error(`${t("blog.validation.publishBlocked")}: ${missingFields.join(", ")}`);
      }
      
      if (!formData?.title || !formData?.category) setTabValue(0);
      else if (!formData?.content) setTabValue(1);
      else setTabValue(2);
      return;
    }

    setUploading(true);
    try {
      let currentImageUrl = formData?.image || "";

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
        focusKeywords: typeof formData?.focusKeywords === 'string' && formData?.focusKeywords
          ? formData.focusKeywords.split(",").map(k => k.trim()).filter(k => k) 
          : (Array.isArray(formData?.focusKeywords) ? formData.focusKeywords : []),
        relatedCars: Array.isArray(formData?.relatedCars) 
          ? formData?.relatedCars.map(c => typeof c === 'object' ? c?._id : c)
          : [],
        summary: formData?.summary || (formData?.content ? formData.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : ""),
      };

      if (selectedBlog) {
        updateMutation.mutate({ slug: selectedBlog?.slug, data: finalData });
      } else {
        createMutation.mutate(finalData);
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  const blogs = blogsData?.data || blogsData?.data?.blogs || (Array.isArray(blogsData) ? blogsData : []);
  const categories = Array.isArray(catData?.data) ? catData.data : (Array.isArray(catData) ? catData : []);
  const cars = localCars;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <CircularProgress thickness={6} size={60} sx={{ color: 'var(--primary)' }} />
      </div>
    );
  }

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
          (Array.isArray(blogs) ? blogs : []).map((blog) => (
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
                    {(Array.isArray(blog?.relatedCars) ? blog.relatedCars : []).filter(car => car && typeof car === 'object').slice(0, 3).map((car, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#020617] overflow-hidden" title={car.name}>
                        <Image src={car.image && car.image !== 'no-photo.jpg' ? car.image : '/images/car-placeholder.png'} alt={car.name || "car"} width={32} height={32} className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="small" component={Link} href={`/blog/${blog._id}`} target="_blank" startIcon={<Visibility />} sx={{ color: '#94a3b8', bgcolor: 'rgba(255,255,255,0.02)', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }, borderRadius: '1rem', fontWeight: 900, px: 1.5, fontSize: '0.7rem', textTransform: 'none' }}>
                      {t("common.view")}
                    </Button>
                    <Button size="small" onClick={() => handleOpenDialog(blog)} startIcon={<Edit />} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }, borderRadius: '1rem', fontWeight: 900, px: 2, fontSize: '0.75rem' }}>
                      {t("common.edit")}
                    </Button>
                    <Button size="small" onClick={() => { setSelectedBlog(blog); setDeleteDialog(true); }} startIcon={<Delete />} sx={{ color: '#ef4444', bgcolor: 'rgba(239,68,68,0.05)', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' }, borderRadius: '1rem', fontWeight: 900, px: 2, fontSize: '0.75rem' }}>
                      {t("common.delete")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {mounted && (
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="lg" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            borderRadius: "2rem", 
            bgcolor: "#020617", 
            border: "1px solid rgba(255,255,255,0.1)", 
            backgroundImage: "radial-gradient(at top right, rgba(249, 115, 22, 0.05) 0%, transparent 70%)",
            maxHeight: "90vh",
          } 
        }}
      >
        <DialogTitle className="flex flex-col gap-4 p-8 border-b border-white/5">
          <div className="flex justify-between items-center">
            <Typography variant="h5" className="text-white font-black tracking-tight">
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
              "& .MuiTab-root": { color: 'rgba(255,255,255,0.4)', fontWeight: 900, minHeight: 56, fontSize: '0.8rem' },
              "& .Mui-selected": { color: 'white !important' }
            }}
          >
            <Tab icon={<AutoFixHigh sx={{ fontSize: 18 }} />} iconPosition="start" label={t("dashboard.admin.blog.elite.generalTab")} />
            <Tab icon={<Article sx={{ fontSize: 18 }} />} iconPosition="start" label={t("dashboard.admin.blog.elite.contentTab")} />
            <Tab icon={<Analytics sx={{ fontSize: 18 }} />} iconPosition="start" label={t("dashboard.admin.blog.elite.seoTab")} />
            <Tab icon={<AdsClick sx={{ fontSize: 18 }} />} iconPosition="start" label={t("dashboard.admin.blog.elite.conversionTab")} />
          </Tabs>
        </DialogTitle>

        <DialogContent className="p-6 overflow-y-auto">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              <TabPanel value={tabValue} index={0}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <TextField 
                      fullWidth 
                      label={t("dashboard.admin.blog.addDialog.titleLabel")} 
                      value={formData?.title || ""} 
                      onChange={(e) => setFormData(prev => ({ ...(prev || {}), title: e.target.value }))} 
                      sx={eliteInputStyle}
                      error={validation.errors.title}
                      required
                    />
                    <div className="flex gap-3">
                      <TextField 
                        fullWidth 
                        label="Slug" 
                        value={formData?.slug || ""} 
                        disabled={slugSync} 
                        sx={eliteInputStyle}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={() => setSlugSync(!slugSync)} sx={{ color: slugSync ? 'var(--primary)' : 'rgba(255,255,255,0.2)' }}>
                              <Settings />
                            </IconButton>
                          )
                        }}
                      />
                    </div>
                    <FormControl fullWidth sx={eliteInputStyle} error={validation.errors.category}>
                      <InputLabel>{t("dashboard.admin.blog.addDialog.categoryLabel")}</InputLabel>
                      <Select 
                        value={formData?.category || ""} 
                        onChange={(e) => setFormData(prev => ({ ...(prev || {}), category: e.target.value }))} 
                        label={t("dashboard.admin.blog.addDialog.categoryLabel")}
                      >
                        {(Array.isArray(localCategories) && localCategories.length === 0) ? (
                          <MenuItem disabled>{t("dashboard.admin.blog.elite.loading")}</MenuItem>
                        ) : (
                          (Array.isArray(localCategories) ? localCategories : []).map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)
                        )}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={eliteInputStyle}>
                      <InputLabel>{t("dashboard.admin.blog.addDialog.statusLabel")}</InputLabel>
                      <Select value={formData?.status || "draft"} onChange={(e) => setFormData(prev => ({ ...(prev || {}), status: e.target.value }))} label={t("dashboard.admin.blog.addDialog.statusLabel")}>
                        <MenuItem value="draft">{t("dashboard.admin.blog.statuses.draft")}</MenuItem>
                        <MenuItem value="published">{t("dashboard.admin.blog.statuses.published")}</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="space-y-6">
                    <ImageUpload 
                      value={formData?.image || ""}
                      onChange={(url) => setFormData(prev => ({ ...(prev || {}), image: url || "" }))}
                      onFileSelect={(f) => setFile(f)}
                      error={validation.errors.image}
                    />
                    <Autocomplete
                      multiple
                      options={localCars || []}
                      loading={!localCars?.length && !carData}
                      getOptionLabel={(option) => `${option?.name || ""} (${option?.year || ""})`}
                      isOptionEqualToValue={(option, value) => (option?._id || option) === (value?._id || value)}
                      value={(localCars || []).filter(car => (formData?.relatedCars || []).includes(car?._id))}
                      onChange={(event, newValue) => {
                        if (!newValue) newValue = [];
                        setFormData(prev => ({
                          ...(prev || initialForm),
                          relatedCars: Array.isArray(newValue) ? newValue.map(car => car?._id).filter(Boolean) : []
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("dashboard.admin.blog.addDialog.relatedCarsLabel")}
                          sx={eliteInputStyle}
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        (value || []).map((option, index) => (
                          <Chip
                            key={option?._id || index}
                            label={option?.name || ""}
                            {...getTagProps({ index })}
                            sx={{ borderRadius: '0.75rem', fontWeight: 'bold', bgcolor: 'var(--primary)', color: 'white' }}
                            avatar={
                              <div className="w-5 h-5 rounded-full bg-slate-800 overflow-hidden ml-1">
                                <Image src={option?.image && option?.image !== 'no-photo.jpg' ? option.image : '/images/car-placeholder.png'} alt="" width={20} height={20} className="object-cover" />
                              </div>
                            }
                          />
                        ))
                      }
                    />
                  </div>
                </div>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <div className="space-y-8">
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={2} 
                    label={t("dashboard.admin.blog.addDialog.summaryLabel")} 
                    value={formData?.summary || ""} 
                    onChange={(e) => setFormData(prev => ({ ...(prev || {}), summary: e.target.value }))} 
                    sx={eliteInputStyle}
                  />
                  <div className="min-h-[450px] border border-white/10 rounded-[2rem] overflow-hidden bg-white/5 p-4 ql-elite-editor">
                    <style>{`
                      .ql-elite-editor .ql-editor { font-size: 1.25rem !important; line-height: 1.8 !important; min-height: 350px; color: white; }
                      .ql-elite-editor .ql-toolbar { border-radius: 1.5rem 1.5rem 0 0 !important; background: rgba(255,255,255,0.05) !important; border: none !important; padding: 15px !important; }
                      .ql-elite-editor .ql-container { border: none !important; }
                    `}</style>
                    <ReactQuill 
                      theme="snow" 
                      value={formData?.content || ""} 
                      onChange={(v) => setFormData(prev => ({ ...(prev || {}), content: v || "" }))}
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
                    <TextField 
                      fullWidth 
                      label={t("dashboard.admin.blog.addDialog.metaTitleLabel")} 
                      value={formData?.metaTitle || ""} 
                      onChange={(e) => setFormData(prev => ({...prev, metaTitle: e.target.value}))} 
                      helperText={`${formData?.metaTitle?.length || 0}/60`}
                      sx={eliteInputStyle}
                      error={validation.errors.metaTitle}
                      required
                    />
                    <TextField 
                      fullWidth 
                      label={t("dashboard.admin.blog.addDialog.metaDescLabel")} 
                      multiline 
                      rows={4} 
                      value={formData?.metaDescription || ""} 
                      onChange={(e) => setFormData(prev => ({...prev, metaDescription: e.target.value}))} 
                      helperText={`${formData?.metaDescription?.length || 0}/160`}
                      sx={eliteInputStyle}
                      error={validation.errors.metaDescription}
                      required
                    />
                    <TextField 
                      fullWidth 
                      label={t("dashboard.admin.blog.addDialog.keywordsLabel")} 
                      value={formData?.focusKeywords || ""} 
                      onChange={(e) => setFormData(prev => ({...prev, focusKeywords: e.target.value}))} 
                      sx={eliteInputStyle}
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <Typography className="text-white/60 font-black">{t("dashboard.admin.blog.elite.faqBuilder")}</Typography>
                      <Button startIcon={<Add />} onClick={() => setFormData(prev => ({...prev, faqs: [...(prev?.faqs || []), { question: "", answer: "" }]}))}>{t("dashboard.admin.blog.elite.addFaq")}</Button>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {(formData?.faqs || []).map((faq, idx) => (
                        <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4 relative">
                          <IconButton onClick={() => setFormData(prev => ({...prev, faqs: (prev?.faqs || []).filter((_, i) => i !== idx)}))} sx={{ position:'absolute', top: 10, right: 10 }}><Delete fontSize="small" /></IconButton>
                          <TextField 
                            fullWidth 
                            label={t("dashboard.admin.blog.elite.question")} 
                            value={faq?.question || ""} 
                            onChange={(e) => {
                              const next = [...(formData?.faqs || [])]; 
                              if (next[idx]) next[idx].question = e.target.value; 
                              setFormData(prev => ({...prev, faqs: next}));
                            }} 
                            sx={eliteInputStyle} 
                          />
                          <TextField 
                            fullWidth 
                            multiline 
                            rows={2} 
                            label={t("dashboard.admin.blog.elite.answer")} 
                            value={faq?.answer || ""} 
                            onChange={(e) => {
                              const next = [...(formData?.faqs || [])]; 
                              if (next[idx]) next[idx].answer = e.target.value; 
                              setFormData(prev => ({...prev, faqs: next}));
                            }} 
                            sx={eliteInputStyle} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField 
                      label={t("dashboard.admin.blog.elite.ctaText")} 
                      fullWidth 
                      value={formData?.primaryCta?.text || ""} 
                      onChange={(e) => setFormData(prev => ({...prev, primaryCta: {...(prev?.primaryCta || {}), text: e.target.value}}))} 
                      sx={eliteInputStyle} 
                    />
                    <TextField 
                      label={t("dashboard.admin.blog.elite.ctaLink")} 
                      fullWidth 
                      value={formData?.primaryCta?.link || ""} 
                      onChange={(e) => setFormData(prev => ({...prev, primaryCta: {...(prev?.primaryCta || {}), link: e.target.value}}))} 
                      sx={eliteInputStyle} 
                    />
                  </div>
                  <FormControl fullWidth sx={eliteInputStyle}>
                    <InputLabel>{t("dashboard.admin.blog.elite.ctaType")}</InputLabel>
                    <Select 
                      value={formData?.primaryCta?.type || ""} 
                      onChange={(e) => setFormData(prev => ({...prev, primaryCta: {...(prev?.primaryCta || {}), type: e.target.value}}))} 
                      label={t("dashboard.admin.blog.elite.ctaType")}
                    >
                      <MenuItem value="booking">Booking</MenuItem>
                      <MenuItem value="offer">Offer</MenuItem>
                      <MenuItem value="contact">Contact</MenuItem>
                      <MenuItem value="custom">Custom</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </TabPanel>
            </div>

            <div className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-6">
                <SEOPreview 
                  formData={formData}
                  image={formData?.image || (file ? URL.createObjectURL(file) : null)}
                  relatedCars={localCars.filter(car => (formData?.relatedCars || []).includes(car._id))}
                />
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
          <Button 
            onClick={() => setOpenDialog(false)} 
            sx={{ color: "rgba(255,255,255,0.4)", fontWeight: "900", px: 6 }}
          >
            {t("common.cancel")}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            fullWidth 
            disabled={uploading || createMutation.isPending || updateMutation.isPending}
            startIcon={validation.isReady ? <CheckCircle /> : <Lock />}
            sx={{ 
              py: 2, 
              borderRadius: "2rem", 
              fontWeight: "900",
              bgcolor: validation.isReady ? "#22c55e" : "var(--primary)",
              "&:hover": { 
                bgcolor: validation.isReady ? "#16a34a" : undefined,
                transform: validation.isReady ? "translateY(-2px)" : undefined,
                boxShadow: validation.isReady ? "0 10px 30px rgba(34, 197, 94, 0.4)" : undefined,
              },
              boxShadow: validation.isReady ? "0 5px 20px rgba(34, 197, 94, 0.3)" : undefined,
              transition: "all 0.3s ease",
            }}
          >
            {uploading ? t("dashboard.admin.blog.elite.publishing") : (selectedBlog ? t("dashboard.admin.blog.elite.update") : t("dashboard.admin.blog.elite.publish"))}
          </Button>
        </DialogActions>
      </Dialog>
      )}

      {mounted && (
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} PaperProps={{ sx: { borderRadius: "2.5rem", bgcolor: "#020617", border: "1px solid rgba(185,28,28,0.3)" } }}>
        <DialogTitle className="text-red-500 font-black p-8 pb-4">{t("dashboard.admin.blog.deleteDialog.title")}</DialogTitle>
        <DialogContent className="p-8 pt-0 text-slate-400 font-bold">{t("dashboard.admin.blog.deleteDialog.message")} ({selectedBlog?.title})?</DialogContent>
        <DialogActions className="p-8">
          <Button onClick={() => setDeleteDialog(false)} sx={{ color: "white" }}>{t("common.no")}</Button>
          <Button variant="contained" color="error" onClick={() => deleteMutation.mutate(selectedBlog?.slug)}>{t("common.yes")}</Button>
        </DialogActions>
      </Dialog>
      )}
    </div>
  );
}
