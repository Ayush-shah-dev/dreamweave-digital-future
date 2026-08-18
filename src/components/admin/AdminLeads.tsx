import {
  AlertCircle,
  Briefcase,
  ChevronDown,
  Inbox,
  Mail,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import {
  FORM_TYPE_LABELS,
  LEAD_FIELD_LABELS,
  deleteLead,
  deleteNewsletterSubscriber,
  listLeads,
  listNewsletterSubscribers,
  summarizeLead,
  updateLeadStatus,
} from "@/lib/leads";
import type {
  FormSubmission,
  FormSubmissionStatus,
  FormSubmissionType,
  NewsletterSubscriber,
} from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type TabKey = "all" | FormSubmissionType | "newsletter";
type StatusFilter = "all" | FormSubmissionStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All leads" },
  { key: "contact", label: "Contact" },
  { key: "apply", label: "Creator applications" },
  { key: "book_campaign", label: "Campaign briefs" },
  { key: "newsletter", label: "Newsletter" },
];

const FORM_TYPE_ICONS: Record<FormSubmissionType, typeof Mail> = {
  contact: Mail,
  apply: UserPlus,
  book_campaign: Briefcase,
};

// Stable empty-array references so query results don't change identity on every render while loading.
const EMPTY_LEADS: FormSubmission[] = [];
const EMPTY_SUBSCRIBERS: NewsletterSubscriber[] = [];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AdminLeads() {
  const [tab, setTab] = useState<TabKey>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<
    | { kind: "lead"; id: string; label: string }
    | { kind: "subscriber"; id: string; label: string }
    | null
  >(null);
  const queryClient = useQueryClient();

  const leadsQuery = useQuery({ queryKey: ["leads"], queryFn: listLeads });
  const subscribersQuery = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: listNewsletterSubscribers,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: FormSubmissionStatus }) =>
      updateLeadStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to update status.");
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      toast.success("Lead deleted.");
      void queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete. Please try again.");
    },
    onSettled: () => setPendingDelete(null),
  });

  const deleteSubscriberMutation = useMutation({
    mutationFn: (id: string) => deleteNewsletterSubscriber(id),
    onSuccess: () => {
      toast.success("Subscriber removed.");
      void queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to remove. Please try again.");
    },
    onSettled: () => setPendingDelete(null),
  });

  const leads = leadsQuery.data ?? EMPTY_LEADS;
  const subscribers = subscribersQuery.data ?? EMPTY_SUBSCRIBERS;
  const isNewsletterTab = tab === "newsletter";

  const counts = useMemo(
    () => ({
      all: leads.length,
      contact: leads.filter((l) => l.form_type === "contact").length,
      apply: leads.filter((l) => l.form_type === "apply").length,
      book_campaign: leads.filter((l) => l.form_type === "book_campaign").length,
      newsletter: subscribers.length,
    }),
    [leads, subscribers],
  );

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (tab !== "all" && tab !== "newsletter" && lead.form_type !== tab) return false;
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (!term) return true;
      return Object.values(lead.data).some((value) => value.toLowerCase().includes(term));
    });
  }, [leads, tab, statusFilter, search]);

  const filteredSubscribers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(term));
  }, [subscribers, search]);

  const isLoading = isNewsletterTab ? subscribersQuery.isLoading : leadsQuery.isLoading;
  const isError = isNewsletterTab ? subscribersQuery.isError : leadsQuery.isError;

  return (
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">Inbound</p>
        <h1 className="font-display text-4xl tracking-tight">Leads</h1>
        <p className="mt-3 text-sm text-black/55">
          Every enquiry from Contact, Apply as Creator, and Book Campaign, plus newsletter signups.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setExpandedId(null);
            }}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition-colors",
              tab === key
                ? "bg-[#1b1815] text-white"
                : "border border-black/10 bg-white/60 text-black/60 hover:border-primary hover:text-primary",
            )}
          >
            {label} <span className="text-xs opacity-60">({counts[key]})</span>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-black/8 bg-white/65 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/10 bg-white/70 pl-10 pr-4 text-sm outline-none placeholder:text-black/35 focus:border-primary"
              placeholder={isNewsletterTab ? "Search by email..." : "Search leads..."}
            />
          </div>
          {!isNewsletterTab && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-11 rounded-xl border border-black/10 bg-white/70 px-4 text-sm text-black/70 outline-none focus:border-primary"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="archived">Archived</option>
            </select>
          )}
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-black/8">
          {isLoading && (
            <div className="space-y-2 p-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-black/5" />
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-3 p-10 text-center text-sm text-black/55">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <p>Couldn't load {isNewsletterTab ? "subscribers" : "leads"}.</p>
              <button
                onClick={() =>
                  isNewsletterTab ? subscribersQuery.refetch() : leadsQuery.refetch()
                }
                className="rounded-full border border-black/15 px-4 py-2 text-xs hover:border-primary hover:text-primary"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && isNewsletterTab && filteredSubscribers.length === 0 && (
            <div className="p-10 text-center text-sm text-black/45">
              {subscribers.length === 0
                ? "No newsletter subscribers yet."
                : "No matching subscribers."}
            </div>
          )}

          {!isLoading && !isError && !isNewsletterTab && filteredLeads.length === 0 && (
            <div className="p-10 text-center text-sm text-black/45">
              {leads.length === 0 ? "No leads yet." : "No matching leads."}
            </div>
          )}

          {!isLoading &&
            !isError &&
            !isNewsletterTab &&
            filteredLeads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                expanded={expandedId === lead.id}
                onToggle={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                onStatusChange={(status) => statusMutation.mutate({ id: lead.id, status })}
                onDelete={() =>
                  setPendingDelete({
                    kind: "lead",
                    id: lead.id,
                    label: summarizeLead(lead.form_type, lead.data).title,
                  })
                }
              />
            ))}

          {!isLoading &&
            !isError &&
            isNewsletterTab &&
            filteredSubscribers.map((subscriber) => (
              <SubscriberRow
                key={subscriber.id}
                subscriber={subscriber}
                onDelete={() =>
                  setPendingDelete({
                    kind: "subscriber",
                    id: subscriber.id,
                    label: subscriber.email,
                  })
                }
              />
            ))}
        </div>
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDelete?.kind === "subscriber" ? "Remove" : "Delete lead from"} "
              {pendingDelete?.label}"?
            </AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteLeadMutation.isPending || deleteSubscriberMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteLeadMutation.isPending || deleteSubscriberMutation.isPending}
              onClick={() => {
                if (!pendingDelete) return;
                if (pendingDelete.kind === "lead") deleteLeadMutation.mutate(pendingDelete.id);
                else deleteSubscriberMutation.mutate(pendingDelete.id);
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteLeadMutation.isPending || deleteSubscriberMutation.isPending
                ? "Removing…"
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status }: { status: FormSubmissionStatus }) {
  const styles: Record<FormSubmissionStatus, string> = {
    new: "bg-primary/10 text-primary",
    contacted: "bg-emerald-500/10 text-emerald-700",
    archived: "bg-black/8 text-black/50",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}

function LeadRow({
  lead,
  expanded,
  onToggle,
  onStatusChange,
  onDelete,
}: {
  lead: FormSubmission;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (status: FormSubmissionStatus) => void;
  onDelete: () => void;
}) {
  const { title, subtitle } = summarizeLead(lead.form_type, lead.data);
  const Icon = FORM_TYPE_ICONS[lead.form_type];
  const fieldLabels = LEAD_FIELD_LABELS[lead.form_type];

  return (
    <div className="border-b border-black/8 bg-white/55 last:border-0">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="mt-1 truncate text-xs text-black/45">
              {FORM_TYPE_LABELS[lead.form_type]}
              {subtitle ? ` · ${subtitle}` : ""} · {formatDate(lead.created_at)}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-black/30 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>
        <div className="flex items-center gap-3">
          <StatusBadge status={lead.status} />
          <select
            aria-label={`Status for ${title}`}
            value={lead.status}
            onChange={(e) => onStatusChange(e.target.value as FormSubmissionStatus)}
            className="h-9 rounded-lg border border-black/10 bg-white/70 px-3 text-xs text-black/70 outline-none focus:border-primary"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={onDelete}
            className="text-black/35 hover:text-red-600"
            aria-label={`Delete lead from ${title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="grid gap-3 border-t border-black/8 bg-black/[0.02] p-4 text-sm sm:grid-cols-2">
          {Object.entries(lead.data).map(([key, value]) => (
            <div key={key}>
              <p className="text-xs text-black/40">{fieldLabels[key] ?? key}</p>
              <p className="mt-0.5 break-words">{value || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubscriberRow({
  subscriber,
  onDelete,
}: {
  subscriber: NewsletterSubscriber;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/8 bg-white/55 p-4 last:border-0">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Inbox className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{subscriber.email}</p>
          <p className="mt-1 text-xs text-black/45">
            Subscribed {formatDate(subscriber.created_at)}
          </p>
        </div>
      </div>
      <button
        onClick={onDelete}
        className="text-black/35 hover:text-red-600"
        aria-label={`Remove ${subscriber.email}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
