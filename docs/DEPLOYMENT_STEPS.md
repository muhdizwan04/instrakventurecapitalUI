# Deployment Steps for Chatbot Features

## Step 1: Run Database Migration ⚠️ REQUIRED FIRST

The chatbot conversation memory requires new database tables. Run this migration:

### Option A: Via Supabase Dashboard (Easiest)
1. Go to: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql/new
2. Open: `supabase/migrations/20260217_chatbot_conversations.sql`
3. Copy ALL the SQL code
4. Paste into SQL Editor
5. Click "Run"

### Option B: Via Supabase CLI
```bash
# Login first
supabase login

# Link to your project (you'll need your project ref)
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push
```

---

## Step 2: Deploy Edge Function

### Login to Supabase:
```bash
supabase login
```

### Link to your project:
```bash
# Get your project ref from: https://supabase.com/dashboard/project/[PROJECT_ID]/settings/general
supabase link --project-ref YOUR_PROJECT_REF
```

### Set Environment Variables:
```bash
# Set OpenAI API key (required)
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here

# These are usually auto-set, but verify:
supabase secrets list
```

### Deploy the function:
```bash
supabase functions deploy chat-assistant
```

---

## Step 3: Verify Deployment

### Test the function:
```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/chat-assistant \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}], "sessionId": "test-123"}'
```

---

## Quick Checklist

- [ ] Database migration run (`20260217_chatbot_conversations.sql`)
- [ ] Supabase CLI installed ✅
- [ ] Logged in: `supabase login`
- [ ] Project linked: `supabase link --project-ref XXX`
- [ ] Environment variables set: `supabase secrets set OPENAI_API_KEY=XXX`
- [ ] Function deployed: `supabase functions deploy chat-assistant`
- [ ] Tested the function
- [ ] Frontend tested (conversation memory & intent detection)

---

## Troubleshooting

### "Project not linked"
- Run: `supabase link --project-ref YOUR_PROJECT_REF`
- Find project ref in: Dashboard → Settings → General → Reference ID

### "Function not found"
- Make sure you're in the project root directory
- Check: `supabase/functions/chat-assistant/index.ts` exists

### "Environment variable not set"
- Set it: `supabase secrets set OPENAI_API_KEY=your_key`
- Or set in Dashboard: Settings → Edge Functions → Environment Variables

### Database errors
- Make sure migration ran successfully
- Check tables exist: `chat_conversations` and `chat_analytics`
