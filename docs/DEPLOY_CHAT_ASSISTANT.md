# Deploy Chat Assistant Edge Function

## Option 1: Deploy via Supabase Dashboard (Easiest) ✅

### Steps:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Edge Functions**
   - In the left sidebar, click **"Edge Functions"**
   - Or go to: `https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/functions`

3. **Create/Update the Function**
   - If `chat-assistant` doesn't exist, click **"Create a new function"**
   - Function name: `chat-assistant`
   - If it exists, click on it to edit

4. **Copy the Code**
   - Open `supabase/functions/chat-assistant/index.ts` in your editor
   - Copy ALL the contents
   - Paste into the Supabase Dashboard editor

5. **Set Environment Variables**
   - In the function settings, add:
     - `OPENAI_API_KEY` = Your OpenAI API key
     - `SUPABASE_URL` = Your Supabase project URL (usually auto-set)
     - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key (from Settings → API)

6. **Deploy**
   - Click **"Deploy"** button
   - Wait for deployment to complete

7. **Test**
   - Use the test panel in the dashboard
   - Or test from your frontend

---

## Option 2: Install Supabase CLI (For Future Use)

### Install Supabase CLI:

**macOS (using Homebrew):**
```bash
brew install supabase/tap/supabase
```

**Or using npm:**
```bash
npm install -g supabase
```

**Or download binary:**
- Visit: https://github.com/supabase/cli/releases
- Download for macOS
- Add to PATH

### Login:
```bash
supabase login
```

### Link to your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Deploy:
```bash
supabase functions deploy chat-assistant
```

---

## Option 3: Manual Upload via Dashboard

1. **Zip the function folder**
   ```bash
   cd supabase/functions/chat-assistant
   zip -r chat-assistant.zip .
   ```

2. **Upload in Dashboard**
   - Go to Edge Functions
   - Click "Upload" or "Import"
   - Select the zip file
   - Set environment variables
   - Deploy

---

## Verify Deployment

### Test the function:
```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/chat-assistant \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

### Or test from browser console:
```javascript
fetch('https://YOUR_PROJECT_REF.supabase.co/functions/v1/chat-assistant', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY',
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

### Function not found?
- Make sure the function name is exactly `chat-assistant`
- Check it's deployed in the correct project

### Environment variables not working?
- Go to: Settings → Edge Functions → Environment Variables
- Add: `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Redeploy the function

### CORS errors?
- Check `ALLOWED_ORIGINS` in the function code
- Add your domain if needed

### Database errors?
- Make sure you've run the migration: `supabase/migrations/20260217_chatbot_conversations.sql`
- Check RLS policies are correct

---

## Quick Checklist

- [ ] Database migration run (`20260217_chatbot_conversations.sql`)
- [ ] Function code copied to Supabase Dashboard
- [ ] Environment variables set (`OPENAI_API_KEY`, etc.)
- [ ] Function deployed
- [ ] Tested with a simple message
- [ ] Frontend updated (already done ✅)

---

**Recommended**: Use Option 1 (Dashboard) for quick deployment, then install CLI for future updates.
