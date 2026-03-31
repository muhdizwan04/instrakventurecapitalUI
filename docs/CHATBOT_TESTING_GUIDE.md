# Chatbot Testing Guide - What to Test & Expected Results

## 🧪 Testing Checklist

After deploying the updated Edge Function, test these features to verify everything works correctly.

---

## ✅ Test 1: Basic Chat Functionality

### Test Steps:
1. Open your website
2. Click the chat widget button (bottom right)
3. Send message: `"Hello"`

### ✅ Expected Result:
- Chat widget opens smoothly
- Your message appears in chat
- AI responds with greeting/helpful message
- Response streams in (typing effect)
- No errors in browser console

### ❌ If Fails:
- Check browser console for errors
- Verify Edge Function is deployed
- Check `OPENAI_API_KEY` is set

---

## ✅ Test 2: Conversation Memory (Most Important!)

### Test Steps:
1. Open chat widget
2. Send: `"What services do you offer?"`
3. Wait for response
4. Send: `"Tell me more about the first one"`
5. **Close chat widget** (click X button)
6. **Reopen chat widget** (click chat button again)

### ✅ Expected Result:
- Previous messages are **still there** ✅
- Conversation history is loaded
- You can see both your messages and AI responses
- Welcome message is NOT shown again (because conversation exists)

### ❌ If Fails (Old Version):
- Messages disappear when you close/reopen
- Only welcome message shows
- No conversation history

**This is the KEY test** - if this works, conversation memory is working!

---

## ✅ Test 3: Intent Detection - Funding Request

### Test Steps:
1. Open chat widget
2. Send: `"I need funding"` or `"I'm looking for investment"`
3. Wait for response

### ✅ Expected Result:
- AI responds about funding options
- **NEW:** A suggestion box appears below the response
- Shows: `"Ready to explore funding options?"`
- Shows button: `"For Investors"` with external link icon
- Button navigates to `/investors` page when clicked

### ❌ If Fails (Old Version):
- AI responds normally
- No special buttons appear
- No intent-based suggestions

---

## ✅ Test 4: Intent Detection - Service Inquiry

### Test Steps:
1. Open chat widget
2. Send: `"Tell me about equity financing"` or `"What is Virtual CFO?"`
3. Wait for response

### ✅ Expected Result:
- AI responds about the service
- **NEW:** Suggestion box appears
- Shows: `"Interested in equity financing?"` (or service name)
- Shows button: `"View Service"` with external link icon
- Button navigates to `/services/equity-financing` (or relevant service)

### ❌ If Fails (Old Version):
- AI responds but no suggestions
- No service-specific buttons

---

## ✅ Test 5: Intent Detection - Contact Request

### Test Steps:
1. Open chat widget
2. Send: `"How do I contact you?"` or `"I want to schedule a meeting"`
3. Wait for response

### ✅ Expected Result:
- AI responds with contact information
- **NEW:** Suggestion box appears
- Shows: `"Want to get in touch?"`
- Shows button: `"Contact Us"` with external link icon
- Button navigates to `/contact` page

---

## ✅ Test 6: Intent Detection - Form Submission

### Test Steps:
1. Open chat widget
2. Send: `"I want to apply"` or `"I'm ready to fill the form"`
3. Wait for response

### ✅ Expected Result:
- AI responds encouraging form submission
- **NEW:** Suggestion box appears
- Shows: `"Ready to apply?"`
- Shows button: `"Fill Inquiry Form"` with external link icon
- Button navigates to relevant service page

---

## ✅ Test 7: Multiple Messages in Session

### Test Steps:
1. Open chat widget
2. Send: `"Hello"`
3. Send: `"What services do you offer?"`
4. Send: `"Tell me about equity financing"`
5. Send: `"What are the requirements?"`

### ✅ Expected Result:
- All messages appear in order
- AI responds to each appropriately
- Context is maintained (AI remembers previous messages)
- Intent suggestions update based on latest message
- No errors or crashes

---

## ✅ Test 8: Quick Actions (Default)

### Test Steps:
1. Open chat widget (fresh, no previous conversation)
2. Look at the bottom of chat window

### ✅ Expected Result:
- **NEW:** Quick action buttons appear:
  - `"What services do you offer?"`
  - `"I need funding"`
  - `"Tell me about Virtual CFO"`
  - `"How to contact you?"`
- Clicking a button sends that message
- Buttons disappear after first message

---

## ✅ Test 9: Intent-Based Quick Actions

