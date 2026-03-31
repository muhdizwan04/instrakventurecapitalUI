# Quick Chatbot Testing Checklist

## 🎯 3 Critical Tests (Do These First!)

### Test 1: Conversation Memory ⭐ MOST IMPORTANT
**Steps:**
1. Open chat → Send: `"Hello"`
2. Close chat (click X)
3. Reopen chat

**✅ PASS:** Previous message is still there
**❌ FAIL:** Message disappeared

---

### Test 2: Intent Detection - Funding ⭐
**Steps:**
1. Open chat → Send: `"I need funding"`
2. Wait for response

**✅ PASS:** Shows "For Investors" button
**❌ FAIL:** No button appears

---

### Test 3: Database Storage ⭐
**Steps:**
1. Send a few messages
2. Go to: Supabase Dashboard → Database → Tables → `chat_conversations`
3. Click "View Data"

**✅ PASS:** See your conversation saved
**❌ FAIL:** Table empty or doesn't exist

---

## 📋 Full Test List

### Basic Functionality
- [ ] Chat opens/closes smoothly
- [ ] Messages send and receive
- [ ] Responses stream in (typing effect)
- [ ] No console errors

### Conversation Memory
- [ ] Messages persist after closing/reopening ⭐
- [ ] Messages persist after page reload ⭐
- [ ] Each browser has separate session

### Intent Detection
- [ ] "I need funding" → Shows "For Investors" button ⭐
- [ ] "Tell me about equity financing" → Shows "View Service" button
- [ ] "How do I contact you?" → Shows "Contact Us" button
- [ ] "I want to apply" → Shows "Fill Inquiry Form" button

### Smart Suggestions
- [ ] Quick actions appear on first open
- [ ] Intent-based actions appear after detecting intent
- [ ] Buttons navigate to correct pages

### Database & Analytics
- [ ] Conversations saved to `chat_conversations` table ⭐
- [ ] Analytics saved to `chat_analytics` table
- [ ] Intent stored correctly
- [ ] Service mentioned stored correctly

### Error Handling
- [ ] Long messages handled gracefully
- [ ] Empty messages rejected
- [ ] Network errors show friendly message
- [ ] Rate limiting works (10 req/min)

---

## 🚨 If Tests Fail

### Conversation Memory Not Working?
- Check: Database migration ran (`chat_conversations` table exists)
- Check: Function code has `saveConversation()` and `loadConversation()`
- Check: Browser console for errors

### Intent Detection Not Working?
- Check: Function code has `detectIntent()` function
- Check: `OPENAI_API_KEY` is set in function settings
- Check: Frontend shows intent suggestions

### Database Not Saving?
- Check: Migration ran successfully
- Check: `SUPABASE_SERVICE_ROLE_KEY` is set
- Check: Function logs in Supabase Dashboard

---

## ✅ Success = All 3 Critical Tests Pass!

If Test 1, 2, and 3 all pass → **Deployment Successful!** 🎉
