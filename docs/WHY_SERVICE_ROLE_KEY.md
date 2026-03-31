# Why Edge Function Needs Service Role Key

## 🔐 The Problem: Row Level Security (RLS)

### What is RLS?
Supabase uses **Row Level Security (RLS)** to protect your database. It means:
- Users can only access data they're allowed to see
- Rules are enforced at the database level
- Even if someone has your API key, they can't access everything

### Example:
```sql
-- RLS Policy Example
CREATE POLICY "Users can only see their own data"
ON chat_conversations FOR SELECT
USING (auth.uid() = user_id);
```

This means: Users can only see conversations where `user_id` matches their authenticated user ID.

---

## ❌ Problem: Anonymous Users Can't Save

### Your Chatbot Situation:
- **Users are anonymous** (not logged in)
- **Chatbot needs to save conversations** for everyone
- **RLS blocks anonymous inserts** by default

### What Happens Without Service Role Key:

```typescript
// Edge Function tries to save conversation
const { data, error } = await supabase
  .from('chat_conversations')
  .insert({
    session_id: 'chat_123',
    messages: [...],
    intent: 'FUNDING_REQUEST'
  });

// ❌ ERROR: "new row violates row-level security policy"
// Anonymous users can't insert!
```

**Result:** Conversations don't save ❌

---

## ✅ Solution: Service Role Key

### What is Service Role Key?
- **Full database access** - bypasses all RLS policies
- **Server-side only** - never exposed to browser
- **Admin privileges** - can read/write anything

### How It Works:

```typescript
// In Edge Function (server-side)
const supabase = createClient(
  supabaseUrl,
  SUPABASE_SERVICE_ROLE_KEY  // ← Service role key
);

// Now can save conversations for ANYONE
const { data, error } = await supabase
  .from('chat_conversations')
  .insert({
    session_id: 'chat_123',  // Anonymous user's session
    messages: [...],
    intent: 'FUNDING_REQUEST'
  });

// ✅ SUCCESS! Saved because service role bypasses RLS
```

---

## 🔒 Security: Why It's Safe

### Service Role Key is NEVER Exposed:

**❌ NOT in Browser:**
```javascript
// Frontend code - uses ANON key
const supabase = createClient(
  supabaseUrl,
  VITE_SUPABASE_ANON_KEY  // ← Safe, limited permissions
);
```

**✅ ONLY in Edge Function:**
```typescript
// Edge Function - uses SERVICE ROLE key
const supabase = createClient(
  supabaseUrl,
  SUPABASE_SERVICE_ROLE_KEY  // ← Hidden, server-side only
);
```

### Why This is Safe:
1. **Edge Function runs on Supabase servers** - not in browser
2. **Environment variable** - stored securely, never in code
3. **Only Edge Function can use it** - can't be accessed from frontend
4. **You control what it does** - your code, your rules

---

## 📊 What Service Role Key Enables

### 1. Save Conversations (Anonymous Users)
```typescript
// Save conversation for anonymous user
await supabase.from('chat_conversations').insert({
  session_id: 'chat_123',  // No user_id needed
  messages: [...],
  intent: 'FUNDING_REQUEST'
});
```

**Without service role:** ❌ Blocked by RLS  
**With service role:** ✅ Works!

### 2. Load Conversations (Any Session)
```typescript
// Load conversation by session_id
const { data } = await supabase
  .from('chat_conversations')
  .select('*')
  .eq('session_id', sessionId)
  .single();
```

**Without service role:** ❌ Can't read other sessions  
**With service role:** ✅ Can read any session

### 3. Save Analytics
```typescript
// Save analytics data
await supabase.from('chat_analytics').insert({
  session_id: 'chat_123',
  intent: 'FUNDING_REQUEST',
  user_message: 'I need funding',
  assistant_response: '...',
  response_time_ms: 250
});
```

**Without service role:** ❌ Blocked by RLS  
**With service role:** ✅ Works!

### 4. Fetch Site Content
```typescript
// Load services, about, contact info for AI context
const { data } = await supabase
  .from('site_content')
  .select('id, content')
  .in('id', ['services', 'about', 'contact_page']);
```

**Without service role:** ❌ Might be blocked by RLS  
**With service role:** ✅ Always works!

---

## 🎯 Real-World Example

### Scenario: User Sends "I need funding"

**Step 1: Frontend (Uses ANON Key)**
```javascript
// User's browser - LIMITED access
fetch('/functions/v1/chat-assistant', {
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'I need funding' }],
    sessionId: 'chat_123'
  })
});
```
- ✅ Can call Edge Function
- ❌ Cannot directly access database

**Step 2: Edge Function (Uses SERVICE ROLE Key)**
```typescript
// Server-side - FULL access
const supabase = createClient(url, SERVICE_ROLE_KEY);

// Load previous conversation
const history = await supabase
  .from('chat_conversations')
  .select('messages')
  .eq('session_id', 'chat_123');  // ✅ Works!

// Detect intent
const intent = await detectIntent(...);

// Call OpenAI
const response = await callOpenAI(...);

// Save conversation
await supabase.from('chat_conversations').insert({
  session_id: 'chat_123',
  messages: [...history, newMessages],
  intent: 'FUNDING_REQUEST'
});  // ✅ Works!

// Save analytics
await supabase.from('chat_analytics').insert({
  session_id: 'chat_123',
  intent: 'FUNDING_REQUEST',
  ...
});  // ✅ Works!
```

**Without service role key:** All database operations fail ❌  
**With service role key:** Everything works ✅

---

## 🔐 Security Best Practices

### ✅ DO:
- Store service role key in **Edge Function environment variables**
- **Never** commit it to git
- **Never** expose it to frontend
- Use it **only** in server-side code
- Rotate it periodically

### ❌ DON'T:
- Put it in `.env` file that gets committed
- Send it to browser
- Log it in console
- Share it publicly
- Use it in frontend code

---

## 📋 Where to Set Service Role Key

### In Supabase Dashboard:

1. **Go to:** Edge Functions → `chat-assistant` → **"Secrets"** tab
2. **Add Secret:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your service role key (from Settings → API)
3. **Save**

### Or via CLI:
```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

---

## 🎯 Summary

**Why Service Role Key is Needed:**

1. **Anonymous Users:** Chatbot users aren't logged in
2. **RLS Blocks:** Anonymous users can't save data by default
3. **Service Role Bypasses:** Allows Edge Function to save for anyone
4. **Server-Side Only:** Safe because it never reaches browser
5. **Enables Features:** Conversation memory, analytics, content loading

**Without it:**
- ❌ Conversations don't save
- ❌ Analytics don't track
- ❌ Conversation history doesn't load
- ❌ New features don't work

**With it:**
- ✅ Conversations save
- ✅ Analytics track
- ✅ History loads
- ✅ All features work

---

## 🔍 How to Verify It's Set

### Check in Supabase Dashboard:
1. Edge Functions → `chat-assistant` → **"Secrets"** tab
2. Look for: `SUPABASE_SERVICE_ROLE_KEY`
3. Should show: `••••••••` (hidden value)

### Check in Function Logs:
1. Edge Functions → `chat-assistant` → **"Logs"** tab
2. Look for errors like:
   - "Supabase credentials not available"
   - "Failed to fetch site_content"
   - "Error saving conversation"

**If you see these errors:** Service role key not set ❌  
**If no errors:** Service role key is set ✅

---

**TL;DR:** Service role key lets your Edge Function save conversations for anonymous users. Without it, RLS blocks database writes and the new features won't work! 🔐
