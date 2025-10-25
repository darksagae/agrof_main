# 📊 PROJECT SIZE ANALYSIS

## 🗂️ TOTAL PROJECT SIZE: 1.8 GB

### **Breakdown:**

```
agrof-main/
├── mobile/app/              1.6 GB  (Mobile app)
│   ├── node_modules/        1.5 GB  (Dependencies - not deployed)
│   ├── assets/              86 MB   (Images, icons, models)
│   │   └── models/          5.8 MB  (TFLite model)
│   ├── services/            456 KB  (Business logic)
│   ├── screens/             440 KB  (UI screens)
│   └── data/                52 KB   (Metadata, labels)
│
└── src/                     214 MB  (Backend API)
    └── api/                 ~50 MB  (Flask backend code)
```

---

## 📱 MOBILE APP SIZE

### **Development (With node_modules):**
- **Total**: 1.6 GB
- **node_modules**: 1.5 GB (not included in final app)

### **Production (Built .apk/.ipa):**
- **Estimated**: 40-60 MB
- **Includes**:
  - App code: ~5 MB
  - TFLite model: 5.8 MB
  - Assets (images, icons): ~20-30 MB
  - React Native runtime: ~15 MB

### **Your TFLite Model:**
- **Size**: 5.8 MB ✅ (Perfect for mobile!)
- **Classes**: 20 diseases
- **Crops**: 5 (Beans, Coffee, Tomato, Potato, Pepper)

---

## 🖥️ BACKEND API SIZE

### **Backend Code:**
- **Total**: ~50 MB (without dependencies)
- **With Python packages**: ~200-300 MB

### **What's in Backend:**
- Flask API code
- Database models
- Authentication
- Store/Market APIs
- File uploads

---

## ☁️ DEPLOYMENT SIZE COMPARISON

### **STI Server Limits (Coolify):**
```
CPU: 2 vCPU
RAM: 2048 MB (2 GB)
Disk: 100 GB
```

### **Backend Deployment (Coolify on STI):**
```
Source code:          ~50 MB
Python dependencies:  ~250 MB
Database (PostgreSQL): ~1-5 GB (grows with data)
File uploads:         Variable (user images)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total estimate:       ~2-10 GB
```

✅ **Fits comfortably in 100 GB disk!**

---

### **Mobile App (EAS Build):**
```
Built .apk file:      40-60 MB
User installs on phone (not on server)
```

**STI server impact**: ✅ ZERO (app is on users' phones!)

---

## 🎯 WHAT TO DEPLOY WHERE

### **ON STI SERVER (Coolify):**

**Deploy Backend Only:**
```
agrof-main/src/api/          ← Flask backend
├── app.py
├── requirements.txt
├── database/
└── migrations/

Estimated disk usage: ~5-10 GB
Within 100 GB limit: ✅ YES!
```

**Don't Deploy:**
❌ `agrof-main/mobile/app/` (this goes to EAS Build)
❌ `node_modules/` (too large, not needed on server)
❌ TFLite model on server (it's for mobile, not backend)

---

### **ON EAS BUILD (Mobile Distribution):**

**Build Mobile App:**
```
agrof-main/mobile/app/
├── Source code (5 MB)
├── TFLite model (5.8 MB)
├── Assets (20-30 MB)
└── React Native runtime (15 MB)

Final .apk: ~40-60 MB
Users install on phones
```

---

## 💰 COST & RESOURCE IMPACT

### **STI Server (100 GB Disk):**

| Component | Size | Percentage |
|-----------|------|------------|
| Backend code | 50 MB | 0.05% |
| Python packages | 250 MB | 0.25% |
| PostgreSQL | 1-5 GB | 1-5% |
| File uploads | 1-10 GB | 1-10% |
| **TOTAL** | **2-15 GB** | **2-15%** |
| **Available** | **85-98 GB** | **85-98%** |

✅ **Plenty of space!**

### **Mobile App (User's Phone):**

| Component | Size |
|-----------|------|
| Installed app | 40-60 MB |
| Offline database | 1-10 MB |
| Cached images | 10-50 MB |
| **TOTAL** | **~100 MB** |

---

## 🚀 DEPLOYMENT STRATEGY

### **RECOMMENDED ORDER:**

**Step 1: Deploy Backend to STI** (Priority 1)
```bash
# Via Coolify on STI server
- Deploy Flask backend
- Setup PostgreSQL
- Configure environment
- Test APIs work

Time: 1-2 days
Disk usage: ~5 GB
```

**Step 2: Test Backend** (Verify)
```bash
# Test endpoints
curl https://api.agrof.sti.ac.ug/health
curl https://api.agrof.sti.ac.ug/store/products
```

**Step 3: Build Mobile App** (After backend works)
```bash
# Via EAS Build
eas build --platform android

Time: 20-30 minutes
Result: .apk file (40-60 MB)
```

**Step 4: Distribute App**
```
- Share .apk with test users
- Or submit to Play Store
- Users install on phones
```

---

## ✅ FINAL ANSWER

### **Deploy to Coolify?**
**YES** - But **ONLY the backend** (`agrof-main/src/api/`)

### **Use EAS Build?**
**YES** - For **mobile app** (`agrof-main/mobile/app/`)

### **Which first?**
**Backend first (Coolify)**, then mobile app (EAS)

### **Will it fit on STI?**
**YES!** Backend only needs ~5-10 GB (you have 100 GB)

---

## 🎯 RECOMMENDATION

**Start with backend deployment to Coolify:**
1. Much easier
2. No mobile complexities
3. Can test APIs immediately
4. Mobile app can use Gemini AI while you build with EAS

**Then build mobile app with EAS:**
1. After backend is stable
2. Configure API endpoints
3. Build .apk with TFLite
4. Distribute to users

**Want me to help deploy the backend to Coolify on STI first?** 🚀
