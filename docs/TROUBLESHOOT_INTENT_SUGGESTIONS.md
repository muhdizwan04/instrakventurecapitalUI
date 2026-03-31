# Troubleshooting: Intent Suggestions Not Showing

## 🔍 Problem
Intent-based suggestions (like "For Investors" button) are not appearing after AI responses.

---

## 🎯 Root Cause Analysis

The suggestions appear when:
1. ✅ `currentIntent` state is set
2. ✅ `messages.length > 1` (after first exchange)
3. ✅ `!isLoading` (not currently loading)

If suggestions aren't showing, one of these is failing.

---

## 🔧 Step-by-Step Debugging

### Step 1: Check if Intent is Being Detected

**Open Browser Console (F12):**
1. Go to your website
2. Open chat widget
3. Send: "I need funding"
4. Open Console tab (F12 → Console)
5. Look for any errors

**Check for:**
- ❌ CORS errors
- ❌ Network errors
- ❌ JavaScript errors
- ✅ No errors = Good

---

### Step 2: Check if Intent is in Response Headers

**In Browser Console, run:**
```javascript
// After sending a message, check the response
fetch('https://osxqnhwlxhspczudglyl.supabase.co/functions/v1/chat-assistant', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'I need funding' }],
    sessionId: 'test-123'
  })
})
.then(r => {
  console.log('Intent Header:', r.headers.get('X-Intent'));
  console.log('Service Header:', r.headers.get('X-Service'));
  return r.text();
})
.then(text => console.log('Response:', text));
```

**Expected:**
- `X-Intent`: `FUNDING_REQUEST`
- `X-Service`: `null` or service name

**If headers are missing:** Edge Function not sending them (old version or not updated)

---

### Step 3: Check if Intent Metadata is in Stream

The new version sends intent as first SSE event:
```json
data: {"type":"metadata","intent":"FUNDING_REQUEST","service":null}
```

**Check Browser Console:**
- Look for any logs about metadata
- Check Network tab → chat-assistant request → Response
- Look for `"type":"metadata"` in the stream

---

### Step 4: Verify Frontend Code Has Intent Handling

**Check if code exists:**
1. Open: `src/components/ChatWidget/ChatWidget.jsx`
2. Look for:
   - `const [currentIntent, setCurrentIntent] = useState(null);` ← Should exist
   - `if (parsed.type === 'metadata')` ← Should exist
   - `{currentIntent === 'FUNDING_REQUEST' && (` ← Should exist

**If missing:** Frontend code not updated

---

### Step 5: Check Edge Function Code

**Go to Supabase Dashboard:**
1. Edge Functions → `chat-assistant`
2. Look at the code
3. Check for:
   - `detectIntent()` function ← Should exist
   - `saveConversation()` function ← Should exist
   - `X-Intent` header ← Should be set
   - Metadata event ← Should be sent

**If missing:** Edge Function not updated with new code

---

## 🚨 Most Likely Issues

### Issue 1: Edge Function Not Updated ⭐ MOST COMMON

**Symptom:**
- Chat works
- No intent suggestions
- No conversation memory

**Solution:**
1. Go to: Supabase Dashboard → Edge Functions → `chat-assistant`
2. Copy code from: `supabase/functions/chat-assistant/index.ts`
3. Paste into Dashboard editor
4. Set environment variables:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click "Deploy"
6. Wait for deployment
7. Test again

---

### Issue 2: Frontend Not Built/Deployed

**Symptom:**
- Code exists in files
- But website shows old version

**Solution:**
```bash
# Build frontend
npm run build

# Or if using Vite dev server, restart it
npm run dev
```

---

### Issue 3: Intent Detection Failing Silently

**Symptom:**
- Edge Function updated
- But intent not detected

**Check:**
1. Supabase Dashboard → Edge Functions → `chat-assistant` → Logs
2. Look for errors about:
   - OpenAI API key
   - Intent detection failures
   - Network errors

**Solution:**
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI account has credits
- Check function logs for errors

---

### Issue 4: State Not Updating

**Symptom:**
- Intent detected (check console)
- But UI not updating

**Debug:**
Add temporary console logs:
```javascript
// In ChatWidget.jsx, after receiving metadata
if (parsed.type === 'metadata') {
  console.log('Intent received:', parsed.intent);
  console.log('Service received:', parsed.service);
  setCurrentIntent(parsed.intent);
  setSuggestedService(parsed.service);
}
```

**Check console:** Do you see the logs?

---

## ✅ Quick Fix Checklist

- [ ] Edge Function code updated with new features?
- [ ] Environment variables set (`OPENAI_API_KEY`, etc.)?
- [ ] Function deployed successfully?
- [ ] Frontend code has intent handling?
- [ ] Frontend built/deployed?
- [ ] Browser console shows no errors?
- [ ] Intent headers present in response?

---

## 🧪 Test After Fix

1. **Clear browser cache** (Cmd+Shift+R / Ctrl+Shift+R)
2. **Open chat widget**
3. **Send:** "I need funding"
4. **Check:**
   - Browser console for errors
   - Response headers for `X-Intent`
   - Suggestions appear below response

---

## 📞 Still Not Working?

**Check these:**

1. **Browser Console Errors:**
   - Open F12 → Console
   - Look for red errors
   - Share error messages

2. **Network Tab:**
   - F12 → Network
   - Find `chat-assistant` request
   - Check Response headers
   - Check Response body

3. **Supabase Function Logs:**
   - Dashboard → Edge Functions → `chat-assistant` → Logs
   - Look for errors
   - Check execution time

4. **Database:**
   - Check `chat_conversations` table
   - Is data being saved?
   - Is `intent` column populated?

---

## 🎯 Expected Flow (When Working)

```
1. User sends: "I need funding"
   ↓
2. Frontend sends to Edge Function
   ↓
3. Edge Function detects intent: FUNDING_REQUEST
   ↓
4. Edge Function sends metadata: {"type":"metadata","intent":"FUNDING_REQUEST"}
   ↓
5. Frontend receives metadata
   ↓
6. Frontend sets: setCurrentIntent('FUNDING_REQUEST')
   ↓
7. Frontend renders suggestion box
   ↓
8. User sees: "Ready to explore funding options?" + "For Investors" button
```

**If any step fails, suggestions won't show.**

---

## 🔧 Most Common Fix

**90% of the time, the issue is:**

Edge Function not updated with new code.

**Fix:**
1. Copy code from `supabase/functions/chat-assistant/index.ts`
2. Paste into Supabase Dashboard
3. Deploy
4. Test

That's usually it! 🎯
