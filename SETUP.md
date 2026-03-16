# Scorpio Zodiac — Setup (5 minutes)

## Step 1 — Install dependencies
Open this folder in VS Code, open Terminal, run:
```
npm install
```

## Step 2 — Create .env file
In the project root, create a file called `.env` (not .env.example — a new file called exactly `.env`)
Paste this and fill in your values:

```
SUPABASE_URL=https://aayazvvolxdyyvzbrsnf.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
JWT_SECRET=scorpiozodiac2026secret
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3000
```

Where to find SUPABASE_SERVICE_KEY:
→ supabase.com → your project → Settings → API → service_role (click Reveal)

## Step 3 — Run the SQL in Supabase
→ supabase.com → your project → SQL Editor → New Query
→ Paste the entire contents of schema.sql
→ Click Run
→ You should see "Success. No rows returned"

## Step 4 — Start the server
```
npm run dev
```

You should see:
  ♏  Scorpio Zodiac → http://localhost:3000

## Step 5 — Verify everything works
Open: http://localhost:3000/api/debug
All 4 items should show ✓

## Step 6 — Try signing up
Go to http://localhost:3000
Click "Join Free" → fill in your details → click "Begin My Journey"
You should be logged in with your name showing in the top right.

## Step 7 — Generate first horoscope
You need to be logged in first (Step 6).
Then open a new terminal tab and run:

On Mac/Linux:
```
curl -X POST http://localhost:3000/api/horoscope/generate \
  -H "Content-Type: application/json" \
  --cookie "sz_token=YOUR_TOKEN"
```

On Windows PowerShell:
```
Invoke-WebRequest -Uri "http://localhost:3000/api/horoscope/generate" -Method POST -ContentType "application/json" -Headers @{Cookie="sz_token=YOUR_TOKEN"}
```

To get YOUR_TOKEN: open browser dev tools (F12) → Application → Cookies → sz_token → copy the value

OR: just go to Supabase → Table Editor → horoscopes → Insert row manually with status='published'

---

## Daily workflow after setup
The site is running. To get a new horoscope each day:
1. Be logged in on the site
2. Run the generate command above
3. Horoscope appears on the homepage immediately

Or add content directly in Supabase → Table Editor → horoscopes

## Blog posts
Add posts in Supabase → Table Editor → posts
Set status to 'published' and fill in slug, title, excerpt, content (HTML)
