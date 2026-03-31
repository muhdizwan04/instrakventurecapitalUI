# How to Deploy Edge Function - Simple Step-by-Step Guide

## What is an Edge Function?
An Edge Function is code that runs on Supabase's servers. Your chatbot code (`chat-assistant`) needs to be uploaded to Supabase so it can respond to chat messages.

---

## Method 1: Using Supabase Dashboard (EASIEST - No CLI needed) ✅

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Sign in
3. Click on your project

### Step 2: Go to Edge Functions
1. In the left sidebar, look for **"Edge Functions"**
2. Click on it
3. You should see a list of functions (might be empty if this is your first)

### Step 3: Create or Edit the Function
**If `chat-assistant` doesn't exist:**
1. Click **"Create a new function"** or **"New Function"**
2. Name it: `chat-assistant` (exactly this name)
3. Click **"Create"**

**If `chat-assistant` already exists:**
1. Click on `chat-assistant` to open it

### Step 4: Copy the Code
1. Open this file in your code editor: `supabase/functions/chat-assistant/index.ts`
2. Select ALL the code (Cmd+A / Ctrl+A)
3. Copy it (Cmd+C / Ctrl+C)
4. Go back to Supabase Dashboard
5. Paste the code into the editor (Cmd+V / Ctrl+V)

### Step 5: Set Environment Variables
1. Look for **"Settings"** or **"Environment Variables"** tab (usually at the top)
2. Click on it
3. Add these variables:

   **Variable Name:** `OPENAI_API_KEY`  
   **Value:** Your OpenAI API key (get it from https://platform.openai.com/api-keys)

   **Variable Name:** `SUPABASE_URL`  
   **Value:** Your Supabase project URL (found in Settings → API → Project URL)

   **Variable Name:** `SUPABASE_SERVICE_ROLE_KEY`  
   **Value:** Your service role key (found in Settings → API → service_role key - be careful, this is secret!)

### Step 6: Deploy
1. Click the **"Deploy"** button (usually at the top right)
2. Wait for it to finish (you'll see "Deployed successfully")
3. Done! ✅

---

## Method 2: Using Supabase CLI (If you prefer command line)

### Step 1: Login
```bash
supabase login
```
- This will open your browser to sign in
- After signing in, come back to terminal

### Step 2: Link Your Project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

**How to find YOUR_PROJECT_REF:**
1. Go to Supabase Dashboard
2. Click **Settings** (gear icon)
3. Click **General**
4. Look for **"Reference ID"** - that's your project ref
5. Copy it and paste in the command above

**Example:**
```bash
supabase link --project-ref abcdefghijklmnop
```

### Step 3: Set Environment Variables
```bash
# Set OpenAI API key
supabase secrets set OPENAI_API_KEY=sk-your-openai-key-here
```

**Note:** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are usually auto-set, but you can verify:
```bash
supabase secrets list
```

### Step 4: Deploy
```bash
supabase functions deploy chat-assistant
```

You should see:
```
Deploying function chat-assistant...
Function chat-assistant deployed successfully!
```

---

## Verify It Works

### Test in Dashboard:
1. Go to Edge Functions → `chat-assistant`
2. Look for a **"Test"** or **"Invoke"** button
3. Use this test payload:
```json
{
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "sessionId": "test-123"
}
```
4. Click "Run" or "Invoke"
5. You should see a response from the chatbot

### Test from Browser Console:
Open your website and run this in browser console:
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL'; // From .env file
const anonKey = 'YOUR_ANON_KEY'; // From .env file

fetch(`${supabaseUrl}/functions/v1/chat-assistant`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${anonKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello' }],
    sessionId: 'test-123'
  })
})
.then(r => r.text())
.then(console.log);
```

---

## Troubleshooting

### ❌ "Function not found"
- Make sure the function name is exactly `chat-assistant`
- Check you're in the correct project

### ❌ "Environment variable not set"
- Go to Dashboard → Edge Functions → Settings
- Add `OPENAI_API_KEY` with your OpenAI key
- Redeploy the function

### ❌ "Database error" or "Table not found"
- Make sure you ran the migration first ✅ (you said you did this)
- Check tables exist: Go to Database → Tables → look for `chat_conversations` and `chat_analytics`

### ❌ "CORS error"
- Check `ALLOWED_ORIGINS` in the function code includes your domain
- Add your domain if needed

### ❌ "OpenAI API error"
- Check your OpenAI API key is correct
- Make sure you have credits in your OpenAI account
- Check API key has proper permissions

---

## Quick Checklist

- [x] Database migration run ✅
- [ ] Edge Function code copied to Supabase Dashboard
- [ ] Environment variables set (`OPENAI_API_KEY`, etc.)
- [ ] Function deployed
- [ ] Tested successfully

---

## Need Help?

**If using Dashboard:**
- Make sure you're logged in
- Check you're in the correct project
- The function editor should look like a code editor

**If using CLI:**
- Make sure `supabase login` worked
- Make sure `supabase link` worked (shows your project name)
- Check you're in the project root directory

**Still stuck?** Share:
1. Which method you're using (Dashboard or CLI)
2. What error message you see
3. Screenshot if possible
