# Walkthrough - Supabase CMS and Dynamic News Integration

This document summarizes the changes made to add a Supabase-backed CMS Panel to the NCT web application, integrate authentication, allow scheduled posting, support rich text formatting, and dynamically load posts.

---

## 1. Supabase Database Configuration

To set up the backend database, run the following SQL commands in your **Supabase Dashboard SQL Editor**:

```sql
-- 1. Create the news table
create table public.news (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date text not null,
  category text not null,
  title text not null,
  excerpt text not null,
  image text not null,
  read_time text not null,
  author_name text not null,
  author_role text not null,
  author_avatar text not null,
  content text[] not null, -- Array of paragraphs
  tags text[] default '{}'::text[] not null,
  status text default 'published'::text check (status in ('draft', 'published', 'scheduled')) not null,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.news enable row level security;

-- 3. Policy: Public can read published items (or scheduled items whose publish date is past)
create policy "Allow public read access for published news"
  on public.news for select
  using (status = 'published' or (status = 'scheduled' and published_at <= now()));

-- 4. Policy: Authenticated managers have full CRUD rights
create policy "Allow authenticated users full access"
  on public.news for all
  to authenticated
  using (true)
  with check (true);

-- 5. Create the hero_slides table
create table public.hero_slides (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  image text not null, -- Base64 string representing compressed image
  title text not null,
  description text not null,
  type text not null
);

-- 6. Enable Row Level Security (RLS) on hero_slides
alter table public.hero_slides enable row level security;

-- 7. Policy: Public read access to hero slides
create policy "Allow public read access for hero slides"
  on public.hero_slides for select
  using (true);

-- 8. Policy: Authenticated editor access to hero slides
create policy "Allow authenticated users full access for hero slides"
  on public.hero_slides for all
  to authenticated
  using (true)
  with check (true);

-- 9. Create the branches table
create table public.branches (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  address text not null,
  phone text not null,
  email text not null,
  hours text not null
);

-- 10. Enable Row Level Security (RLS) on branches
alter table public.branches enable row level security;

-- 11. Policy: Public read access to branches
create policy "Allow public read access for branches"
  on public.branches for select
  using (true);

-- 12. Policy: Authenticated editor access to branches
create policy "Allow authenticated users full access for branches"
  on public.branches for all
  to authenticated
  using (true)
  with check (true);

-- 13. Create the contact_messages table
create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  company text,
  email text,
  phone text,
  inquiry_type text not null,
  message text not null
);

-- 14. Enable Row Level Security (RLS) on contact_messages
alter table public.contact_messages enable row level security;

-- 15. Policy: Public can insert messages
create policy "Allow public inserts for contact messages"
  on public.contact_messages for insert
  with check (true);

-- 16. Policy: Authenticated editor access to messages
create policy "Allow authenticated users full access for contact messages"
  on public.contact_messages for all
  to authenticated
  using (true)
  with check (true);

-- 17. Create the settings table
create table public.settings (
  key text primary key,
  value text not null
);

-- 18. Enable Row Level Security (RLS) on settings
alter table public.settings enable row level security;

-- 19. Policy: Public read access to settings
create policy "Allow public read access for settings"
  on public.settings for select
  using (true);

-- 20. Policy: Authenticated editor access to settings
create policy "Allow authenticated users full access for settings"
  on public.settings for all
  to authenticated
  using (true)
  with check (true);

-- 21. Seed settings
insert into public.settings (key, value) values
  ('captcha_enabled', 'false'),
  ('captcha_key', 'NCT-SAFE'),
  ('about_title1_en', 'A Quarter-Century of'),
  ('about_title1_bn', 'একটি সিকি শতাব্দী ধরে'),
  ('about_title2_en', 'Industrial Excellence'),
  ('about_title2_bn', 'শিল্পগত শ্রেষ্ঠত্ব'),
  ('about_desc_en', 'Founded at the turn of the century as a specialized manufacturing outfit, NCT (National Carbide Technology) has evolved from local roots into a leading industrial accessory provider. We set out to solve a singular problem: standard drills and blades were wearing out too quickly under continuous load, causing project delays and cost overruns.\n\nBy investing heavily in metallurgical research and precision engineering, we formulated specialized carbide matrices and diamond-coated elements that lasted up to four times longer than competitors. Today, our catalog spans hundreds of custom drilling, cutting, fastening, and grinding solutions trusted across construction, aerospace, and energy sectors.\n\nWhether distributing globally recognized tool catalogs or fabricating tailor-made components for multi-million-dollar infrastructure schemes, we adhere to the same unyielding standards of precision, durability, and safety.'),
  ('about_desc_bn', 'শতাব্দীর শুরুতে একটি বিশেষ উৎপাদনকারী প্রতিষ্ঠান হিসেবে প্রতিষ্ঠিত, NCT (ন্যাশনাল কার্বাইড টেকনোলজি) স্থানীয় ভিত্তি থেকে একটি শীর্ষস্থানীয় শিল্প আনুষঙ্গিক সরবরাহকারী হিসেবে বিকশিত হয়েছে। আমরা একটি একক সমস্যা সমাধানের উদ্দেশ্যে যাত্রা শুরু করেছিলাম: সাধারণ ড্রিল এবং ব্লেডগুলি ক্রমাগত লোডের অধীনে খুব দ্রুত ক্ষয় হয়ে যাচ্ছিল, যার ফলে প্রকল্পের বিলম্ব এবং অতিরিক্ত খরচ হতো।\n\nধাতব গবেষণা এবং সূক্ষ্ম প্রকৌশলে বিপুল বিনিয়োগের মাধ্যমে, আমরা বিশেষ কার্বাইড ম্যাট্রিক্স এবং ডায়মন্ড-কোটেড উপাদান তৈরি করেছি যা প্রতিযোগী ব্র্যান্ডগুলোর চেয়ে চার গুণ বেশি সময় ধরে কাজ করে। আজ, আমাদের ক্যাটালগটিতে নির্মাণ, মহাকাশ এবং শক্তি খাতে বিশ্বস্ত শত শত কাস্টম ড্রিলিং, কাটিং, ফাস্টেনিং এবং গ্রাইন্ডিং সমাধান রয়েছে।\n\nবিশ্বব্যাপী স্বীকৃত টুলের ক্যাটালগ বিতরণ করা হোক বা মাল্টি-মিলিয়ন ডলারের অবকাঠামো স্কিমগুলির জন্য তৈরি পোশাক উপাদান তৈরি করা হোক, আমরা নির্ভুলতা, স্থায়িত্ব এবং সুরক্ষার একই অনড় মান মেনে চলি।')
on conflict (key) do nothing;
```

