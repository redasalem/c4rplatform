"use client";

import { useState, useEffect } from "react";
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
  AutoFixHigh
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamic import for ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <CircularProgress size={20} />,
});
import "react-quill/dist/quill.snow.css";

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
    queryFn: () => blogService.getAll({ limit: 50, sort: '-createdAt', status: '' }),
  });

  const { data: catData } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => categoryService.getAll(),
  });

  const { data: carData } = useQuery({
    queryKey: ["adminCars"],
    queryFn: () => carService.getAll({ limit: 100 }),
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [slugSync, setSlugSync] = useState(true);

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
      toast.success("تم إنشـاء المقال بنجاح (Elite Mode Active)");
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
      toast.success("تم التحديث بنجاح");
      queryClient.invalidateQueries(["adminBlogs"]);
      setOpenDialog(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.delete,
    onSuccess: () => {
      toast.success("تم حذف المقال");
      queryClient.invalidateQueries(["adminBlogs"]);
      setDeleteDialog(false);
      setSelectedBlog(null);
    },
  });

  const resetForm = () => {
    setFormData(initialForm);
    setSelectedBlog(null);
    setTabValue(0);
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
        relatedCars: blog.relatedCars?.map(c => c._id || c) || [],
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
        focusKeywords: Array.isArray(blog.focusKeywords) ? blog.focusKeywords.join(", ") : "",
        faqs: blog.faqs || [],
        primaryCta: blog.primaryCta || { text: "", link: "", type: "custom" },
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content || !formData.category) {
      toast.warning("يرجى ملء الحقول الرئيسية");
      setTabValue(0);
      return;
    }

    const finalData = {
      ...formData,
      focusKeywords: formData.focusKeywords ? formData.focusKeywords.split(",").map(k => k.trim()).filter(k => k) : [],
      summary: formData.summary || formData.content.replace(/<[^>]*>?/gm, '').substring(0, 160),
    };

    if (selectedBlog) {
      updateMutation.mutate({ slug: selectedBlog?.slug, data: finalData });
    } else {
      createMutation.mutate(finalData);
    }
  };

  const blogs = blogsData?.data || [];
  const categories = catData?.data || [];
  const cars = carData?.data || [];

  return (
    <div className="space-y-8" dir={i18n.dir()}>
      <div className="bg-[#020617] backdrop-blur-3xl p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/20 transition-all duration-700" />
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter flex items-center gap-3">
             إدارة <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">المحتوى الـ Elite</span>
          </h1>
          <p className="text-slate-400 font-bold text-base md:text-lg flex items-center gap-2">
            <AutoFixHigh className="text-primary/50" fontSize="small" />
            تحكم كامل في المقالات، الـ SEO، والروابط الذكية للسيارات
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
          إضافـة مقال جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogsLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
             <CircularProgress thickness={6} size={60} sx={{ color: 'var(--primary)' }} />
             <p className="text-white font-black animate-pulse">جاري تحميل البيانات الذكية...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full text-center py-32 bg-white/5 border-2 border-dashed border-white/5 rounded-[3.5rem]">
            <Article sx={{ fontSize: 100, color: "rgba(255,255,255,0.05)" }} className="mb-6" />
            <h3 className="text-2xl font-black text-slate-400">لا يوجد مقالات حتى الآن</h3>
            <Button onClick={() => handleOpenDialog()} className="mt-6 text-primary font-black">ابدأ الآن</Button>
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
                        {blog.relatedCars?.slice(0,3).map((car, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#020617] overflow-hidden" title={car.name}>
                             <Image src={car.image || '/images/car-top.png'} alt="car" width={32} height={32} className="object-cover" />
                          </div>
                        ))}
                     </div>
                     <div className="flex gap-1">
                        <IconButton onClick={() => handleOpenDialog(blog)} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: 'white' } }}><Edit fontSize="small" /></IconButton>
                        <IconButton onClick={() => { setSelectedBlog(blog); setDeleteDialog(true); }} sx={{ color: 'rgba(249,115,22,0.3)', '&:hover': { color: '#f97316' } }}><Delete fontSize="small" /></IconButton>
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
                   {selectedBlog ? "تحرير المقال الاحترافي" : "إنشاء مقال Elite جديد"}
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
             <Tab icon={<AutoFixHigh />} iconPosition="start" label="General" />
             <Tab icon={<Article />} iconPosition="start" label="Content" />
             <Tab icon={<Analytics />} iconPosition="start" label="SEO & FAQ" />
             <Tab icon={<AdsClick />} iconPosition="start" label="Conversion" />
           </Tabs>
        </DialogTitle>

        <DialogContent className="p-10">
           <TabPanel value={tabValue} index={0}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <TextField fullWidth label="Article Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} sx={inputStyle} />
                        <div className="flex gap-4">
                            <TextField fullWidth label="Slug" value={formData.slug} disabled={slugSync} sx={inputStyle} />
                            <IconButton onClick={() => setSlugSync(!slugSync)} sx={{ color: slugSync ? 'var(--primary)' : 'rgba(255,255,255,0.2)' }}><Settings /></IconButton>
                        </div>
                        <FormControl fullWidth sx={inputStyle}>
                            <InputLabel>Category</InputLabel>
                            <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} label="Category">
                                {categories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={inputStyle}>
                            <InputLabel>Status</InputLabel>
                            <Select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} label="Status">
                                <MenuItem value="draft">Draft</MenuItem>
                                <MenuItem value="published">Published</MenuItem>
                            </Select>
                        </FormControl>
                     </div>
                     <div className="space-y-6">
                        <Box sx={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '2rem', height: 200, display: 'flex', itemsCenter: 'center', justifyCenter: 'center', bgcolor: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                           <TextField label="Cover Image URL" fullWidth value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} sx={inputStyle} />
                        </Box>
                        <FormControl fullWidth sx={inputStyle}>
                            <InputLabel>Linked Cars</InputLabel>
                            <Select multiple value={formData.relatedCars} onChange={(e) => setFormData({...formData, relatedCars: e.target.value})}
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((val) => <Chip key={val} label={cars.find(c => c._id === val)?.name || val} size="small" sx={{ bgcolor: 'var(--primary)', color: 'white' }} />)}
                                </Box>
                              )}
                            >
                                {cars.map(car => <MenuItem key={car._id} value={car._id}>{car.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                     </div>
                </div>
           </TabPanel>

           <TabPanel value={tabValue} index={1}>
                <div className="space-y-8">
                    <TextField fullWidth multiline rows={2} label="Excerpt" value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} sx={inputStyle} />
                    <div className="min-h-[400px] border border-white/10 rounded-[2rem] overflow-hidden bg-white/5 p-4">
                        <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData({...formData, content: v})} style={{ height: 350, color: 'white' }} />
                    </div>
                </div>
           </TabPanel>

           <TabPanel value={tabValue} index={2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <TextField fullWidth label="Meta Title" value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} helperText={`${formData.metaTitle.length}/60`} sx={inputStyle} />
                        <TextField fullWidth label="Meta Description" multiline rows={4} value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} helperText={`${formData.metaDescription.length}/160`} sx={inputStyle} />
                        <TextField fullWidth label="Focus Keywords" value={formData.focusKeywords} onChange={(e) => setFormData({...formData, focusKeywords: e.target.value})} sx={inputStyle} />
                    </div>
                    <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <Typography className="text-white/60 font-black">FAQ Builder</Typography>
                            <Button startIcon={<Add />} onClick={() => setFormData({...formData, faqs: [...formData.faqs, { question: "", answer: "" }]})}>Add FAQ</Button>
                         </div>
                         <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                             {formData.faqs.map((faq, idx) => (
                                 <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4 relative">
                                     <IconButton onClick={() => setFormData({...formData, faqs: formData.faqs.filter((_, i) => i !== idx)})} sx={{ position:'absolute', top: 10, right: 10 }}><Delete fontSize="small" /></IconButton>
                                     <TextField fullWidth label="Question" value={faq.question} onChange={(e) => {
                                         const next = [...formData.faqs]; next[idx].question = e.target.value; setFormData({...formData, faqs: next});
                                     }} sx={inputStyle} />
                                     <TextField fullWidth multiline rows={2} label="Answer" value={faq.answer} onChange={(e) => {
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
                        <TextField label="CTA Button Text" fullWidth value={formData.primaryCta.text} onChange={(e) => setFormData({...formData, primaryCta: {...formData.primaryCta, text: e.target.value}})} sx={inputStyle} />
                        <TextField label="CTA Link" fullWidth value={formData.primaryCta.link} onChange={(e) => setFormData({...formData, primaryCta: {...formData.primaryCta, link: e.target.value}})} sx={inputStyle} />
                    </div>
                    <FormControl fullWidth sx={inputStyle}>
                        <InputLabel>CTA Type</InputLabel>
                        <Select value={formData.primaryCta.type} onChange={(e) => setFormData({...formData, primaryCta: {...formData.primaryCta, type: e.target.value}})} label="CTA Type">
                            <MenuItem value="booking">Booking</MenuItem><MenuItem value="offer">Offer</MenuItem><MenuItem value="contact">Contact</MenuItem><MenuItem value="custom">Custom</MenuItem>
                        </Select>
                    </FormControl>
                </div>
           </TabPanel>
        </DialogContent>

        <DialogActions className="p-10 bg-white/5 border-t border-white/5 flex gap-6">
           <Button onClick={() => setOpenDialog(false)} sx={{ color: "rgba(255,255,255,0.4)", fontWeight: "900", px: 6 }}>Cancel</Button>
           <Button variant="contained" onClick={handleSubmit} fullWidth sx={{ py: 2, borderRadius: "2rem", fontWeight: "900", bgcolor: "var(--primary)" }}>
             {selectedBlog ? "Update Elite Content" : "Publish Elite Article"}
           </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} PaperProps={{ sx: { borderRadius: "2.5rem", bgcolor: "#020617", border: "1px solid rgba(185,28,28,0.3)" } }}>
        <DialogTitle className="text-red-500 font-black p-8 pb-4">Delete Article?</DialogTitle>
        <DialogContent className="p-8 pt-0 text-slate-400 font-bold">Permanently remove ({selectedBlog?.title})?</DialogContent>
        <DialogActions className="p-8"><Button onClick={() => setDeleteDialog(false)} sx={{ color: "white" }}>No</Button><Button variant="contained" color="error" onClick={() => deleteMutation.mutate(selectedBlog?.slug)}>Yes, Delete</Button></DialogActions>
      </Dialog>
    </div>
  );
}
