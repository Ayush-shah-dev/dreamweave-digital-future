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
  { value: 10000, suffix: "+", label: "Verified Creators" },
  { value: 500, suffix: "+", label: "Campaign Shoots" },
  { value: 20, suffix: "M+", label: "Views Generated" },
  { value: 50, suffix: "+", label: "Brands" },
];

export const SERVICES = [
  {
    slug: "influencer-discovery",
    title: "Influencer Discovery",
    blurb:
      "Data-backed creator matchmaking across Gujarat and India — vetted for audience quality, not vanity follower counts.",
    deliverables: [
      "Audience authenticity audit",
      "Category & city shortlists",
      "Rate negotiation",
      "Contracting & compliance",
    ],
  },
  {
    slug: "campaign-management",
    title: "Campaign Management",
    blurb:
      "End-to-end orchestration: briefs, timelines, approvals, posting calendars and creator communication handled by one team.",
    deliverables: ["Creative brief", "Production calendar", "Approval workflow", "Live campaign war-room"],
  },
  {
    slug: "content-shoots",
    title: "Content Shoots",
    blurb:
      "Cinema-grade production in Ahmedabad and Gandhinagar — studio, on-location, drone, product tabletop and lifestyle.",
    deliverables: ["Pre-production & storyboard", "Crew, lights, gimbal, drone", "Studio or location", "Raw + graded masters"],
  },
  {
    slug: "editing",
    title: "Editing & Post",
    blurb:
      "Retention-engineered reel edits with hook-first pacing, sound design, colour grade and platform-native formats.",
    deliverables: ["Hook variants", "Colour grading", "Sound design & mix", "9:16, 1:1 and 16:9 masters"],
  },
  {
    slug: "social-strategy",
    title: "Social Strategy",
    blurb:
      "Positioning, content pillars and a publishing rhythm that compounds — built around what your category actually rewards.",
    deliverables: ["Category & competitor teardown", "Content pillars", "90-day calendar", "Creator-led funnel design"],
  },
  {
    slug: "analytics",
    title: "Analytics & Reporting",
    blurb:
      "Reach, watch-time, saves, CPM, CPV and attributed conversions in one live dashboard — with next-cycle recommendations.",
    deliverables: ["Live dashboard", "Creator-level performance", "Cost efficiency benchmarks", "Scale recommendations"],
  },
  {
    slug: "ugc-content-creation",
    title: "UGC Content Creation",
    blurb: "Authentic creator-generated content for paid ads, websites, Amazon listings, and social media.",
    deliverables: ["Creator-led concepts", "Paid ad variations", "Amazon-ready assets", "Social media formats"],
  },
  {
    slug: "celebrity-macro-influencer-campaigns",
    title: "Celebrity & Macro Influencer Campaigns",
    blurb: "Partner with top creators and celebrities for maximum brand visibility.",
    deliverables: ["Talent shortlisting", "Celebrity outreach", "Campaign negotiations", "Multi-channel launch planning"],
  },
  {
    slug: "social-media-management",
    title: "Social Media Management",
    blurb: "Content planning, creative design, reels, growth strategy, and community management.",
    deliverables: ["Monthly content calendar", "Creative design system", "Reels production", "Community management"],
  },
  {
    slug: "product-photoshoot-video-production",
    title: "Product Photoshoot & Video Production",
    blurb: "Professional product shoots, lifestyle videos, commercial reels, and brand films.",
    deliverables: ["Product photography", "Lifestyle videos", "Commercial reels", "Brand films"],
  },
  {
    slug: "talent-management",
    title: "Talent Management",
    blurb: "Helping creators grow while connecting them with premium brand collaborations.",
    deliverables: ["Creator positioning", "Brand deal sourcing", "Rate negotiation", "Long-term partnership planning"],
  },
];

export const PROCESS = [
  { step: "01", title: "Brand Inquiry", copy: "A 20-minute call to map goals, category, budget and timeline." },
  { step: "02", title: "Strategy", copy: "Positioning, hooks, content pillars and channel plan." },
  { step: "03", title: "Creator Matching", copy: "Shortlists vetted for audience overlap and engagement quality." },
  { step: "04", title: "Shoot", copy: "Studio, location, drone and product production with our in-house crew." },
  { step: "05", title: "Editing", copy: "Retention-first edits, hook variants, grade and sound design." },
  { step: "06", title: "Publishing", copy: "Coordinated go-live across creator and brand handles." },
  { step: "07", title: "Analytics", copy: "Performance readout, learnings and the next scale plan." },
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
    q: "How long does a campaign take?",
    a: "Most campaigns are executed within 7–15 days.",
  },
  {
    q: "Do you provide influencers across India?",
    a: "Yes, we work with creators from all major cities and niches across India.",
  },
  {
    q: "Can you manage everything?",
    a: "Yes. Strategy, influencer sourcing, negotiations, content approvals, publishing, and reporting.",
  },
  {
    q: "What is the minimum campaign budget?",
    a: "Campaigns can be customized based on your marketing goals and budget.",
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
