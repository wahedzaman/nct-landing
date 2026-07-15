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
  * **Add/Edit Article Form:** Standard settings inputs (Category, Read Time, Image URLs, Author Name/Role/Avatar, comma-separated Tags) and publication status selector (draft, published, or scheduled).
  * **Scheduled Date Selector:** Active when "scheduled" is selected, taking local datetime inputs that are parsed to UTC ISO strings.
  * **Custom Rich Text Editor:** A custom Markdown editor utilizing a toolbar interface (Bold, Italic, Headers, Quote Blocks, Lists, Links) for rapid text entry and paragraph splitting. Includes a "Live Preview" tab mirroring the dynamic layout styles of detail pages.

### Navigation & Routing Integration
* **[App.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/App.tsx):** Added `'cms-panel'` route state. Integrated a `useEffect` pathname listener so typing `website/cms-panel` directly in the browser loads the CMS page, and updated `handleNavigate` to update history paths correctly.
* **[Navbar.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/components/Navbar.tsx):** Standardized prop types to align with `'cms-panel'` routing.
* **[Footer.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/components/Footer.tsx):** Aligned navigation types and added a public "CMS Panel" link to the footer's bottom row.

### Front-end Dynamic Data Binding
* **[NewsSection.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/components/NewsSection.tsx):** Fetches the latest 3 active articles from Supabase (or falls back to mock constants). Filter engine screens out draft and future-scheduled articles in real-time.
* **[News.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/pages/News.tsx):** Refactored to bind grid list items, search, and category pills directly to Supabase query datasets (or fallback items).
* **[NewsDetails.tsx](file:///Volumes/HomeX/wahed/Documents/Workspace/Web/nct/src/pages/NewsDetails.tsx):** Dynamically fetches details for a given `newsId` from the database. Added dynamic query recommendations that pull up to 2 related articles of different IDs.

---

## 3. Verification & Validation

* **Type Safety Check (`npm run lint` / `tsc --noEmit`):**
  * **Status:** Passed successfully.
  * **Results:** No TypeScript compiler errors.
* **Vite Production Bundling (`npm run build` / `vite build`):**
  * **Status:** Passed successfully.
  * **Results:** Packaged all dependencies and code blocks into a standard production bundle (`dist/`) in 1.06s without warning flags.
