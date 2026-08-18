// Hand-maintained to match supabase/migrations/0001_admin_content.sql and
// supabase/migrations/0002_leads.sql. If the schema changes, update this file and the
// migration together.

export type BlogStatus = "draft" | "published";
export type TestimonialStatus = "draft" | "published";
export type FormSubmissionType = "contact" | "apply" | "book_campaign";
export type FormSubmissionStatus = "new" | "contacted" | "archived";

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          role: "admin";
          created_at: string;
        };
        Insert: {
          user_id: string;
          role?: "admin";
          created_at?: string;
        };
        Update: {
          user_id?: string;
          role?: "admin";
          created_at?: string;
        };
        Relationships: [];
      };
      blogs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_summary: string | null;
          content: string;
          featured_image: string | null;
          category: string | null;
          author_name: string | null;
          reading_time: number | null;
          status: BlogStatus;
          published_date: string | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string | null;
          short_summary?: string | null;
          content?: string;
          featured_image?: string | null;
          category?: string | null;
          author_name?: string | null;
          reading_time?: number | null;
          status?: BlogStatus;
          published_date?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string | null;
          short_summary?: string | null;
          content?: string;
          featured_image?: string | null;
          category?: string | null;
          author_name?: string | null;
          reading_time?: number | null;
          status?: BlogStatus;
          published_date?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          designation: string | null;
          company: string | null;
          quote: string;
          profile_image: string | null;
          rating: number;
          status: TestimonialStatus;
          featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          designation?: string | null;
          company?: string | null;
          quote: string;
          profile_image?: string | null;
          rating?: number;
          status?: TestimonialStatus;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          designation?: string | null;
          company?: string | null;
          quote?: string;
          profile_image?: string | null;
          rating?: number;
          status?: TestimonialStatus;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      form_submissions: {
        Row: {
          id: string;
          form_type: FormSubmissionType;
          data: Record<string, string>;
          status: FormSubmissionStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          form_type: FormSubmissionType;
          data?: Record<string, string>;
          status?: FormSubmissionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          form_type?: FormSubmissionType;
          data?: Record<string, string>;
          status?: FormSubmissionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Blog = Database["public"]["Tables"]["blogs"]["Row"];
export type BlogInsert = Database["public"]["Tables"]["blogs"]["Insert"];
export type BlogUpdate = Database["public"]["Tables"]["blogs"]["Update"];

export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type TestimonialInsert = Database["public"]["Tables"]["testimonials"]["Insert"];
export type TestimonialUpdate = Database["public"]["Tables"]["testimonials"]["Update"];

export type AdminUser = Database["public"]["Tables"]["admin_users"]["Row"];

export type FormSubmission = Database["public"]["Tables"]["form_submissions"]["Row"];
export type FormSubmissionInsert = Database["public"]["Tables"]["form_submissions"]["Insert"];
export type FormSubmissionUpdate = Database["public"]["Tables"]["form_submissions"]["Update"];

export type NewsletterSubscriber = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];
export type NewsletterSubscriberInsert =
  Database["public"]["Tables"]["newsletter_subscribers"]["Insert"];
