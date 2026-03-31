# Deploy Chatbot Edge Function - Quick Guide

## Your Project Info
- **Project URL:** `https://osxqnhwlxhspczudglyl.supabase.co`
- **Project Ref:** `osxqnhwlxhspczudglyl`

---

## ✅ Step 1: Database Migration (You Already Did This!)
Great! The tables are created.

---

## 🚀 Step 2: Deploy Edge Function

### **EASIEST WAY: Use Supabase Dashboard** (Recommended)

#### 1. Go to Edge Functions
- Open: https://supabase.com/dashboard/project/osxqnhwlxhspczudglyl/functions
- Or: Dashboard → Your Project → **Edge Functions** (left sidebar)

#### 2. Create the Function
- Click **"Create a new function"** or **"New Function"**
- Name: `chat-assistant` (exactly this)
- Click **"Create"**

#### 3. Copy Your Code
- Open file: `supabase/functions/chat-assistant/index.ts`
- Select ALL (Cmd+A)
- Copy (Cmd+C)
- Paste into Supabase editor (Cmd+V)

#### 4. Set Environment Variables
Click **"Settings"** tab (top of editor) and add:

**Variable 1:**
- Name: `OPENAI_API_KEY`
- Value: Your OpenAI API key (get from https://platform.openai.com/api-keys)

**Variable 2:**
- Name: `SUPABASE_URL`
- Value: `https://osxqnhwlxhspczudglyl.supabase.co`

**Variable 3:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zeHFuaHdseGhzcGN6dWRnbHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk1MDg4NywiZXhwIjoyMDgzNTI2ODg3fQ.ev-GRRnxBjNUqbuQqAHvc0pBCtCx2evxnvhIPYgbaW4`
- ⚠️ This is your service role key from `.env` - keep it secret!

#### 5. Deploy
- Click **"Deploy"** button (top right)
- Wait for "Deployed successfully" ✅

---

### **ALTERNATIVE: Use Command Line**

```bash
# 1. Login
supabase login

# 2. Link your project
supabase link --project-ref osxqnhwlxhspczudglyl

# 3. Set OpenAI key (you need to get this from OpenAI)
supabase secrets set OPENAI_API_KEY=sk-your-key-here

# 4. Deploy
supabase functions deploy chat-assistant
```

---

## 🧪 Step 3: Test It

### Test in Dashboard:
1. Go to Edge Functions → `chat-assistant`
2. Click **"Test"** or **"Invoke"**
3. Use this test:
```json
{
  "messages": [{"role": "user", "content": "Hello"}],
  "sessionId": "test-123"
}
```
4. Click **"Run"**
5. Should see chatbot response! ✅

### Test from Your Website:
Open browser console on your site and run:
```javascript
fetch('https://osxqnhwlxhspczudglyl.supabase.co/functions/v1/chat-assistant', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zeHFuaHdseGhzcGN6dWRnbHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTA4ODcsImV4cCI6MjA4MzUyNjg4N30.PE-eIJ1kJbi6wn3ivDHxkL8kaw9X0Ol3OZZT2LaU8Gg',
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

## ❓ Common Issues

### "Function not found"
- Make sure name is exactly `chat-assistant`
- Check you're in the right project

### "OpenAI API error"
- Get API key from: https://platform.openai.com/api-keys
- Make sure you have credits in OpenAI account
- Add key in Edge Function Settings

### "Table not found"
- You already ran migration ✅
- Check tables exist: Database → Tables → `chat_conversations`

---

## ✅ Checklist

- [x] Database migration run ✅
- [ ] Edge Function created in Dashboard
- [ ] Code copied from `index.ts`
- [ ] Environment variables set (OPENAI_API_KEY, etc.)
- [ ] Function deployed
- [ ] Tested successfully

---

**Need help?** The Dashboard method is easiest - just copy/paste the code and set the environment variables!