Once you have set up the database and created an editor account under the **Authentication > Users** tab in Supabase, add the credentials to your local `.env` configuration:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 2. Changes Made

### Configuration & SDK
* **Installed `@supabase/supabase-js`:** Enabled database queries and session management.
* **[supabaseClient.ts](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/supabaseClient.ts) (New):** Configured the Supabase client. Added a fallback flag `isSupabaseConfigured` that detects missing/placeholder credentials, switching the application to read mock data gracefully instead of throwing exceptions.
* **[vite-env.d.ts](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/vite-env.d.ts) (New):** Created standard Vite type environment references to satisfy TypeScript compiler typing checks on `import.meta.env`.

### CMS Administration Page
* **[CmsPanel.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/pages/CmsPanel.tsx) (New Page):**
  * **Auth Login Screen:** Sleek dark-mode form requiring email/password to initialize Supabase user sessions.
  * **Dashboard List:** Lists all articles (drafts, scheduled, and published) with search, category filtering, status badges, view buttons, edits, and deletions.
  * **Add/Edit Article Form:** Standard settings inputs (Category, Read Time, Author Name/Role, comma-separated Tags) and publication status selector (draft, published, or scheduled). Replaced raw Cover URL and Avatar URL inputs with **drag-and-drop file upload zones** that read images, validate file types, dynamically resize/crop them on canvas contexts, compress them below 1 MB, and store them as Base64 strings.
  * **Scheduled Date Selector:** Active when "scheduled" is selected, taking local datetime inputs that are parsed to UTC ISO strings.
  * **Custom Rich Text Editor:** A custom Markdown editor utilizing a toolbar interface (Bold, Italic, Headers, Quote Blocks, Lists, Links, and Inline Images) for rapid text entry and paragraph splitting. Includes a "Live Preview" tab mirroring the dynamic layout styles of detail pages and parsing image nodes.

### Navigation & Routing Integration
* **[App.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/App.tsx):** Added `'cms-panel'` route state. Integrated a `useEffect` pathname listener so typing `website/cms-panel` directly in the browser loads the CMS page, and updated `handleNavigate` to update history paths correctly.
* **[Navbar.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/components/Navbar.tsx):** Standardized prop types to align with `'cms-panel'` routing.
* **[Footer.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/components/Footer.tsx):** Aligned navigation types and added a public "CMS Panel" link to the footer's bottom row.

### Front-end Dynamic Data Binding & Empty Placeholders
* **[NewsSection.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/components/NewsSection.tsx):** Fetches active articles from Supabase. Added a custom placeholder banner (`No news available`) that renders if there are zero articles returned from the database.
* **[News.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/pages/News.tsx):** Refactored to bind search/categories directly to Supabase data. If no matching database articles are available, a styled placeholder card is displayed.
* **[NewsDetails.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/pages/NewsDetails.tsx):** Fetches the active article and matches details. Shows a beautiful `Article Not Found` card if the ID doesn't exist or is archived.

---

## 3. Verification & Validation

* **Type Safety Check (`npm run lint` / `tsc --noEmit`):**
  * **Status:** Passed successfully.
  * **Results:** No TypeScript compiler errors.
* **Vite Production Bundling (`npm run build` / `vite build`):**
  * **Status:** Passed successfully.
  * **Results:** Packaged all dependencies and code blocks into a standard production bundle (`dist/`) in 1.06s without warning flags.
