export const BRAND = {
  name: "Dreamweave Digital",
  tagline: "Crafting Your Vision. Digitally.",
  founder: "Mit Prajapati",
  address: "508, President Complex, Sector 11, Gandhinagar, Gujarat 382011, India",
  city: "Gandhinagar",
  phoneDisplay: "+91 63541 18698",
  phoneRaw: "916354118698",
  email: "hello@dreamweavedigitalinfluencers.com",
  social: {
    instagram: "https://www.instagram.com/dreamweave_digital_",
    youtube: "https://www.youtube.com/",
    linkedin: "https://www.linkedin.com/",
  },
};

export const WHATSAPP_MESSAGE = `Hi Dreamweave Digital 👋

I found your website and I'm interested in discussing a creator marketing campaign for my brand.

Please get in touch with me.

Thank you.`;

export function waLink(message: string = WHATSAPP_MESSAGE) {
  return `https://wa.me/${BRAND.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/creators", label: "Creators" },
  { to: "/brands", label: "Brands" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export const STATS = [
  { value: 10000, suffix: "+", label: "Verified Influencers" },
  { value: 500, suffix: "+", label: "Campaigns Delivered" },
  { value: 20, suffix: "M+", label: "Views Generated" },
  { value: 50, suffix: "+", label: "Brands Served" },
];

export const SERVICES = [
  {
    slug: "influencer-marketing",
    title: "Influencer Marketing",
    blurb:
      "End-to-end influencer campaigns for product launches, brand awareness, app promotions, real estate, education, FMCG, fashion, beauty, finance and more.",
    deliverables: [
      "Campaign strategy & goals",
      "Influencer shortlisting",
      "Negotiation & contracting",
      "Publishing & performance reports",
    ],
  },
  {
    slug: "ugc-content-creation",
    title: "UGC Content Creation",
    blurb:
      "Authentic creator-generated content for paid ads, websites, Amazon listings and social media.",
    deliverables: ["Creator briefs", "Ad-ready UGC hooks", "Listing & website assets", "Raw + edited masters"],
  },
  {
    slug: "celebrity-macro-campaigns",
    title: "Celebrity & Macro Influencer Campaigns",
    blurb: "Partner with top creators and celebrities for maximum brand visibility.",
    deliverables: ["Celebrity outreach", "Rate & rights negotiation", "Shoot coordination", "Visibility reporting"],
  },
  {
    slug: "social-media-management",
    title: "Social Media Management",
    blurb: "Content planning, creative design, reels, growth strategy and community management.",
    deliverables: ["Monthly content calendar", "Creative & reel production", "Growth strategy", "Community management"],
  },
  {
    slug: "product-photoshoot-video",
    title: "Product Photoshoot & Video Production",
    blurb: "Professional product shoots, lifestyle videos, commercial reels and brand films.",
    deliverables: ["Pre-production & storyboard", "Studio or location shoot", "Lifestyle & tabletop stills", "Edited brand films"],
  },
  {
    slug: "talent-management",
    title: "Talent Management",
    blurb: "Helping creators grow while connecting them with premium brand collaborations.",
    deliverables: ["Creator positioning", "Brand deal sourcing", "Rate cards & contracts", "Payment follow-through"],
  },
];

export const INDUSTRIES = [
  "Real Estate",
  "Education",
  "Healthcare",
  "Food & Restaurants",
  "Beauty & Skincare",
  "Fashion",
  "Jewellery",
  "Finance",
  "Automobile",
  "Travel",
  "Fitness",
  "Technology",
  "E-commerce",
  "Hospitality",
];

export const WHY_CHOOSE_US = [
  "10,000+ Verified Influencers Across India",
  "Every Niche Covered",
  "Campaign Strategy & Execution",
  "Dedicated Campaign Manager",
  "Transparent Pricing",
  "Fast Turnaround Time",
  "Performance Reports",
  "Pan India Campaign Management",
];

export const WHY_INFLUENCER_MARKETING = [
  "Build Trust Faster",
  "Reach Target Audience",
  "Increase Brand Awareness",
  "Generate Quality Leads",
  "Boost Sales",
  "Better ROI than Traditional Advertising",
];

export const PROCESS = [
  { step: "01", title: "Understand Your Brand", copy: "A discovery call to map your category, goals, audience and budget." },
  { step: "02", title: "Campaign Planning", copy: "Strategy, messaging, deliverables and a clear campaign timeline." },
  { step: "03", title: "Influencer Shortlisting", copy: "Creators selected on audience fit, authenticity and past performance." },
  { step: "04", title: "Content Creation", copy: "Briefs, shoots and edits — approved by you before anything goes live." },
  { step: "05", title: "Campaign Execution", copy: "Coordinated publishing across creator and brand handles, pan India." },
  { step: "06", title: "Reporting & Analytics", copy: "Reach, engagement and conversion readouts with next-cycle recommendations." },
];


export const CREATORS = [
  { name: "Aarohi M.", category: "Fashion", city: "Ahmedabad", followers: "412K", er: "6.8%", brands: 24 },
  { name: "Dhruv P.", category: "Tech", city: "Gandhinagar", followers: "228K", er: "5.1%", brands: 17 },
  { name: "Isha S.", category: "Beauty", city: "Surat", followers: "610K", er: "7.4%", brands: 33 },
  { name: "Kabir J.", category: "Food", city: "Ahmedabad", followers: "355K", er: "8.2%", brands: 29 },
  { name: "Riya T.", category: "Travel", city: "Vadodara", followers: "184K", er: "9.0%", brands: 12 },
  { name: "Yash V.", category: "Fitness", city: "Rajkot", followers: "297K", er: "6.1%", brands: 21 },
  { name: "Naina K.", category: "Lifestyle", city: "Gandhinagar", followers: "142K", er: "10.3%", brands: 15 },
  { name: "Arjun D.", category: "Automotive", city: "Ahmedabad", followers: "521K", er: "5.7%", brands: 26 },
];

export const CAMPAIGNS = [
  { brand: "Decathlon", category: "Sports & active living", description: "A sports retailer focused on making sport accessible to everyone." },
  { brand: "Fashion Factory", category: "Value fashion", description: "A Reliance Retail fashion format offering branded fashion at value prices." },
  { brand: "Hyundai", category: "Automotive", description: "A technology-led mobility brand guided by the idea of progress for humanity." },
  { brand: "Lenskart", category: "Eyewear technology", description: "A technology-led eyewear company building accessible eyewear experiences." },
  { brand: "MasterChef", category: "Food & culture", description: "A global food format that discovers and nurtures cooking talent." },
  { brand: "Poojara Telecom", category: "Mobile retail", description: "A Gujarat-based mobile and electronics retailer serving everyday tech needs." },
  { brand: "TVS Motor Company", category: "Sustainable mobility", description: "A two- and three-wheeler manufacturer championing sustainable mobility." },
  { brand: "V-Mart", category: "Value fashion retail", description: "A family fashion retailer serving value-conscious communities across India." },
  { brand: "vivo", category: "Consumer technology", description: "A technology company creating design-driven smart devices and intelligent services." },
];

export const TESTIMONIALS = [
  { quote: "The reels outperformed our paid social by 4x on CPM. First agency that treated our brand like a product, not a post.", name: "Head of Growth", org: "Auré Skin" },
  { quote: "Shoot day felt like a film set. The output looked like a national campaign on a regional budget.", name: "Founder", org: "Kaya Label" },
  { quote: "As a creator, I finally get briefs that make sense and payments that land on time.", name: "Isha S.", org: "Beauty Creator, 610K" },
  { quote: "They matched us with nine creators who actually drive our category. Sold out in eleven days.", name: "Marketing Lead", org: "Nira Motors" },
  { quote: "Dreamweave's analytics readout changed how we plan every quarter.", name: "CMO", org: "Volt Sneakers" },
  { quote: "Best production team in Gujarat, hands down. Drone, studio, edit — all in-house.", name: "Kabir J.", org: "Food Creator, 355K" },
];

export const FAQS = [
  {
    q: "Which cities do you operate in?",
    a: "Our studio and head office are in Gandhinagar, and we shoot regularly across Ahmedabad, Surat, Vadodara and Rajkot. We run creator campaigns pan-India remotely.",
  },
  {
    q: "What does an influencer marketing campaign cost?",
    a: "Most brand campaigns start around ₹1.5L for a focused creator burst and scale to ₹15L+ for multi-city productions with 20+ creators. Budget is set by creator tier, deliverable volume and production scope.",
  },
  {
    q: "Do you handle content shoots as well as creator seeding?",
    a: "Yes. We are a full-stack creator marketing agency — discovery, contracting, shoot production, editing, publishing and reporting all sit with one team.",
  },
  {
    q: "How do you pick creators for a brand?",
    a: "We screen for audience overlap, authenticity, watch-time and past brand performance in your category — not follower count alone. Every shortlist ships with the data behind it.",
  },
  {
    q: "How quickly can a campaign go live?",
    a: "A standard reel campaign moves from brief to first publish in 10–14 days. Rush timelines are possible with our in-house production crew.",
  },
  {
    q: "How do creators get paid?",
    a: "Creators are paid within 15 days of approved deliverables, directly to their bank account, with a signed scope before the shoot.",
  },
];

export const POSTS = [
  {
    slug: "influencer-marketing-gujarat-guide",
    title: "Influencer Marketing in Gujarat: The 2026 Brand Playbook",
    category: "Marketing",
    excerpt: "How regional creators in Ahmedabad, Surat and Gandhinagar are out-converting national campaigns — and how to brief them.",
    date: "2026-07-18",
    read: "9 min",
  },
  {
    slug: "reel-hooks-that-retain",
    title: "12 Reel Hooks That Hold Attention Past Three Seconds",
    category: "Reels",
    excerpt: "The opening frame decides the campaign. Here are the hook structures our editors reuse across categories.",
    date: "2026-06-30",
    read: "7 min",
  },
  {
    slug: "content-shoot-checklist-ahmedabad",
    title: "The Content Shoot Checklist We Use on Every Ahmedabad Set",
    category: "Photography",
    excerpt: "Pre-production, lighting, sound and backup workflow from a team that shoots 500+ campaigns.",
    date: "2026-06-11",
    read: "6 min",
  },
  {
    slug: "instagram-growth-creators-india",
    title: "Instagram Growth for Indian Creators Who Want Paid Brand Deals",
    category: "Creator Tips",
    excerpt: "Positioning, media kits and rate cards — what brands actually look for before they pay.",
    date: "2026-05-27",
    read: "8 min",
  },
  {
    slug: "brand-collaborations-that-scale",
    title: "Why Most Brand Collaborations Die After One Post",
    category: "Branding",
    excerpt: "Single-post deals rarely compound. Structure creator relationships like media, not like favours.",
    date: "2026-05-09",
    read: "5 min",
  },
  {
    slug: "instagram-growth-gujarat-brands",
    title: "Instagram Marketing in Gujarat: Local Signals That Move Reach",
    category: "Instagram Growth",
    excerpt: "Language mix, festive calendars and city-level targeting that regional brands consistently underuse.",
    date: "2026-04-22",
    read: "6 min",
  },
];

export const CASE_STUDIES = [
  {
    slug: "aure-skin",
    brand: "Auré Skin",
    title: "6.1M views and a 41% cut in CPM for a D2C skincare launch",
    industry: "Beauty / D2C",
    before: { reach: "310K", cpm: "₹184", roas: "1.4x" },
    after: { reach: "6.1M", cpm: "₹109", roas: "4.6x" },
    creators: 26,
    duration: "9 weeks",
    summary:
      "A tiered creator mix — 4 macro, 22 micro — paired with an in-studio product shoot gave the brand 60+ owned assets alongside creator reach.",
  },
  {
    slug: "nira-motors",
    brand: "Nira Motors",
    title: "A regional EV launch that sold out its first allocation in 11 days",
    industry: "Automotive",
    before: { reach: "88K", cpm: "₹240", roas: "0.9x" },
    after: { reach: "3.4M", cpm: "₹126", roas: "3.8x" },
    creators: 9,
    duration: "6 weeks",
    summary:
      "Nine automotive and lifestyle creators across Gujarat, one drone-led hero film, and a showroom test-ride funnel measured to booking.",
  },
  {
    slug: "volt-sneakers",
    brand: "Volt Sneakers",
    title: "5.3M campus-native views built entirely from creator UGC",
    industry: "Footwear",
    before: { reach: "420K", cpm: "₹160", roas: "1.8x" },
    after: { reach: "5.3M", cpm: "₹94", roas: "5.2x" },
    creators: 22,
    duration: "7 weeks",
    summary:
      "A campus-first seeding wave with weekly hook testing; the top three hooks were re-cut into paid reels ads.",
  },
];

export const PORTFOLIO = [
  {
    brand: "Decathlon",
    category: "Sports & active living",
    description: "A sports retailer focused on making sport accessible to everyone.",
    tall: true,
  },
  {
    brand: "Fashion Factory",
    category: "Value fashion",
    description: "A Reliance Retail fashion format offering branded fashion at value prices.",
  },
  {
    brand: "Hyundai",
    category: "Automotive",
    description: "A technology-led mobility brand guided by the idea of progress for humanity.",
  },
  {
    brand: "Lenskart",
    category: "Eyewear technology",
    description: "A technology-led eyewear company building accessible eyewear experiences.",
    tall: true,
  },
  {
    brand: "MasterChef",
    category: "Food & culture",
    description: "A global food format that discovers and nurtures cooking talent.",
  },
  {
    brand: "Poojara Telecom",
    category: "Mobile retail",
    description: "A Gujarat-based mobile and electronics retailer serving everyday tech needs.",
  },
  {
    brand: "TVS Motor Company",
    category: "Sustainable mobility",
    description: "A two- and three-wheeler manufacturer championing sustainable mobility.",
    tall: true,
  },
  {
    brand: "V-Mart",
    category: "Value fashion retail",
    description: "A family fashion retailer serving value-conscious communities across India.",
  },
  {
    brand: "vivo",
    category: "Consumer technology",
    description: "A technology company creating design-driven smart devices and intelligent services.",
  },
];
