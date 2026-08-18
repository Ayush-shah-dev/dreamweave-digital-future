import { AlertCircle, FileText, Inbox, MessageSquare, Plus, Sparkles, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { listBlogs, listTestimonials } from "@/lib/admin-content";
import { FORM_TYPE_LABELS, listLeads, summarizeLead } from "@/lib/leads";

export function AdminOverview() {
  const [greeting, setGreeting] = useState("Welcome back");
  const blogsQuery = useQuery({ queryKey: ["blogs"], queryFn: listBlogs });
  const testimonialsQuery = useQuery({ queryKey: ["testimonials"], queryFn: listTestimonials });
  const leadsQuery = useQuery({ queryKey: ["leads"], queryFn: listLeads });

  const blogs = blogsQuery.data ?? [];
  const testimonials = testimonialsQuery.data ?? [];
  const leads = leadsQuery.data ?? [];
  const isLoading = blogsQuery.isLoading || testimonialsQuery.isLoading || leadsQuery.isLoading;
  const isError = blogsQuery.isError || testimonialsQuery.isError || leadsQuery.isError;

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  const stats = [
    {
      label: "New leads",
      value: leads.filter((l) => l.status === "new").length,
      icon: Inbox,
      note: `${leads.length} total`,
    },
    {
      label: "Published blogs",
      value: blogs.filter((b) => b.status === "published").length,
      icon: FileText,
      note: "Live on the blog",
    },
    {
      label: "Draft blogs",
      value: blogs.filter((b) => b.status === "draft").length,
      icon: FileText,
      note: "Not yet visible",
    },
    {
      label: "Testimonials",
      value: testimonials.length,
      icon: MessageSquare,
      note: `${testimonials.filter((t) => t.featured).length} featured`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">Content workspace</p>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
            {greeting}, admin.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
            Manage the stories and social proof that make Dreamweave feel human.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#1b1815] px-4 py-2.5 text-sm text-white transition hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New blog
          </Link>
          <Link
            to="/admin/testimonials/new"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-sm transition hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Add testimonial
          </Link>
        </div>
      </div>

      {isError ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white/65 p-10 text-center text-sm text-black/55 shadow-sm">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <p>Couldn't load your content. Refresh to try again.</p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, note }) => (
              <div
                key={label}
                className="rounded-2xl border border-black/8 bg-white/65 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-black/55">{label}</p>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-6 font-display text-4xl">
                  {isLoading ? (
                    <span className="inline-block h-9 w-12 animate-pulse rounded bg-black/10 align-middle" />
                  ) : (
                    value
                  )}
                </p>
                <p className="mt-2 text-xs text-black/40">{note}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-black/8 bg-white/65 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">Recent work</p>
                  <h2 className="mt-2 font-display text-2xl">Latest blogs</h2>
                </div>
                <Link to="/admin/blogs" className="text-xs text-black/50 hover:text-primary">
                  View all
                </Link>
              </div>
              <div className="mt-8 space-y-2">
                {isLoading &&
                  [0, 1].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-black/5" />
                  ))}
                {!isLoading && blogs.length === 0 && (
                  <div className="py-6 text-center text-sm text-black/45">
                    <Sparkles className="mx-auto h-5 w-5 text-primary" />
                    <p className="mt-3">No blogs yet — write your first one.</p>
                  </div>
                )}
                {blogs.slice(0, 4).map((blog) => (
                  <Link
                    key={blog.id}
                    to="/admin/blogs/$id/edit"
                    params={{ id: blog.id }}
                    className="flex items-center justify-between rounded-xl border border-black/8 bg-white/60 p-4 text-left hover:border-primary"
                  >
                    <span>
                      <span className="block text-sm font-medium">{blog.title}</span>
                      <span className="mt-1 block text-xs text-black/45">
                        {blog.category || "Uncategorized"} · {blog.status}
                      </span>
                    </span>
                    <span className="text-xs text-primary">Edit</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-black/8 bg-white/65 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">Social proof</p>
                  <h2 className="mt-2 font-display text-2xl">Latest testimonials</h2>
                </div>
                <Link to="/admin/testimonials" className="text-xs text-black/50 hover:text-primary">
                  View all
                </Link>
              </div>
              <div className="mt-8 space-y-2">
                {isLoading &&
                  [0, 1].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-black/5" />
                  ))}
                {!isLoading && testimonials.length === 0 && (
                  <div className="py-6 text-center text-sm text-black/45">
                    <Sparkles className="mx-auto h-5 w-5 text-primary" />
                    <p className="mt-3">No testimonials yet — add your first one.</p>
                  </div>
                )}
                {testimonials.slice(0, 4).map((testimonial) => (
                  <Link
                    key={testimonial.id}
                    to="/admin/testimonials/$id/edit"
                    params={{ id: testimonial.id }}
                    className="flex items-center justify-between rounded-xl border border-black/8 bg-white/60 p-4 text-left hover:border-primary"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="block text-sm font-medium">{testimonial.name}</span>
                      {testimonial.featured && (
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      )}
                    </span>
                    <span className="text-xs text-primary">Edit</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-2xl border border-black/8 bg-white/65 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Inbound</p>
                <h2 className="mt-2 font-display text-2xl">Recent leads</h2>
              </div>
              <Link to="/admin/leads" className="text-xs text-black/50 hover:text-primary">
                View all
              </Link>
            </div>
            <div className="mt-8 space-y-2">
              {isLoading &&
                [0, 1].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-black/5" />)}
              {!isLoading && leads.length === 0 && (
                <div className="py-6 text-center text-sm text-black/45">
                  <Sparkles className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-3">No leads yet — they'll show up here as forms are submitted.</p>
                </div>
              )}
              {leads.slice(0, 4).map((lead) => {
                const { title, subtitle } = summarizeLead(lead.form_type, lead.data);
                return (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between rounded-xl border border-black/8 bg-white/60 p-4"
                  >
                    <span>
                      <span className="block text-sm font-medium">{title}</span>
                      <span className="mt-1 block text-xs text-black/45">
                        {FORM_TYPE_LABELS[lead.form_type]}
                        {subtitle ? ` · ${subtitle}` : ""}
                      </span>
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary">
                      {lead.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
