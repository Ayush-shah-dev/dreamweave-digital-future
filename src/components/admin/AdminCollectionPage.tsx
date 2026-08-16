import { AlertCircle, FileText, MessageSquare, Plus, Search, Star, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
import { deleteBlog, deleteTestimonial, listBlogs, listTestimonials } from "@/lib/admin-content";
import type { Blog, Testimonial } from "@/integrations/supabase/types";
import { getIncludeDemoTestimonials, setIncludeDemoTestimonials } from "@/lib/testimonial-display";

type Collection = "blogs" | "testimonials";
type StatusFilter = "all" | "draft" | "published";

// Stable empty-array reference so `items` doesn't change identity on every render while loading.
const EMPTY_ITEMS: (Blog | Testimonial)[] = [];

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminCollectionPage({ collection }: { collection: Collection }) {
  const isBlogs = collection === "blogs";
  const title = isBlogs ? "Blogs" : "Testimonials";
  const description = isBlogs
    ? "Create and manage the ideas behind the brand."
    : "Keep the strongest client voices close to the work.";
  const Icon = isBlogs ? FileText : MessageSquare;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [pendingDelete, setPendingDelete] = useState<{ id: string; label: string } | null>(null);
  const [includeDemoTestimonials, setIncludeDemoTestimonialsState] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isBlogs) setIncludeDemoTestimonialsState(getIncludeDemoTestimonials());
  }, [isBlogs]);

  const query = useQuery({
    queryKey: [collection],
    queryFn: (): Promise<(Blog | Testimonial)[]> => (isBlogs ? listBlogs() : listTestimonials()),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => (isBlogs ? deleteBlog(id) : deleteTestimonial(id)),
    onSuccess: () => {
      toast.success(`${isBlogs ? "Blog" : "Testimonial"} deleted.`);
      void queryClient.invalidateQueries({ queryKey: [collection] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete. Please try again.");
    },
    onSettled: () => setPendingDelete(null),
  });

  const items = query.data ?? EMPTY_ITEMS;
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (!term) return true;
      const haystack = isBlogs
        ? [(item as Blog).title, (item as Blog).category, (item as Blog).slug]
        : [
            (item as Testimonial).name,
            (item as Testimonial).designation,
            (item as Testimonial).company,
            (item as Testimonial).quote,
          ];
      return haystack.some((value) => value?.toLowerCase().includes(term));
    });
  }, [items, search, status, isBlogs]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">
            Content management
          </p>
          <h1 className="font-display text-4xl tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-black/55">{description}</p>
        </div>
        <Link
          to={isBlogs ? "/admin/blogs/new" : "/admin/testimonials/new"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b1815] px-4 py-2.5 text-sm text-white transition hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add {isBlogs ? "blog" : "testimonial"}
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-black/8 bg-white/65 p-5 shadow-sm">
        {!isBlogs && (
          <div className="mb-5 flex flex-col gap-4 rounded-xl border border-primary/15 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-black/80">Show demo testimonials on the homepage</p>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-black/50">
                Keep the built-in examples alongside published admin testimonials while you build your content library.
              </p>
            </div>
            <Switch
              checked={includeDemoTestimonials}
              aria-label="Show demo testimonials on the homepage"
              onCheckedChange={(checked) => {
                setIncludeDemoTestimonialsState(checked);
                setIncludeDemoTestimonials(checked);
                toast.success(
                  checked
                    ? "Demo testimonials added to the homepage."
                    : "Homepage now shows admin testimonials only.",
                );
              }}
              className="h-7 w-12 [&>span]:h-5 [&>span]:w-5 data-[state=checked]:[&>span]:translate-x-5"
            />
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/10 bg-white/70 pl-10 pr-4 text-sm outline-none placeholder:text-black/35 focus:border-primary"
              placeholder={`Search ${title.toLowerCase()}...`}
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="h-11 rounded-xl border border-black/10 bg-white/70 px-4 text-sm text-black/70 outline-none focus:border-primary"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-black/8">
          {query.isLoading && (
            <div className="space-y-2 p-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-black/5" />
              ))}
            </div>
          )}

          {query.isError && (
            <div className="flex flex-col items-center gap-3 p-10 text-center text-sm text-black/55">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <p>
                {query.error instanceof Error
                  ? query.error.message
                  : `Couldn't load ${title.toLowerCase()}.`}
              </p>
              <button
                onClick={() => query.refetch()}
                className="rounded-full border border-black/15 px-4 py-2 text-xs hover:border-primary hover:text-primary"
              >
                Try again
              </button>
            </div>
          )}

          {!query.isLoading && !query.isError && filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-black/45">
              {items.length === 0
                ? `No ${title.toLowerCase()} yet — create the first one.`
                : `No matching ${title.toLowerCase()}.`}
            </div>
          )}

          {!query.isLoading &&
            !query.isError &&
            filtered.map((item) =>
              isBlogs ? (
                <BlogRow
                  key={item.id}
                  blog={item as Blog}
                  onDelete={() => setPendingDelete({ id: item.id, label: (item as Blog).title })}
                />
              ) : (
                <TestimonialRow
                  key={item.id}
                  testimonial={item as Testimonial}
                  onDelete={() =>
                    setPendingDelete({ id: item.id, label: (item as Testimonial).name })
                  }
                />
              ),
            )}
        </div>
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{pendingDelete?.label}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes this {isBlogs ? "blog post" : "testimonial"}. This can't be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={
        status === "published"
          ? "rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-700"
          : "rounded-full bg-black/8 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-black/50"
      }
    >
      {status}
    </span>
  );
}

function BlogRow({ blog, onDelete }: { blog: Blog; onDelete: () => void }) {
  return (
    <div className="flex flex-col gap-3 border-b border-black/8 bg-white/55 p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{blog.title}</p>
          <p className="mt-1 text-xs text-black/45">
            {blog.category || "Uncategorized"} · {blog.author_name || "Dreamweave Digital"} ·
            Updated {formatDate(blog.updated_at)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <StatusBadge status={blog.status} />
        <Link
          to="/admin/blogs/$id/edit"
          params={{ id: blog.id }}
          className="text-sm text-primary hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={onDelete}
          className="text-black/35 hover:text-red-600"
          aria-label={`Delete ${blog.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function TestimonialRow({
  testimonial,
  onDelete,
}: {
  testimonial: Testimonial;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-black/8 bg-white/55 p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {testimonial.profile_image ? (
          <img
            src={testimonial.profile_image}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <MessageSquare className="h-4 w-4" />
          </div>
        )}
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium">
            {testimonial.name}
            {testimonial.featured && <Star className="h-3.5 w-3.5 fill-primary text-primary" />}
          </p>
          <p className="mt-1 max-w-md truncate text-xs text-black/45">
            {[testimonial.designation, testimonial.company].filter(Boolean).join(" · ") ||
              testimonial.quote}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <StatusBadge status={testimonial.status} />
        <Link
          to="/admin/testimonials/$id/edit"
          params={{ id: testimonial.id }}
          className="text-sm text-primary hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={onDelete}
          className="text-black/35 hover:text-red-600"
          aria-label={`Delete ${testimonial.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
