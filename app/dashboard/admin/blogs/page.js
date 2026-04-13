"use client";

import { useState } from "react";
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
  OutlinedInput,
  Chip,
  Box
} from "@mui/material";
import { Add, Delete, Edit, Article, OpenInNew } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";

// Load ReactQuill dynamically for client-side only
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false, loading: () => <CircularProgress size={24} /> });

export default function AdminBlogs() {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();

  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ["adminBlogs"],
    queryFn: () => blogService.getAll({ limit: 50, sort: '-createdAt', status: '' }), // fetch both published & drafts
  });

  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => categoryService.getAll(),
  });

  const { data: carData, isLoading: carLoading } = useQuery({
    queryKey: ["adminCars"],
    queryFn: () => carService.getAll({ limit: 50 }),
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const initialForm = {
    title: "",
    summary: "",
    content: "",
    category: "",
    status: "draft",
    image: "",
    relatedCars: []
  };
  const [formData, setFormData] = useState(initialForm);

  const createMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      toast.success("تم إنشـاء المقال بنجاح");
      queryClient.invalidateQueries(["adminBlogs"]);
      setOpenDialog(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => blogService.update(id, data),
    onSuccess: () => {
      toast.success("تم تحديث المقال بنجاح");
      queryClient.invalidateQueries(["adminBlogs"]);
      setOpenDialog(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.delete,
    onSuccess: () => {
      toast.success("تم الحذف بنجاح");
      queryClient.invalidateQueries(["adminBlogs"]);
      setDeleteDialog(false);
      setSelectedBlog(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ");
    },
  });

  const resetForm = () => {
    setFormData(initialForm);
    setSelectedBlog(null);
  };

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setSelectedBlog(blog);
      setFormData({
        title: blog.title,
        summary: blog.summary || "",
        content: blog.content,
        category: blog.category?._id || blog.category || "",
        status: blog.status,
        image: blog.image === 'no-photo.jpg' ? '' : blog.image,
        relatedCars: blog.relatedCars?.map(c => c._id || c) || []
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category) {
      return toast.warning("يرجى ملء الحقول الإلزامية (العنوان، المحتوى، القسم)");
    }

    if (selectedBlog?._id) {
      updateMutation.mutate({ id: selectedBlog._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const blogs = blogsData?.data || [];
  const categories = catData?.data || [];
  const cars = carData?.data || [];

  return (
    <div className="space-y-4 md:space-y-6" dir={i18n.dir()}>
      <div className="bg-white/5 backdrop-blur-2xl p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center shadow-2xl gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tighter">
            إدارة <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">المدونـة (SEO)</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm md:text-base">
            إضافة مقالات قوية لتحسين محركات البحث وربطها بالسيارات
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: "1rem",
            px: 4,
            py: 1.5,
            fontWeight: "900",
            bgcolor: "var(--primary)",
            "&:hover": { bgcolor: "var(--primary-hover)" },
          }}
        >
          إضافـة مقال
        </Button>
      </div>

      <div className="bg-white/5 backdrop-blur-xl p-4 md:p-8 rounded-2xl md:rounded-[3rem] border border-white/10 shadow-2xl min-h-[400px]">
        {blogsLoading ? (
          <CircularProgress className="m-auto block mt-10" />
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl mt-4">
            <Article sx={{ fontSize: 48, color: "rgba(255,255,255,0.2)" }} className="mb-4" />
            <p className="text-lg font-black text-slate-500">لا يوجد مقالات مضافة بعد!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.filter(Boolean).map((blog) => (
              <div key={blog?._id || blog?.slug} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors group flex flex-col">
                <div className="relative h-48 w-full bg-slate-800">
                  {blog?.image && blog.image !== 'no-photo.jpg' ? (
                    <Image src={blog.image} alt={blog?.title || ''} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Article sx={{ fontSize: 48, opacity: 0.5 }} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-2 py-1 text-[10px] font-black rounded-lg ${blog?.status === 'published' ? 'bg-green-500/80 text-white' : 'bg-orange-500/80 text-white'}`}>
                      {blog?.status === 'published' ? 'منشور' : 'مسودة'}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur px-2 py-1 rounded-lg text-[10px] text-white font-bold inline-flex items-center gap-1">
                    👁 {blog?.views || 0}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-[10px] text-primary font-black uppercase mb-1 line-clamp-1">
                    {blog?.category?.name || "بدون قسم"}
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 line-clamp-2">{blog?.title || "بدون عنوان"}</h3>
                  <p className="text-xs text-slate-400 font-medium mb-4 line-clamp-2 flex-1">{blog?.summary || ""}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 italic">
                      {blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString(i18n.language) : ""}
                    </span>
                    <div className="flex gap-2">
                      <IconButton size="small" onClick={() => handleOpenDialog(blog)} sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "white" } }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => { setSelectedBlog(blog); setDeleteDialog(true); }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "1.5rem", bgcolor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", minHeight: '80vh' } }}>
        <DialogTitle className="text-white font-black border-b border-white/10 pb-4">
          {selectedBlog ? "تعديل المقال" : "إضـافة مقال جديد"}
        </DialogTitle>
        <DialogContent className="space-y-6 pt-6">
          <TextField
            fullWidth
            label="العنوان (SEO Title)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            variant="filled"
            required
            sx={{ input: { color: "white" }, label: { color: "rgba(255,255,255,0.5)" }, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 1 }}
          />
          
          <TextField
            fullWidth
            label="الوصف (Meta Description / Summary)"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            variant="filled"
            multiline
            rows={2}
            sx={{ textarea: { color: "white" }, label: { color: "rgba(255,255,255,0.5)" }, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 1 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth variant="filled" sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: 1 }}>
              <InputLabel sx={{ color: "rgba(255,255,255,0.5)" }}>القسم</InputLabel>
              <Select
                value={formData.category}
                required
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={{ color: "white", "& .MuiSelect-icon": { color: "white" } }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="filled" sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: 1 }}>
              <InputLabel sx={{ color: "rgba(255,255,255,0.5)" }}>الحالة</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                sx={{ color: "white", "& .MuiSelect-icon": { color: "white" } }}
              >
                <MenuItem value="draft">مسودة (رؤية للإدارة فقط)</MenuItem>
                <MenuItem value="published">منشور (مرئي للكل)</MenuItem>
              </Select>
            </FormControl>
          </div>

          <TextField
            fullWidth
            label="رابط الصورة (Image URL)"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            variant="filled"
            placeholder="https://example.com/image.jpg"
            sx={{ input: { color: "white" }, label: { color: "rgba(255,255,255,0.5)" }, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 1 }}
          />

          <FormControl fullWidth variant="filled" sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: 1 }}>
            <InputLabel sx={{ color: "rgba(255,255,255,0.5)" }}>السيارات المرتبطة (SEO Dual Linking)</InputLabel>
            <Select
              multiple
              value={formData.relatedCars}
              onChange={(e) => setFormData({ ...formData, relatedCars: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value })}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const car = cars.find(c => c._id === value);
                    return <Chip key={value} label={car ? `${car.make} ${car.model}` : value} sx={{ bgcolor: "var(--primary)", color: "white", borderRadius: 1 }} size="small" />;
                  })}
                </Box>
              )}
              sx={{ color: "white", "& .MuiSelect-icon": { color: "white" } }}
            >
              {cars.map((car) => (
                <MenuItem key={car._id} value={car._id}>{`${car.make} ${car.model} (${car.year})`}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="bg-white/5 rounded-xl border border-white/10 p-2 text-white">
            <div className="mb-2 px-2 text-sm text-slate-400 font-bold">المحتوى النصي مع الروابط </div>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              className="text-white bg-[#1e293b]"
              style={{ minHeight: '200px' }}
            />
          </div>
        </DialogContent>
        <DialogActions className="p-4 border-t border-white/10 mt-4">
          <Button onClick={() => setOpenDialog(false)} sx={{ color: "rgba(255,255,255,0.5)", fontWeight: "bold", mr: 2 }}>إلغاء</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} sx={{ bgcolor: "var(--primary)", borderRadius: "0.75rem", fontWeight: "bold" }}>
            {selectedBlog ? "تحديث التغييرات" : "حفظ المقال"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} PaperProps={{ sx: { borderRadius: "1.5rem", bgcolor: "#0f172a", border: "1px solid rgba(220,38,38,0.2)" } }}>
        <DialogTitle className="text-red-500 font-black">حـذف المقال</DialogTitle>
        <DialogContent className="text-white/80">هل أنت متأكد من رغبتك في حذف ({selectedBlog?.title})؟</DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setDeleteDialog(false)} sx={{ color: "rgba(255,255,255,0.5)", fontWeight: "bold" }}>إلغاء</Button>
          <Button variant="contained" color="error" onClick={() => selectedBlog && deleteMutation.mutate(selectedBlog._id)} disabled={deleteMutation.isPending || !selectedBlog} sx={{ borderRadius: "0.75rem", fontWeight: "bold" }}>
            تأكيد الحذف
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
