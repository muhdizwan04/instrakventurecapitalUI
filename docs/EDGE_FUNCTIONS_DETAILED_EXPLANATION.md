# Edge Functions - Detailed Explanation

## 📚 Table of Contents
1. [What Are Edge Functions?](#what-are-edge-functions)
2. [Why Do We Need Them?](#why-do-we-need-them)
3. [How Do They Work?](#how-do-they-work)
4. [Architecture Overview](#architecture-overview)
5. [Step-by-Step Deployment](#step-by-step-deployment)
6. [How Your Chatbot Uses It](#how-your-chatbot-uses-it)
7. [Troubleshooting Deep Dive](#troubleshooting-deep-dive)

---

## What Are Edge Functions?

### Simple Explanation
Think of Edge Functions like a **serverless API endpoint** that runs code on Supabase's servers instead of your own computer or website.

**Analogy:**
- Your website (frontend) = A restaurant
- Edge Function = The kitchen (where food is prepared)
- Your code = The recipe (what happens in the kitchen)

When a customer (user) orders food (sends a chat message), the order goes to the kitchen (Edge Function), the kitchen prepares it (processes with AI), and sends it back to the customer (returns response).

### Technical Explanation
Edge Functions are:
- **Serverless**: No server to manage, Supabase handles it
- **Scalable**: Automatically handles many requests
- **Fast**: Runs close to users (on the "edge" of the network)
- **Secure**: Runs in isolated environment
- **TypeScript/Deno**: Uses modern JavaScript runtime

---

## Why Do We Need Them?

### Problem Without Edge Functions:
```
User's Browser → Your Website → ❌ Can't call OpenAI directly
                                  (API keys would be exposed)
```

**Issues:**
1. **Security**: OpenAI API keys would be visible in browser code (anyone can steal them)
2. **CORS**: OpenAI doesn't allow direct browser calls
3. **Rate Limiting**: Hard to control from frontend
4. **Cost Control**: Can't limit usage properly

### Solution With Edge Functions:
```
User's Browser → Your Website → Edge Function → OpenAI API
                                  (Secure, hidden keys)
                                  ↓
                              Database (Save conversations)
```

**Benefits:**
1. ✅ **Security**: API keys stay on server, never exposed
2. ✅ **Control**: Can add rate limiting, validation
3. ✅ **Database Access**: Can save conversations securely
4. ✅ **Performance**: Runs on fast servers
5. ✅ **Cost**: Can monitor and limit usage

---

## How Do They Work?

### Request Flow:

```
1. User types message in chat widget
   ↓
2. Frontend sends HTTP POST request to Edge Function
   POST https://osxqnhwlxhspczudglyl.supabase.co/functions/v1/chat-assistant
   Body: { messages: [...], sessionId: "abc123" }
   ↓
3. Edge Function receives request
   - Validates input
   - Checks rate limits
   - Loads conversation history from database
   - Detects user intent
   ↓
4. Edge Function calls OpenAI API
   - Sends messages to GPT-4o-mini
   - Gets AI response (streaming)
   ↓
5. Edge Function processes response
   - Streams response back to frontend
   - Saves conversation to database (async)
   - Saves analytics
   ↓
6. Frontend receives response
   - Displays message in chat widget
   - Shows intent-based suggestions
```

### Code Structure:

```typescript
// Edge Function receives HTTP request
Deno.serve(async (req: Request) => {
  // 1. Handle CORS (allow browser requests)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 2. Validate request
  const body = await req.json();
  const { messages, sessionId } = body;

  // 3. Load conversation history
  const history = await loadConversation(sessionId);

  // 4. Detect intent
  const intent = await detectIntent(messages);

  // 5. Call OpenAI
  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`, // Secret key, safe here!
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [...history, ...messages],
      stream: true,
    }),
  });

  // 6. Stream response back
  return new Response(aiResponse.body, {
    headers: { "Content-Type": "text/event-stream" },
  });
});
```

---

## Architecture Overview

### Complete System Architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ChatWidget Component (React)                        │  │
│  │  - Displays chat UI                                  │  │
│  │  - Sends messages to Edge Function                   │  │
│  │  - Receives streaming responses                      │  │
│  │  - Shows intent-based suggestions                    │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP POST Request
                        │ { messages, sessionId }
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTION                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  chat-assistant/index.ts                             │  │
│  │                                                       │  │
│  │  1. Security Layer                                    │  │
│  │     - CORS validation                                 │  │
│  │     - Rate limiting (10 req/min)                     │  │
│  │     - Input sanitization                              │  │
│  │                                                       │  │
│  │  2. Conversation Memory                               │  │
│  │     - Loads history from database                    │  │
│  │     - Merges with new messages                       │  │
│  │                                                       │  │
│  │  3. Intent Detection                                  │  │
│  │     - Calls GPT-3.5-turbo (cheap)                    │  │
│  │     - Classifies: SERVICE_INQUIRY, FUNDING, etc.     │  │
│  │                                                       │  │
│  │  4. AI Response Generation                           │  │
│  │     - Calls GPT-4o-mini                              │  │
│  │     - Streams response back                           │  │
│  │                                                       │  │
│  │  5. Data Persistence                                  │  │
│  │     - Saves conversation to database                 │  │
│  │     - Saves analytics                                │  │
│  └──────────────────────────────────────────────────────┘  │
└───────┬───────────────────────┬─────────────────────────────┘
        │                       │
        │                       │
        ↓                       ↓
┌──────────────┐      ┌──────────────────────┐
│   SUPABASE   │      │    OPENAI API        │
│   DATABASE   │      │                      │
│              │      │  GPT-4o-mini         │
│ chat_        │      │  GPT-3.5-turbo       │
│ conversations│      │  (for intent)        │
│ chat_        │      │                      │
│ analytics    │      │  API Key Required    │
└──────────────┘      └──────────────────────┘
```

### Data Flow Example:

**User sends: "I need funding"**

1. **Frontend** → Sends to Edge Function:
   ```json
   {
     "messages": [{"role": "user", "content": "I need funding"}],
     "sessionId": "chat_1234567890_abc123"
   }
   ```

2. **Edge Function** → Loads history:
   ```sql
   SELECT messages FROM chat_conversations 
   WHERE session_id = 'chat_1234567890_abc123'
   ```

3. **Edge Function** → Detects intent:
   ```json
   {
     "intent": "FUNDING_REQUEST",
     "service": null
   }
   ```

4. **Edge Function** → Calls OpenAI:
   ```json
   {
     "model": "gpt-4o-mini",
     "messages": [
       {"role": "system", "content": "You are IVC assistant..."},
       {"role": "user", "content": "I need funding"}
     ]
   }
   ```

5. **OpenAI** → Streams response:
   ```
   "I can help you explore funding options..."
   ```

6. **Edge Function** → Saves to database:
   ```sql
   INSERT INTO chat_conversations (session_id, messages, intent)
   VALUES ('chat_1234567890_abc123', [...], 'FUNDING_REQUEST')
   ```

7. **Frontend** → Receives and displays:
   - Shows AI response
   - Shows "For Investors" button (based on intent)

---

## Step-by-Step Deployment

### Method 1: Supabase Dashboard (Recommended)

#### Step 1: Access Edge Functions
1. Go to: https://supabase.com/dashboard
2. Sign in
3. Select your project: `osxqnhwlxhspczudglyl`
4. In left sidebar, click **"Edge Functions"**
5. URL should be: `https://supabase.com/dashboard/project/osxqnhwlxhspczudglyl/functions`

**What you'll see:**
- List of functions (might be empty)
- "Create a new function" button

#### Step 2: Create Function
1. Click **"Create a new function"** or **"New Function"**
2. **Function name:** `chat-assistant`
   - ⚠️ Must be exactly this name (no spaces, lowercase)
   - This is the URL path: `/functions/v1/chat-assistant`
3. Click **"Create"**

**What happens:**
- Creates a new function
- Opens code editor
- Shows default "Hello World" code

#### Step 3: Copy Your Code
1. **Open your code file:**
   - File path: `supabase/functions/chat-assistant/index.ts`
   - Open in VS Code or any editor

2. **Select all code:**
   - Press `Cmd+A` (Mac) or `Ctrl+A` (Windows)
   - This selects everything

3. **Copy:**
   - Press `Cmd+C` (Mac) or `Ctrl+C` (Windows)

4. **Go back to Supabase Dashboard**

5. **Replace default code:**
   - Select all in Supabase editor (`Cmd+A`)
   - Delete it (`Delete` key)
   - Paste your code (`Cmd+V`)

**What the code does:**
- Handles HTTP requests
- Validates security (CORS, rate limiting)
- Loads conversation history
- Detects intent
- Calls OpenAI API
- Streams response
- Saves to database

#### Step 4: Set Environment Variables
Environment variables are like settings/config that your code needs but shouldn't be hardcoded.

1. **Click "Settings" tab** (top of editor, next to "Code")

2. **Add Variable 1: OPENAI_API_KEY**
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key
   - **How to get:**
     - Go to: https://platform.openai.com/api-keys
     - Sign in
     - Click "Create new secret key"
     - Copy the key (starts with `sk-`)
     - ⚠️ Save it somewhere safe - you can't see it again!

3. **Add Variable 2: SUPABASE_URL**
   - **Name:** `SUPABASE_URL`
   - **Value:** `https://osxqnhwlxhspczudglyl.supabase.co`
   - This is your project URL

4. **Add Variable 3: SUPABASE_SERVICE_ROLE_KEY**
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zeHFuaHdseGhzcGN6dWRnbHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk1MDg4NywiZXhwIjoyMDgzNTI2ODg3fQ.ev-GRRnxBjNUqbuQqAHvc0pBCtCx2evxnvhIPYgbaW4`
   - This is from your `.env` file
   - ⚠️ This is secret - allows full database access

**Why these variables?**
- **OPENAI_API_KEY**: Needed to call OpenAI API
- **SUPABASE_URL**: Needed to connect to your database
- **SUPABASE_SERVICE_ROLE_KEY**: Needed to read/write database (bypasses RLS)

#### Step 5: Deploy
1. **Click "Deploy" button** (top right, usually green)
2. **Wait for deployment:**
   - Shows "Deploying..."
   - Then "Deployed successfully" ✅
   - Takes 10-30 seconds

**What happens during deployment:**
- Supabase uploads your code
- Compiles TypeScript to JavaScript
- Sets up the function endpoint
- Makes it accessible at: `https://osxqnhwlxhspczudglyl.supabase.co/functions/v1/chat-assistant`

#### Step 6: Test
1. **In Supabase Dashboard:**
   - Click "Test" or "Invoke" tab
   - Use this test payload:
   ```json
   {
     "messages": [
       {"role": "user", "content": "Hello"}
     ],
     "sessionId": "test-123"
   }
   ```
   - Click "Run" or "Invoke"
   - Should see chatbot response!

2. **From your website:**
   - Open browser console
   - Run test code (see DEPLOY_CHATBOT_NOW.md)

---

### Method 2: Command Line (Advanced)

#### Prerequisites:
- Supabase CLI installed ✅ (we did this)
- Terminal access

#### Steps:

**1. Login:**
```bash
supabase login
```
- Opens browser to sign in
- After signing in, terminal shows "Logged in as [your email]"

**2. Link Project:**
```bash
supabase link --project-ref osxqnhwlxhspczudglyl
```
- Links CLI to your Supabase project
- Shows: "Linked to project osxqnhwlxhspczudglyl"

**3. Set Secrets (Environment Variables):**
```bash
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```
- Sets the OpenAI API key
- Get key from: https://platform.openai.com/api-keys

**Verify secrets:**
```bash
supabase secrets list
```
- Shows all set secrets
- Should see: `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

**4. Deploy:**
```bash
supabase functions deploy chat-assistant
```
- Uploads function code
- Shows progress
- Ends with: "Function chat-assistant deployed successfully!"

**5. Test:**
```bash
curl -X POST https://osxqnhwlxhspczudglyl.supabase.co/functions/v1/chat-assistant \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"sessionId":"test-123"}'
```

---

## How Your Chatbot Uses It

### Frontend Code (ChatWidget.jsx):

```javascript
// When user sends message
const sendMessage = async (text) => {
  // 1. Prepare request
  const response = await fetch(
    `${supabaseUrl}/functions/v1/chat-assistant`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content: text }],
        sessionId: getSessionId(), // From localStorage
        userId: user?.id || null,   // If logged in
      }),
    }
  );

  // 2. Read streaming response
  const reader = response.body.getReader();
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Parse SSE stream
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const json = JSON.parse(line.slice(6));
        
        // Handle metadata (intent)
        if (json.type === 'metadata') {
          setCurrentIntent(json.intent);
          setSuggestedService(json.service);
        }
        
        // Handle content
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) {
          fullContent += delta;
          // Update UI in real-time
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: fullContent 
          }]);
        }
      }
    }
  }
};
```

### What Happens:

1. **User types message** → Frontend sends to Edge Function
2. **Edge Function processes** → Calls OpenAI, detects intent
3. **Response streams back** → Frontend displays in real-time
4. **Intent detected** → Frontend shows relevant buttons
5. **Conversation saved** → Edge Function saves to database

---

## Troubleshooting Deep Dive

### Issue 1: "Function not found"

**Symptoms:**
- 404 error when calling function
- "Function does not exist" message

**Causes:**
- Function name misspelled
- Function not deployed
- Wrong project

**Solutions:**
1. Check function name: Must be exactly `chat-assistant`
2. Verify deployment: Check Supabase Dashboard → Edge Functions
3. Check project: Make sure you're in correct project

### Issue 2: "Environment variable not set"

**Symptoms:**
- Function returns error about missing variable
- OpenAI API errors

**Causes:**
- Variable not set in Dashboard
- Variable name misspelled
- Variable not saved

**Solutions:**
1. Go to Edge Functions → Settings
2. Check variable names match exactly:
   - `OPENAI_API_KEY` (not `OPENAI_KEY`)
   - `SUPABASE_URL` (not `SUPABASE_URLS`)
3. Make sure "Save" was clicked
4. Redeploy function after adding variables

### Issue 3: "OpenAI API error"

**Symptoms:**
- 401 Unauthorized
- 429 Too Many Requests
- Invalid API key

**Causes:**
- Wrong API key
- No credits in OpenAI account
- Rate limit exceeded

**Solutions:**
1. Verify API key:
   - Go to: https://platform.openai.com/api-keys
   - Check key is active
   - Copy fresh key if needed
2. Check credits:
   - Go to: https://platform.openai.com/account/billing
   - Add credits if needed
3. Check rate limits:
   - Free tier: Limited requests
   - Paid tier: Higher limits

### Issue 4: "Database error"

**Symptoms:**
- "Table not found"
- "Permission denied"
- RLS policy errors

**Causes:**
- Migration not run
- Wrong table names
- RLS blocking access

**Solutions:**
1. Run migration:
   ```sql
   -- Run: supabase/migrations/20260217_chatbot_conversations.sql
   ```
2. Verify tables exist:
   - Go to: Database → Tables
   - Should see: `chat_conversations`, `chat_analytics`
3. Check RLS:
   - Tables should allow anonymous inserts
   - Check policies in migration file

### Issue 5: "CORS error"

**Symptoms:**
- Browser console shows CORS error
- Request blocked by browser

**Causes:**
- Domain not in ALLOWED_ORIGINS
- Wrong CORS headers

**Solutions:**
1. Check `ALLOWED_ORIGINS` in function code:
   ```typescript
   const ALLOWED_ORIGINS = [
     "https://www.instrakventurecapital.com",
     "https://instrakventurecapital.com",
     // Add your domain if missing
   ];
   ```
2. Add your domain if not listed
3. Redeploy function

---

## Security Considerations

### What's Protected:

1. **API Keys:**
   - ✅ Stored in Edge Function environment (not in code)
   - ✅ Never sent to browser
   - ✅ Only accessible server-side

2. **Rate Limiting:**
   - ✅ 10 requests per minute per IP
   - ✅ Prevents abuse
   - ✅ Protects costs

3. **Input Validation:**
   - ✅ Max message length: 1000 chars
   - ✅ Max messages: 20
   - ✅ Sanitizes input
   - ✅ Blocks malicious content

4. **CORS:**
   - ✅ Only allows specific domains
   - ✅ Blocks unauthorized origins

### Best Practices:

1. **Never commit API keys** to git
2. **Use environment variables** for secrets
3. **Monitor usage** in Supabase Dashboard
4. **Set up alerts** for high usage
5. **Rotate keys** periodically

---

## Cost Considerations

### OpenAI Costs:
- **GPT-4o-mini**: ~$0.15 per 1M input tokens, $0.60 per 1M output tokens
- **GPT-3.5-turbo** (intent): ~$0.50 per 1M tokens
- **Average chat**: ~500 tokens = $0.0003 per message

### Supabase Costs:
- **Edge Functions**: Free tier: 500K invocations/month
- **Database**: Free tier: 500MB storage
- **Bandwidth**: Free tier: 5GB/month

### Estimated Monthly Cost:
- **1000 chats/month**: ~$0.30 (OpenAI) + $0 (Supabase free tier)
- **10,000 chats/month**: ~$3 (OpenAI) + $0 (Supabase free tier)
- **100,000 chats/month**: ~$30 (OpenAI) + ~$25 (Supabase Pro)

---

## Monitoring & Analytics

### View Function Logs:
1. Go to: Edge Functions → `chat-assistant`
2. Click "Logs" tab
3. See:
   - Request/response times
   - Errors
   - Invocation count

### View Analytics:
```sql
-- Most common intents
SELECT intent, COUNT(*) 
FROM chat_analytics 
GROUP BY intent 
ORDER BY COUNT(*) DESC;

-- Average response time
SELECT AVG(response_time_ms) 
FROM chat_analytics;

-- Service mentions
SELECT service_mentioned, COUNT(*) 
FROM chat_analytics 
WHERE service_mentioned IS NOT NULL
GROUP BY service_mentioned;
```

---

## Next Steps After Deployment

1. ✅ **Test thoroughly** - Try different messages
2. ✅ **Monitor logs** - Check for errors
3. ✅ **Check analytics** - See what users ask
4. ✅ **Optimize prompts** - Improve responses
5. ✅ **Add features** - Voice input, follow-ups, etc.

---

## Summary

**Edge Functions are:**
- Serverless code running on Supabase
- Secure way to call external APIs
- Bridge between frontend and backend services

**Your chatbot uses them to:**
- Call OpenAI API securely
- Save conversations to database
- Detect user intent
- Provide smart suggestions

**Deployment is:**
- Copy code → Set variables → Deploy
- Takes 5 minutes
- One-time setup

**After deployment:**
- Chatbot works automatically
- Conversations persist
- Analytics track usage
- Can improve over time

---

**Questions?** Check the troubleshooting section or test in Supabase Dashboard!
