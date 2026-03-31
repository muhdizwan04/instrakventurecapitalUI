# Quick Debug: Why Intent Suggestions Aren't Showing

## 🔍 Most Likely Issue: Edge Function Not Updated

The Edge Function probably still has the **old code** without intent detection.

---

## ✅ Quick Check: Is Edge Function Updated?

### Step 1: Check Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/osxqnhwlxhspczudglyl/functions
2. Click on `chat-assistant` function
3. Look at the code

### Step 2: Check for New Functions
Look for these functions in the code:
- ✅ `detectIntent()` ← Should exist
- ✅ `saveConversation()` ← Should exist  
- ✅ `loadConversation()` ← Should exist
- ✅ `saveAnalytics()` ← Should exist

**If these DON'T exist:** Edge Function has old code ❌

---

## 🔧 Fix: Update Edge Function

### Option 1: Via Dashboard (Easiest)

1. **Open your code file:**
   - File: `supabase/functions/chat-assistant/index.ts`
   - Copy ALL code (Cmd+A, Cmd+C)

2. **Go to Supabase Dashboard:**
   - Edge Functions → `chat-assistant`
   - Click "Code" tab

3. **Replace code:**
   - Select all in editor (Cmd+A)
   - Delete
   - Paste new code (Cmd+V)

4. **Check Environment Variables:**
   - Click "Settings" tab
   - Verify these are set:
     - `OPENAI_API_KEY` = Your OpenAI key
     - `SUPABASE_URL` = `https://osxqnhwlxhspczudglyl.supabase.co`
     - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key

5. **Deploy:**
   - Click "Deploy" button
   - Wait for "Deployed successfully"

6. **Test:**
   - Clear browser cache (Cmd+Shift+R)
   - Open chat widget
   - Send: "I need funding"
   - Should see "For Investors" button ✅

---

## 🧪 Test if Intent is Being Detected

### Test in Browser Console:

1. **Open your website**
2. **Open browser console** (F12)
3. **Run this:**

```javascript
// Test intent detection
fetch('https://osxqnhwlxhspczudglyl.supabase.co/functions/v1/chat-assistant', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zeHFuaHdseGhzcGN6dWRnbHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTA4ODcsImV4cCI6MjA4MzUyNjg4N30.PE-eIJ1kJbi6wn3ivDHxkL8kaw9X0Ol3OZZT2LaU8Gg',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'I need funding' }],
    sessionId: 'test-debug-123'
  })
})
.then(r => {
  console.log('✅ Status:', r.status);
  console.log('✅ Intent Header:', r.headers.get('X-Intent'));
  console.log('✅ Service Header:', r.headers.get('X-Service'));
  return r.text();
})
.then(text => {
  console.log('✅ Response preview:', text.substring(0, 200));
  // Look for metadata in response
  if (text.includes('"type":"metadata"')) {
    console.log('✅ Metadata found in response!');
  } else {
    console.log('❌ No metadata found - Edge Function not updated');
  }
});
```

### Expected Results:

**If Edge Function is UPDATED:**
```
✅ Status: 200
✅ Intent Header: FUNDING_REQUEST
✅ Service Header: null
✅ Metadata found in response!
```

**If Edge Function is OLD:**
```
✅ Status: 200
✅ Intent Header: null  ← Missing!
✅ Service Header: null  ← Missing!
❌ No metadata found - Edge Function not updated
```

---

## 🎯 What to Do Based on Test Results

### If Headers are NULL:
→ Edge Function needs to be updated with new code

### If Headers Exist but Suggestions Don't Show:
→ Frontend issue - check browser console for errors

### If Everything Works but Suggestions Don't Show:
→ CSS issue - check if styles are applied

---

## 📋 Quick Fix Checklist

- [ ] Edge Function code updated? (Check Dashboard)
- [ ] Environment variables set? (`OPENAI_API_KEY`, etc.)
- [ ] Function deployed? (Click Deploy button)
- [ ] Browser cache cleared? (Cmd+Shift+R)
- [ ] Tested again? (Send "I need funding")

---

## 🚨 Most Common Issue

**90% of the time:** Edge Function code is not updated.

**Solution:** Copy code from `index.ts` → Paste in Dashboard → Deploy

That's it! 🎯
