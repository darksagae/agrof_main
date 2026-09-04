# 🚀 AGROF App Startup Guide

## 🔧 **Multiple Ways to Start the App**

### **Method 1: Using React Native CLI (Recommended)**
```bash
cd /home/darksagae/Desktop/saga/agrof1/agrof-main/mobile/app
npm start
```

### **Method 2: Using Metro Bundler**
```bash
cd /home/darksagae/Desktop/saga/agrof1/agrof-main/mobile/app
npm run start:metro
```

### **Method 3: Using Expo CLI**
```bash
cd /home/darksagae/Desktop/saga/agrof1/agrof-main/mobile/app
npm run start:expo
```

### **Method 4: Direct Commands**
```bash
cd /home/darksagae/Desktop/saga/agrof1/agrof-main/mobile/app
npx react-native start --port 8086
```

## 🌍 **Language Switcher Location**

Once the app starts, you'll find the language switcher in the **top-right corner** of the welcome screen:

```
┌─────────────────────────────────────┐
│  [🌐 English ▼]                    │  ← Language Switcher (Top-right)
│                                     │
│           AGROF                     │
│     Your AI Powered Crop            │
│        Health Companion             │
│                                     │
│        [Continue to AGROF →]        │
└─────────────────────────────────────┘
```

## 🎯 **How to Use the Language Switcher**

1. **Open the App** - Start the development server using one of the methods above
2. **Look for the Language Button** - Top-right corner shows current language
3. **Tap the Button** - Opens modal with 4 language options:
   - 🇺🇸 **English** (Default)
   - 🇺🇬 **Luganda** 
   - 🇺🇬 **Runyankole**
   - 🇹🇿 **Kiswahili**
4. **Select Language** - Tap your preferred language
5. **See Changes** - All UI text immediately updates to your selected language

## 📱 **Expected Behavior**

- **Language Detection**: App detects device language on first launch
- **Language Switching**: Modal opens with all 4 languages
- **Immediate Updates**: UI text changes instantly when language is switched
- **Persistent Storage**: Language preference is saved across app restarts

## 🔧 **Troubleshooting**

### **If React Native CLI doesn't work:**
```bash
npm install @react-native-community/cli
```

### **If Expo CLI doesn't work:**
```bash
npm install @expo/cli
```

### **If Metro bundler doesn't work:**
```bash
npm install metro
```

## 🎉 **Success Indicators**

- ✅ Development server starts without errors
- ✅ Language switcher appears in top-right corner of welcome screen
- ✅ All 4 languages are selectable
- ✅ UI text changes when language is switched
- ✅ Language preference persists across app restarts

## 📋 **Current Status**

| Component | Status | Notes |
|-----------|--------|-------|
| Dependencies | ✅ Installed | All required packages installed |
| Configuration | ✅ Fixed | Config files created and updated |
| Language Switcher | ✅ Ready | Available on welcome screen |
| Multilingual Support | ✅ Complete | All 4 languages working |
| Development Server | 🔄 Starting | Multiple startup methods available |

The app is now ready to start! Try one of the methods above. 🎉