### Test Steps:
1. Open chat widget
2. Send: `"I need funding"`
3. Wait for response
4. Look at bottom of chat window

### ✅ Expected Result:
- **NEW:** Intent-specific quick actions appear:
  - `"What funding options do you have?"`
  - `"What is the minimum investment?"`
  - `"Schedule a consultation"`
- These are different from default actions
- Based on detected intent (FUNDING_REQUEST)

---

## ✅ Test 10: Database Storage

### Test Steps:
1. Send a few messages in chat
2. Go to Supabase Dashboard
3. Navigate to: Database → Tables → `chat_conversations`
4. Click "View Data" or browse table

### ✅ Expected Result:
- **NEW:** See a row with:
  - `session_id`: Your session ID (starts with `chat_`)
  - `messages`: JSON array with your conversation
  - `intent`: One of: `SERVICE_INQUIRY`, `FUNDING_REQUEST`, `CONTACT_REQUEST`, `GENERAL_INFO`, `FORM_SUBMISSION`
  - `service_mentioned`: Service name if mentioned (e.g., `"equity-financing"`)
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

### ❌ If Fails:
- Table doesn't exist → Run migration
- No rows → Function not saving (check logs)
- Empty messages → Check function code

---

## ✅ Test 11: Analytics Tracking

### Test Steps:
1. Send a few messages
2. Go to Supabase Dashboard
3. Navigate to: Database → Tables → `chat_analytics`
4. Click "View Data"

### ✅ Expected Result:
- **NEW:** See rows with:
  - `session_id`: Your session ID
  - `intent`: Detected intent
  - `service_mentioned`: Service if mentioned
  - `user_message`: Your message (truncated to 500 chars)
  - `assistant_response`: AI response (truncated to 1000 chars)
  - `response_time_ms`: Time taken in milliseconds
  - `created_at`: Timestamp

### ❌ If Fails:
- Table doesn't exist → Run migration
- No rows → Analytics not saving (check function logs)

---

## ✅ Test 12: Session Persistence Across Page Reloads

### Test Steps:
1. Open chat widget
2. Send: `"Hello, I'm interested in your services"`
3. Wait for response
4. **Reload the page** (F5 or Cmd+R)
5. Open chat widget again

### ✅ Expected Result:
- **NEW:** Previous conversation is loaded
- Your message and AI response are still there
- Session ID is preserved (stored in localStorage)
- Conversation continues seamlessly

### ❌ If Fails:
- Messages disappear after reload
- Session ID not persisting
- Check browser localStorage: `chat_session_id`

---

## ✅ Test 13: Multiple Sessions (Different Browsers/Devices)

### Test Steps:
1. Open chat in Browser A (Chrome)
2. Send: `"Test from Chrome"`
3. Open chat in Browser B (Safari/Firefox) or Incognito
4. Send: `"Test from Safari"`

### ✅ Expected Result:
- Each browser has its own session
- Conversations are separate
- Each session saves independently
- No conflicts between sessions

---

## ✅ Test 14: Error Handling

### Test Steps:
1. Open chat widget
2. Send a very long message (1000+ characters)
3. Try sending empty message
4. Disconnect internet, try sending message

### ✅ Expected Result:
- Long messages are truncated (max 1000 chars)
- Empty messages are rejected
- Network errors show friendly error message:
  - `"Sorry, I encountered an issue. Please try again or contact us directly."`
- Chat widget doesn't crash
- Can retry after error

---

## ✅ Test 15: Streaming Response

### Test Steps:
1. Open chat widget
2. Send: `"Tell me about all your services in detail"`
3. Watch the response appear

### ✅ Expected Result:
- Response appears **word by word** (streaming)
- Not all at once
- Smooth typing effect
- No lag or stuttering
- Response completes fully

---

## ✅ Test 16: Intent Detection Accuracy

### Test Cases:

| User Message | Expected Intent | Expected Service | Expected Button |
|-------------|----------------|------------------|-----------------|
| "I need funding" | `FUNDING_REQUEST` | `null` | "For Investors" |
| "Tell me about equity financing" | `SERVICE_INQUIRY` | `"equity-financing"` | "View Service" |
| "What is Virtual CFO?" | `SERVICE_INQUIRY` | `"virtual-cfo"` | "View Service" |
| "How do I contact you?" | `CONTACT_REQUEST` | `null` | "Contact Us" |
| "I want to apply" | `FORM_SUBMISSION` | `null` | "Fill Inquiry Form" |
| "What is your mission?" | `GENERAL_INFO` | `null` | No button (or default) |

