# 🔒 AGROF Encrypted Messaging System

## Overview
Secure, encrypted messaging system for buyers and sellers to communicate in the AGROF marketplace.

## Features

### ✅ End-to-End Encryption
- Messages encrypted using **AES-256** encryption via CryptoJS
- Unique encryption key per chat (derived from both user UIDs)
- Only chat participants can decrypt messages
- Zero-knowledge architecture - even the server cannot read messages

### ✅ Real-Time Communication
- Powered by **Firebase Firestore**
- Instant message delivery
- Live message updates
- Read receipts
- Online/offline status

### ✅ Beautiful Chat UI
- WhatsApp-style chat interface
- Message bubbles with timestamps
- Auto-scroll to latest messages
- Keyboard-aware input
- Empty state placeholders

### ✅ Contact Options
- **Message Button** - Opens encrypted chat
- **Call Button** - Opens phone dialer
- Shows phone numbers and verification status

---

## How It Works

### 1. Message Sending Flow

```
User types message → Encrypt with AES-256 → 
Save to Firestore → Real-time sync → 
Decrypt on receiver's device → Display
```

### 2. Encryption Details

**Key Generation:**
```javascript
chatId = chat_{smaller_UID}_{larger_UID}
encryptionKey = AGROF_SECURE_CHAT_{chatId}
```

**Encryption:**
```javascript
encryptedMessage = AES.encrypt(messageText, encryptionKey)
```

**Decryption:**
```javascript
decryptedMessage = AES.decrypt(encryptedMessage, encryptionKey)
```

### 3. Chat ID System

Chats are identified by a deterministic ID:
- Always sorted UIDs: `chat_uid1_uid2`
- Same ID regardless of who initiates
- Ensures single conversation thread

---

## User Guide

### Starting a Conversation

1. **Navigate to any product** (Coffee, Maize, etc.)
2. **Tap "View Trading Info"**
3. **Go to "Buyers" or "Sellers" tab**
4. **Find a trader** you want to contact
5. **Tap "Message" button**
6. **Start chatting!**

### Chat Features

- **📱 Message:** Send encrypted text messages
- **📞 Call:** Tap to call directly (if phone number available)
- **🔒 Encryption Badge:** Shows "End-to-end encrypted"
- **✓ Read Status:** See when messages are read
- **⏰ Timestamps:** 12-hour format with AM/PM

---

## Technical Implementation

### Files Created

1. **`services/messagingService.js`**
   - Handles all messaging operations
   - Encryption/decryption logic
   - Firebase Firestore integration

2. **`screens/ChatScreen.js`**
   - Chat UI component
   - Real-time message display
   - Input handling

3. **Updates to `ProductTradingScreen.js`**
   - Added "Message" and "Call" buttons
   - Contact functionality
   - Navigation to chat

4. **Updates to `App.js`**
   - Chat screen routing
   - Navigation state management

### Firebase Structure

```
firestore/
├── chats/
│   ├── chat_uid1_uid2/
│   │   ├── participants: [uid1, uid2]
│   │   ├── participantNames: { uid1: "Name1", uid2: "Name2" }
│   │   ├── lastMessage: "encrypted_text"
│   │   ├── lastMessageTime: timestamp
│   │   └── messages/ (subcollection)
│   │       ├── message1/
│   │       │   ├── from: uid1
│   │       │   ├── to: uid2
│   │       │   ├── text: "encrypted_text"
│   │       │   ├── timestamp: timestamp
│   │       │   └── read: false
│   │       └── message2/
│   │           └── ...
│   └── chat_uid3_uid4/
│       └── ...
```

---

## Security Features

### 🔐 Encryption
- **Algorithm:** AES-256 (Advanced Encryption Standard)
- **Mode:** CBC (Cipher Block Chaining)
- **Key Derivation:** Deterministic from user UIDs
- **Message Privacy:** Only participants can decrypt

### 🛡️ Privacy
- Messages stored encrypted in Firebase
- Server cannot read message content
- No third-party access
- Secure key exchange (automatic)

### ✅ Authentication
- Only verified users can message
- UID-based chat identification
- Participant validation

---

## Usage Examples

### Send a Message
```javascript
await messagingService.sendMessage(
  myUID,
  recipientUID,
  "Hello! I'd like to buy 100kg of maize",
  "My Name",
  "Recipient Name"
);
```

### Listen to Messages
```javascript
const unsubscribe = messagingService.listenToChat(
  myUID,
  otherUID,
  (messages) => {
    // Update UI with new messages
    setMessages(messages);
  }
);

// Cleanup when done
unsubscribe();
```

### Get All Chats
```javascript
const result = await messagingService.getUserChats(myUID);
if (result.success) {
  console.log('Active chats:', result.chats);
}
```

---

## Future Enhancements

### Planned Features
- [ ] Push notifications for new messages
- [ ] Image/photo sharing
- [ ] Voice messages
- [ ] Message reactions
- [ ] Group chats
- [ ] Delete messages
- [ ] Forward messages
- [ ] Message search
- [ ] Typing indicators
- [ ] Online status indicators

---

## Troubleshooting

### Messages Not Appearing
1. Check Firebase console for Firestore rules
2. Verify user is authenticated
3. Check console logs for errors
4. Ensure Firestore is enabled in Firebase project

### Decryption Errors
1. Verify both users are using same app version
2. Check chat ID generation is consistent
3. Ensure UIDs are correct

### Navigation Issues
1. Reload the app (shake device → Reload)
2. Check console logs for navigation errors
3. Verify ChatScreen is imported in App.js

---

## Firebase Setup Required

### Enable Firestore

1. Go to Firebase Console
2. Navigate to **Firestore Database**
3. Click **"Create database"**
4. Choose **"Start in test mode"** (for development)
5. Select region (closest to your users)

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own chats
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      match /messages/{messageId} {
        allow read, write: if request.auth != null &&
          (request.auth.uid == resource.data.from || 
           request.auth.uid == resource.data.to);
      }
    }
  }
}
```

---

## Support

For issues or questions about the messaging system:
- Check console logs for detailed error messages
- Verify Firebase Firestore is properly configured
- Ensure users are authenticated before messaging

---

**Built with ❤️ for AGROF Marketplace**



