import { ArrowLeft, ImagePlus, Loader2, Save, Send, Trash2, Undo2, X } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  createBlog,
  createTestimonial,
  deleteBlog,
  deleteTestimonial,
  getBlogById,
  getTestimonialById,
  unpublishBlog,
  unpublishTestimonial,
  updateBlog,
  updateTestimonial,
  type BlogFormInput,
  type TestimonialFormInput,
} from "@/lib/admin-content";
import {
  removeStorageObject,
  storagePathFromPublicUrl,
  uploadBlogImage,
  uploadTestimonialImage,
  validateImageFile,
} from "@/lib/admin-storage";

type Kind = "blog" | "testimonial";

export function AdminEditorPage({ kind, id }: { kind: Kind; id: string | undefined }) {
  return kind === "blog" ? <BlogEditor id={id} /> : <TestimonialEditor id={id} />;
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function EditorShell({
  backTo,
  backLabel,
  eyebrow,
  heading,
  children,
  aside,
}: {
  backTo: string;
  backLabel: string;
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
  aside: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>
      <div className="mt-8">
        <p className="text-xs uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{heading}</h1>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5 rounded-2xl border border-black/8 bg-white/65 p-6 shadow-sm">
          {children}
        </div>
        <aside className="space-y-5">{aside}</aside>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {children}
      {hint && <span className="mt-1.5 block text-xs font-normal text-black/40">{hint}</span>}
    </label>
  );
}

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-primary";
const textareaClass =
  "mt-2 w-full rounded-xl border border-black/10 bg-white p-4 text-sm outline-none focus:border-primary";

function ImageUploader({
  label,
  imageUrl,
  onUpload,
  onRemove,
  rounded,
}: {
  label: string;
  imageUrl: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  rounded?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      await onUpload(file);
      toast.success("Image uploaded.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (imageUrl) {
    return (
      <div className="rounded-2xl border border-black/8 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">{label}</p>
        <div className="relative mt-3">
          <img
            src={imageUrl}
            alt=""
            className={
              rounded
                ? "h-24 w-24 rounded-full object-cover"
                : "h-32 w-full rounded-xl object-cover"
            }
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-[#1b1815] text-white shadow"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <label className="mt-3 block text-center text-xs text-primary hover:underline">
          {uploading ? "Uploading…" : "Replace image"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-black/15 p-5 text-center">
      <ImagePlus className="mx-auto h-6 w-6 text-primary" />
      <p className="mt-3 text-sm font-medium">{label}</p>
      <label className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-full border border-black/15 px-4 py-2 text-xs hover:border-primary hover:text-primary">
        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Choose image"}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>
      <p className="mt-2 text-[11px] text-black/40">JPEG, PNG or WebP, up to 5MB.</p>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function DeleteButton({
  label,
  onConfirm,
  isPending,
}: {
  label: string;
  onConfirm: () => void;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" /> Delete
      </button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{label}"?</AlertDialogTitle>
          <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---------------------------------------------------------------------------
// Blog editor
// ---------------------------------------------------------------------------

const SUMMARY_MAX = 300;
const SEO_TITLE_MAX = 60;
const SEO_DESCRIPTION_MAX = 160;

// Text inputs always hold a plain `string` in form state (never `null`) — `null` only shows
// up in the payload built by buildPayload(), once a field is submitted. Keeps every input's
// `value` prop trivially typed and avoids `exactOptionalPropertyTypes` friction in the JSX below.
interface BlogFormState {
  title: string;
  slug: string;
  short_summary: string;
  content: string;
  category: string;
  author_name: string;
  reading_time_input: string;
  featured_image: string;
  seo_title: string;
  seo_description: string;
  status: BlogFormInput["status"];
  published_date: string | null;
}

function emptyBlogForm(): BlogFormState {
  return {
    title: "",
    slug: "",
    short_summary: "",
    content: "",
    category: "",
    author_name: "Dreamweave Digital",
    reading_time_input: "",
    featured_image: "",
    seo_title: "",
    seo_description: "",
    status: "draft",
    published_date: null,
  };
}

function BlogEditor({ id }: { id: string | undefined }) {
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAdminAuth();
  const [form, setForm] = useState(emptyBlogForm());
  const [loaded, setLoaded] = useState(!isEditing);

  const query = useQuery({
    queryKey: ["blogs", id],
    queryFn: () => getBlogById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (query.data && !loaded) {
      setForm({
        title: query.data.title,
        slug: query.data.slug,
        short_summary: query.data.short_summary ?? "",
        content: query.data.content,
        category: query.data.category ?? "",
        author_name: query.data.author_name ?? "Dreamweave Digital",
        reading_time_input: query.data.reading_time?.toString() ?? "",
        featured_image: query.data.featured_image ?? "",
        seo_title: query.data.seo_title ?? "",
        seo_description: query.data.seo_description ?? "",
        status: query.data.status,
        published_date: query.data.published_date,
      });
      setLoaded(true);
    }
  }, [query.data, loaded]);

  function buildPayload(status: "draft" | "published"): BlogFormInput | null {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return null;
    }
    if (form.short_summary.length > SUMMARY_MAX) {
      toast.error(`Short summary must be ${SUMMARY_MAX} characters or fewer.`);
      return null;
    }
    if (status === "published" && !form.content.trim()) {
      toast.error("Content is required to publish.");
      return null;
    }
    const readingTime =
      form.reading_time_input.trim() === "" ? null : Number(form.reading_time_input);
    if (readingTime !== null && (!Number.isFinite(readingTime) || readingTime <= 0)) {
      toast.error("Reading time must be a positive number.");
      return null;
    }
    return {
      title: form.title.trim(),
      slug: form.slug.trim() || null,
      short_summary: form.short_summary.trim() || null,
      content: form.content,
      category: form.category.trim() || null,
      author_name: form.author_name.trim() || null,
      reading_time: readingTime,
      featured_image: form.featured_image || null,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      status,
      published_date: form.published_date,
    };
  }

  const saveMutation = useMutation({
    mutationFn: async (status: "draft" | "published") => {
      const payload = buildPayload(status);
      if (!payload) throw new SkipToast();
      return isEditing ? updateBlog(id!, payload) : createBlog(payload);
    },
    onSuccess: (blog) => {
      toast.success(isEditing ? "Blog updated." : "Blog created.");
      void queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate({ to: "/admin/blogs/$id/edit", params: { id: blog.id } });
    },
    onError: (error: unknown) => {
      if (error instanceof SkipToast) return;
      toast.error(error instanceof Error ? error.message : "Failed to save blog.");
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: () => unpublishBlog(id!),
    onSuccess: (blog) => {
      toast.success("Blog unpublished.");
      setForm((prev) => ({ ...prev, status: blog.status }));
      void queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error: unknown) =>
      toast.error(error instanceof Error ? error.message : "Failed to unpublish."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBlog(id!),
    onSuccess: () => {
      toast.success("Blog deleted.");
      void queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate({ to: "/admin/blogs" });
    },
    onError: (error: unknown) =>
      toast.error(error instanceof Error ? error.message : "Failed to delete."),
  });

  async function handleImageUpload(file: File) {
    if (!user) return;
    const url = await uploadBlogImage(file, user.id);
    setForm((prev) => ({ ...prev, featured_image: url }));
  }

  function handleImageRemove() {
    const path = storagePathFromPublicUrl("blog-images", form.featured_image);
    setForm((prev) => ({ ...prev, featured_image: "" }));
    if (path) void removeStorageObject("blog-images", path).catch(() => {});
  }

  if (isEditing && query.isLoading) {
    return (
      <div className="mx-auto grid max-w-5xl place-items-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isEditing && query.isError) {
    return (
      <div className="mx-auto max-w-5xl py-24 text-center text-sm text-black/55">
        Couldn't load this blog.{" "}
        <Link to="/admin/blogs" className="text-primary hover:underline">
          Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <EditorShell
      backTo="/admin/blogs"
      backLabel="Back to blogs"
      eyebrow={isEditing ? "Edit blog" : "New blog"}
      heading={isEditing ? "Refine the story." : "Create a blog."}
      aside={
        <>
          <div className="rounded-2xl border border-black/8 bg-white/65 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Publishing</p>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value as "draft" | "published" }))
              }
              className="mt-4 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            {form.published_date && (
              <p className="mt-3 text-xs text-black/40">
                Published {new Date(form.published_date).toLocaleDateString("en-IN")}
              </p>
            )}
            <div className="mt-4 space-y-2">
              <button
                type="button"
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate("draft")}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-sm hover:border-primary hover:text-primary disabled:opacity-60"
              >
                <Save className="h-4 w-4" /> Save draft
              </button>
              <button
                type="button"
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate("published")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1b1815] px-4 py-2.5 text-sm text-white hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
              >
                <Send className="h-4 w-4" /> {saveMutation.isPending ? "Saving…" : "Publish"}
              </button>
              {isEditing && form.status === "published" && (
                <button
                  type="button"
                  disabled={unpublishMutation.isPending}
                  onClick={() => unpublishMutation.mutate()}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-sm hover:border-primary hover:text-primary disabled:opacity-60"
                >
                  <Undo2 className="h-4 w-4" /> Unpublish
                </button>
              )}
            </div>
          </div>

          <ImageUploader
            label="Cover image"
            imageUrl={form.featured_image}
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
          />

          <div className="flex flex-col gap-2">
            {isEditing && (
              <DeleteButton
                label={form.title || "this blog"}
                isPending={deleteMutation.isPending}
                onConfirm={() => deleteMutation.mutate()}
              />
            )}
            <Link
              to="/admin/blogs"
              className="text-center text-xs text-black/40 hover:text-primary"
            >
              Cancel
            </Link>
          </div>
        </>
      }
    >
      <Field label="Title">
        <input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="A clear, memorable headline"
          className={inputClass}
        />
      </Field>
      <Field label="Slug" hint="Leave blank to generate automatically from the title.">
        <input
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          placeholder="auto-generated-from-title"
          className={inputClass}
        />
      </Field>
      <Field
        label="Short summary"
        hint={`${form.short_summary.length}/${SUMMARY_MAX} characters — shown on the blog listing.`}
      >
        <textarea
          value={form.short_summary}
          onChange={(e) => setForm((p) => ({ ...p, short_summary: e.target.value }))}
          placeholder="A short introduction for the blog listing..."
          className={`${textareaClass} min-h-28`}
        />
      </Field>
      <Field label="Content">
        <textarea
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          placeholder="Start writing your blog..."
          className={`${textareaClass} min-h-72`}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category">
          <input
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            placeholder="Strategy"
            className={inputClass}
          />
        </Field>
        <Field label="Author name">
          <input
            value={form.author_name}
            onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Reading time (minutes)">
        <input
          value={form.reading_time_input}
          onChange={(e) => setForm((p) => ({ ...p, reading_time_input: e.target.value }))}
          placeholder="6"
          inputMode="numeric"
          className={inputClass}
        />
      </Field>
      <Field label="SEO title" hint={`${form.seo_title.length}/${SEO_TITLE_MAX} recommended`}>
        <input
          value={form.seo_title}
          onChange={(e) => setForm((p) => ({ ...p, seo_title: e.target.value }))}
          className={inputClass}
        />
      </Field>
      <Field
        label="SEO description"
        hint={`${form.seo_description.length}/${SEO_DESCRIPTION_MAX} recommended`}
      >
        <textarea
          value={form.seo_description}
          onChange={(e) => setForm((p) => ({ ...p, seo_description: e.target.value }))}
          className={`${textareaClass} min-h-24`}
        />
      </Field>
    </EditorShell>
  );
}

// ---------------------------------------------------------------------------
// Testimonial editor
// ---------------------------------------------------------------------------

interface TestimonialFormState {
  name: string;
  designation: string;
  company: string;
  quote: string;
  profile_image: string;
  rating: number;
  status: TestimonialFormInput["status"];
  featured: boolean;
  display_order_input: string;
}

function emptyTestimonialForm(): TestimonialFormState {
  return {
    name: "",
    designation: "",
    company: "",
    quote: "",
    profile_image: "",
    rating: 5,
    status: "draft",
    featured: false,
    display_order_input: "0",
  };
}

function TestimonialEditor({ id }: { id: string | undefined }) {
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAdminAuth();
  const [form, setForm] = useState(emptyTestimonialForm());
  const [loaded, setLoaded] = useState(!isEditing);

  const query = useQuery({
    queryKey: ["testimonials", id],
    queryFn: () => getTestimonialById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (query.data && !loaded) {
      setForm({
        name: query.data.name,
        designation: query.data.designation ?? "",
        company: query.data.company ?? "",
        quote: query.data.quote,
        profile_image: query.data.profile_image ?? "",
        rating: query.data.rating,
        status: query.data.status,
        featured: query.data.featured,
        display_order_input: query.data.display_order.toString(),
      });
      setLoaded(true);
    }
  }, [query.data, loaded]);

  function buildPayload(status: "draft" | "published"): TestimonialFormInput | null {
    if (!form.name.trim()) {
      toast.error("Name is required.");
      return null;
    }
    if (!form.quote.trim()) {
      toast.error("Quote is required.");
      return null;
    }
    if (form.rating < 1 || form.rating > 5) {
      toast.error("Rating must be between 1 and 5.");
      return null;
    }
    const displayOrder = Number(form.display_order_input);
    if (!Number.isFinite(displayOrder)) {
      toast.error("Display order must be a number.");
      return null;
    }
    return {
      name: form.name.trim(),
      designation: form.designation.trim() || null,
      company: form.company.trim() || null,
      quote: form.quote.trim(),
      profile_image: form.profile_image || null,
      rating: form.rating,
      status,
      featured: form.featured,
      display_order: displayOrder,
    };
  }

  const saveMutation = useMutation({
    mutationFn: async (status: "draft" | "published") => {
      const payload = buildPayload(status);
      if (!payload) throw new SkipToast();
      return isEditing ? updateTestimonial(id!, payload) : createTestimonial(payload);
    },
    onSuccess: (testimonial) => {
      toast.success(isEditing ? "Testimonial updated." : "Testimonial created.");
      void queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      navigate({ to: "/admin/testimonials/$id/edit", params: { id: testimonial.id } });
    },
    onError: (error: unknown) => {
      if (error instanceof SkipToast) return;
      toast.error(error instanceof Error ? error.message : "Failed to save testimonial.");
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: () => unpublishTestimonial(id!),
    onSuccess: (testimonial) => {
      toast.success("Testimonial unpublished.");
      setForm((prev) => ({ ...prev, status: testimonial.status }));
      void queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (error: unknown) =>
      toast.error(error instanceof Error ? error.message : "Failed to unpublish."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTestimonial(id!),
    onSuccess: () => {
      toast.success("Testimonial deleted.");
      void queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      navigate({ to: "/admin/testimonials" });
    },
    onError: (error: unknown) =>
      toast.error(error instanceof Error ? error.message : "Failed to delete."),
  });

  async function handleImageUpload(file: File) {
    if (!user) return;
    const url = await uploadTestimonialImage(file, user.id);
    setForm((prev) => ({ ...prev, profile_image: url }));
  }

  function handleImageRemove() {
    const path = storagePathFromPublicUrl("testimonial-images", form.profile_image);
    setForm((prev) => ({ ...prev, profile_image: "" }));
    if (path) void removeStorageObject("testimonial-images", path).catch(() => {});
  }

  if (isEditing && query.isLoading) {
    return (
      <div className="mx-auto grid max-w-5xl place-items-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isEditing && query.isError) {
    return (
      <div className="mx-auto max-w-5xl py-24 text-center text-sm text-black/55">
        Couldn't load this testimonial.{" "}
        <Link to="/admin/testimonials" className="text-primary hover:underline">
          Back to testimonials
        </Link>
      </div>
    );
  }

  return (
    <EditorShell
      backTo="/admin/testimonials"
      backLabel="Back to testimonials"
      eyebrow={isEditing ? "Edit testimonial" : "New testimonial"}
      heading={isEditing ? "Refine the story." : "Create a testimonial."}
      aside={
        <>
          <div className="rounded-2xl border border-black/8 bg-white/65 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Publishing</p>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value as "draft" | "published" }))
              }
              className="mt-4 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <label className="mt-4 flex items-center justify-between text-sm">
              Featured
              <Switch
                checked={form.featured}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, featured: checked }))}
              />
            </label>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate("draft")}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-sm hover:border-primary hover:text-primary disabled:opacity-60"
              >
                <Save className="h-4 w-4" /> Save draft
              </button>
              <button
                type="button"
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate("published")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1b1815] px-4 py-2.5 text-sm text-white hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
              >
                <Send className="h-4 w-4" /> {saveMutation.isPending ? "Saving…" : "Publish"}
              </button>
              {isEditing && form.status === "published" && (
                <button
                  type="button"
                  disabled={unpublishMutation.isPending}
                  onClick={() => unpublishMutation.mutate()}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-sm hover:border-primary hover:text-primary disabled:opacity-60"
                >
                  <Undo2 className="h-4 w-4" /> Unpublish
                </button>
              )}
            </div>
          </div>

          <ImageUploader
            label="Profile image"
            imageUrl={form.profile_image}
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
            rounded
          />

          <div className="flex flex-col gap-2">
            {isEditing && (
              <DeleteButton
                label={form.name || "this testimonial"}
                isPending={deleteMutation.isPending}
                onConfirm={() => deleteMutation.mutate()}
              />
            )}
            <Link
              to="/admin/testimonials"
              className="text-center text-xs text-black/40 hover:text-primary"
            >
              Cancel
            </Link>
          </div>
        </>
      }
    >
      <Field label="Name">
        <input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Client name"
          className={inputClass}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Designation">
          <input
            value={form.designation}
            onChange={(e) => setForm((p) => ({ ...p, designation: e.target.value }))}
            placeholder="Founder"
            className={inputClass}
          />
        </Field>
        <Field label="Company">
          <input
            value={form.company}
            onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
            placeholder="Serein Skin"
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Testimonial">
        <textarea
          value={form.quote}
          onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
          placeholder="What did they say about working with Dreamweave?"
          className={`${textareaClass} min-h-40`}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Rating">
          <select
            value={form.rating}
            onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}
            className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-primary"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Display order" hint="Lower numbers show first.">
          <input
            value={form.display_order_input}
            onChange={(e) => setForm((p) => ({ ...p, display_order_input: e.target.value }))}
            inputMode="numeric"
            className={inputClass}
          />
        </Field>
      </div>
    </EditorShell>
  );
}

/** Thrown to short-circuit a mutation's promise without also firing the generic error toast. */
class SkipToast extends Error {}