### ✅ Expected Result:
- Intent detected correctly for each message
- Service extracted when mentioned
- Correct button appears
- Button navigates to correct page

---

## ✅ Test 17: Rate Limiting

### Test Steps:
1. Open chat widget
2. Send 12+ messages rapidly (within 1 minute)

### ✅ Expected Result:
- First 10 messages work fine
- 11th message shows error:
  - `"Too many requests. Please wait a moment before trying again."`
- After 1 minute, can send again
- Protects against abuse

---

## ✅ Test 18: Mobile Responsiveness

### Test Steps:
1. Open website on mobile device (or resize browser)
2. Open chat widget
3. Send messages
4. Test all buttons

### ✅ Expected Result:
- Chat widget fits screen
- Full-screen on mobile (good UX)
- Buttons are tappable
- Text is readable
- No layout issues

---

## 📊 Test Results Summary

After testing, fill this out:

| Test # | Feature | Status | Notes |
|--------|---------|--------|-------|
| 1 | Basic Chat | ⬜ Pass / ⬜ Fail | |
| 2 | Conversation Memory | ⬜ Pass / ⬜ Fail | **MOST IMPORTANT** |
| 3 | Intent: Funding | ⬜ Pass / ⬜ Fail | |
| 4 | Intent: Service | ⬜ Pass / ⬜ Fail | |
| 5 | Intent: Contact | ⬜ Pass / ⬜ Fail | |
| 6 | Intent: Form | ⬜ Pass / ⬜ Fail | |
| 7 | Multiple Messages | ⬜ Pass / ⬜ Fail | |
| 8 | Quick Actions | ⬜ Pass / ⬜ Fail | |
| 9 | Intent Actions | ⬜ Pass / ⬜ Fail | |
| 10 | Database Storage | ⬜ Pass / ⬜ Fail | |
| 11 | Analytics | ⬜ Pass / ⬜ Fail | |
| 12 | Page Reload | ⬜ Pass / ⬜ Fail | |
| 13 | Multiple Sessions | ⬜ Pass / ⬜ Fail | |
| 14 | Error Handling | ⬜ Pass / ⬜ Fail | |
| 15 | Streaming | ⬜ Pass / ⬜ Fail | |
| 16 | Intent Accuracy | ⬜ Pass / ⬜ Fail | |
| 17 | Rate Limiting | ⬜ Pass / ⬜ Fail | |
| 18 | Mobile | ⬜ Pass / ⬜ Fail | |

---

## 🎯 Critical Tests (Must Pass)

These are the **most important** tests - if these fail, the new features aren't working:

1. ✅ **Test 2: Conversation Memory** - Messages persist after closing/reopening
2. ✅ **Test 3: Intent Detection** - Shows smart suggestions based on intent
3. ✅ **Test 10: Database Storage** - Conversations saved to database

---

## 🐛 Troubleshooting Failed Tests

### If Test 2 Fails (Conversation Memory):
- Check: Database migration ran (`chat_conversations` table exists)
- Check: Function code has `loadConversation()` and `saveConversation()`
- Check: Browser console for errors
- Check: Supabase function logs for errors

### If Test 3 Fails (Intent Detection):
- Check: Function code has `detectIntent()` function
- Check: `OPENAI_API_KEY` is set (needed for intent detection)
- Check: Response headers include `X-Intent`
- Check: Frontend code handles intent metadata

### If Test 10 Fails (Database Storage):
- Check: Migration ran successfully
- Check: RLS policies allow inserts
- Check: `SUPABASE_SERVICE_ROLE_KEY` is set
- Check: Function logs for database errors

---

## 📝 Testing Checklist

Before considering deployment successful:

- [ ] Basic chat works
- [ ] **Conversation persists after closing/reopening** ⭐
- [ ] **Intent detection works** ⭐
- [ ] **Smart suggestions appear** ⭐
- [ ] Database tables have data
- [ ] Analytics are tracked
- [ ] No console errors
- [ ] Mobile works
- [ ] Error handling works

**⭐ = Critical features**

---

## 🎉 Success Criteria

Your deployment is successful if:

1. ✅ Conversations persist across sessions
2. ✅ Intent-based suggestions appear
3. ✅ Database has conversation data
4. ✅ No errors in console
5. ✅ All critical tests pass

---

**Happy Testing!** 🚀

If any test fails, check the troubleshooting section or review the deployment steps.
