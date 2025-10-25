# 📱 WhatsApp News Management Guide

## 🎯 Quick Reference

All news management is done through **WhatsApp** by the admin. No need to access the database directly!

---

## 📰 ADD NEW NEWS

### **Method 1: Quick Format** (Recommended)

**Syntax:**
```
#addnews <type> <priority>
<Title>
<Message>
```

**Example 1 - Fraud Alert:**
```
#addnews fraud urgent
Fake DAP Fertilizer in Kampala
Ministry of Agriculture warns farmers about counterfeit DAP fertilizer circulating in Kampala markets. Check for authentic YARA or Dangote seals. Buy only from registered dealers like AGROF.
```

**Example 2 - Price Update:**
```
#addnews price high
Urea Fertilizer Price Reduced
Great news! Urea fertilizer price has dropped from UGX 41,000 to UGX 35,000 per 50kg bag. Limited stock available. Buy now to save!
```

**Example 3 - Disease Alert:**
```
#addnews disease urgent
Fall Armyworm Outbreak - Eastern Uganda
Fall armyworm detected in maize fields. Immediate spraying required. Use Lambda-cyhalothrin or Dimethoate. Spray early morning or evening for best results.
```

**Example 4 - Weather Advisory:**
```
#addnews weather high
Good Planting Window This Week
Weather forecast shows consistent rainfall expected for the next 7 days. Ideal time for planting maize, beans, and early tomatoes. Prepare your land now!
```

**Example 5 - Research/General:**
```
#addnews research medium
New High-Yield Tomato Variety
NARO has released Maxim F2 tomato variety with 30% higher yield and better disease resistance. Now available at AGROF stores.
```

### **Bot Response:**
```
✅ NEWS CREATED!

⚠️ Fake DAP Fertilizer in Kampala
ID: 6
Type: fraud
Priority: urgent
Location: National

This news will now appear in the mobile app for all farmers!
```

---

### **Method 2: Detailed Format** (More Control)

**Syntax:**
```
Type: <type>
Priority: <priority>
Title: <title>
Message: <message>
Location: <location>
```

**Example:**
```
Type: price
Priority: high
Title: Maize Seeds 20% Discount
Message: Special offer this week only! All maize seeds 20% off. SC Duma 43 now UGX 20,000 (was UGX 25,000). Namuche 3 also on sale. Visit AGROF store or order via WhatsApp.
Location: National
```

---

## 🗑️ DELETE/REMOVE OLD NEWS

### **Command:**
```
#deletenews <id>
```

### **Example:**
```
#deletenews 6
```

### **Bot Response:**
```
✅ News article #6 deleted successfully!
```

**What happens:**
- News is archived (not actually deleted)
- Status changed to "archived"
- No longer appears in mobile app
- Can be recovered if needed

---

## ✅ MARK NEWS AS RESOLVED

For fraud alerts or disease outbreaks that have been resolved:

### **Command:**
```
#resolvenews <id>
```

### **Example:**
```
#resolvenews 3
```

### **Bot Response:**
```
✅ News #3 marked as resolved!
```

**What happens:**
- Status changed to "resolved"
- No longer shows as urgent
- Users can still see it in history
- Good for transparency

---

## 📋 VIEW ALL NEWS

### **Command:**
```
#listnews
```

### **Bot Response:**
```
📰 RECENT NEWS

1. ⚠️ Fake DAP Fertilizer Alert
   ID: 1 | URGENT | Central
   Ministry warns against counterfeit...

2. 💰 Urea Price Reduced
   ID: 2 | HIGH | National
   Urea now UGX 35,000...

3. 🦠 Fall Armyworm Alert - Maize
   ID: 3 | URGENT | Eastern
   Fall armyworm detected...

4. 🌧️ Good Planting Window
   ID: 4 | HIGH | National
   Weather forecast shows...

5. 📚 New Tomato Variety
   ID: 5 | MEDIUM | National
   NARO releases Maxim F2...

Commands:
#deletenews <id>
#resolvenews <id>
```

---

## 🎯 NEWS TYPES

| Type | Icon | Use For |
|------|------|---------|
| `fraud` | ⚠️ | Fake products, scams, counterfeit alerts |
| `price` | 💰 | Price changes, discounts, special offers |
| `disease` | 🦠 | Disease outbreaks, pest alerts, treatment advice |
| `weather` | 🌧️ | Weather advisories, planting windows, drought warnings |
| `research` | 📚 | New varieties, farming techniques, research updates |
| `general` | 📰 | General agricultural news |

---

## 🚨 PRIORITY LEVELS

| Priority | Color | When to Use |
|----------|-------|-------------|
| `urgent` | 🔴 Red | Immediate action needed (fraud, disease outbreak) |
| `high` | 🟠 Orange | Important (price changes, weather alerts) |
| `medium` | 🔵 Blue | Normal updates (new products, research) |
| `low` | 🟢 Green | General information |

---

## 📍 LOCATIONS

| Location | Covers |
|----------|--------|
| `National` | All of Uganda (shown to everyone) |
| `Central` | Kampala, Wakiso, Mukono, etc. |
| `Eastern` | Mbale, Jinja, Soroti, etc. |
| `Western` | Mbarara, Kasese, Fort Portal, etc. |
| `Northern` | Gulu, Lira, Arua, etc. |

---

## 🔄 COMPLETE WORKFLOW

### **Scenario 1: Fake Fertilizer Detected**

**Step 1 - Admin Posts Alert:**
```
WhatsApp (Admin):
#addnews fraud urgent
Fake DAP Fertilizer in Kampala
Ministry of Agriculture warns about counterfeit DAP with yellow packaging instead of green. Do not buy from street vendors. Buy only from AGROF or registered dealers.
```

**Step 2 - Bot Confirms:**
```
WhatsApp Bot:
✅ NEWS CREATED!

⚠️ Fake DAP Fertilizer in Kampala
ID: 6
Type: fraud
Priority: urgent
Location: National

This news will now appear in the mobile app for all farmers!
```

**Step 3 - Farmers See It:**
```
Mobile App:
[📰 6] ← Red floating button (urgent)

Tap to expand:
┌──────────────────────────────┐
│ ⚠️ Fake DAP Fertilizer       │
│    Ministry warns about...    │
│    2 hours ago                │
└──────────────────────────────┘
```

**Step 4 - Problem Resolved:**
```
WhatsApp (Admin):
#resolvenews 6

Bot:
✅ News #6 marked as resolved!
```

---

### **Scenario 2: Price Change**

**Step 1 - Update Price in Store:**
```
Admin updates Urea price: UGX 41,000 → UGX 35,000
```

**Step 2 - Post News:**
```
WhatsApp (Admin):
#addnews price high
Urea Price Reduced by 15%
Great news for farmers! Urea fertilizer price reduced from UGX 41,000 to UGX 35,000 per 50kg bag. Save UGX 6,000 per bag. Limited stock available!
```

**Step 3 - Farmers See & Buy:**
```
Mobile App shows:
💰 Urea Price Reduced
   Now UGX 35,000 (was 41,000)
   [Buy Now in Store] ← Takes to product
```

---

### **Scenario 3: Remove Outdated News**

**Check what news exists:**
```
WhatsApp (Admin):
#listnews
```

**Delete old news:**
```
WhatsApp (Admin):
#deletenews 2
#deletenews 5
#deletenews 7
```

**Bot confirms each:**
```
✅ News article #2 deleted successfully!
✅ News article #5 deleted successfully!
✅ News article #7 deleted successfully!
```

---

## 📱 ADMIN HELP COMMAND

**To see all commands in WhatsApp:**
```
admin help
```

**Bot shows:**
```
🔧 ADMIN COMMANDS

NEWS MANAGEMENT:
#addnews - Create news article
#listnews - View all news
#deletenews <id> - Delete news
#resolvenews <id> - Mark as resolved

QUICK NEWS FORMAT:
#addnews fraud urgent
Fake Fertilizer Alert
Ministry warns...

FULL NEWS FORMAT:
Type: price
Priority: high
Title: Urea Price Reduced
Message: Urea now UGX 35,000
Location: National

NEWS TYPES:
• fraud - Fake products/scams
• price - Price changes
• disease - Disease outbreaks
• weather - Weather advisories
• research - New research/varieties
• general - General news

PRIORITIES:
• urgent - Immediate action needed
• high - Important
• medium - Normal
• low - Informational
```

---

## 🎯 BEST PRACTICES

### **When to Post News:**

✅ **Post Immediately:**
- Fraud alerts (fake products)
- Disease outbreaks (urgent treatment needed)
- Severe weather warnings
- Critical price changes

✅ **Post Regularly:**
- Weekly price updates
- New product arrivals
- Planting season reminders
- Agricultural tips

✅ **Don't Over-Post:**
- Max 3-5 news per day
- Remove old/outdated news weekly
- Keep news relevant and timely

### **Writing Good News:**

**Good Example:**
```
Title: Fall Armyworm Alert - Maize Farmers
Message: Fall armyworm detected in Eastern Uganda maize fields. Immediate spraying required. Use Lambda-cyhalothrin or Dimethoate insecticides. Spray in early morning or evening. Products available at AGROF.
```

**Bad Example:**
```
Title: Alert
Message: Problem with crops. Spray something.
```

**Tips:**
- ✅ Be specific
- ✅ Provide actionable advice
- ✅ Mention AGROF products when relevant
- ✅ Include location if region-specific
- ✅ Keep message clear and concise

---

## 🗄️ DATABASE MANAGEMENT (Optional)

### **View News Directly in Database:**
```bash
sudo docker exec agrof-auto-store-backend-1 node -e "
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/app/store.db');
db.all('SELECT id, type, priority, title, status FROM agricultural_news ORDER BY created_at DESC LIMIT 10', 
  (err, rows) => {
    console.table(rows);
    db.close();
  }
);
"
```

### **Bulk Delete Old News:**
```bash
# Delete news older than 30 days
sudo docker exec agrof-auto-store-backend-1 node -e "
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/app/store.db');
db.run(
  \"UPDATE agricultural_news SET status = 'archived' WHERE created_at < datetime('now', '-30 days')\",
  function(err) {
    console.log('Archived ' + this.changes + ' old news articles');
    db.close();
  }
);
"
```

---

## 📊 NEWS STATISTICS

### **Check News Count:**
```bash
curl -s "http://192.168.1.15:3001/api/news?limit=100" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f'Total active news: {len(data)}')

# Count by type
types = {}
for item in data:
    t = item['type']
    types[t] = types.get(t, 0) + 1

print('\nBy type:')
for t, count in types.items():
    print(f'  {t}: {count}')
"
```

---

## 🚀 QUICK COMMAND REFERENCE

| Action | Command | Example |
|--------|---------|---------|
| **Add News** | `#addnews <type> <priority>` | `#addnews fraud urgent` |
| **List News** | `#listnews` | `#listnews` |
| **Delete News** | `#deletenews <id>` | `#deletenews 123` |
| **Resolve News** | `#resolvenews <id>` | `#resolvenews 123` |
| **Help** | `admin help` | `admin help` |

---

## 💡 COMMON SCENARIOS

### **Weekly Price Update:**
```
Every Monday:

#addnews price medium
Weekly Price Update - Fertilizers
Current prices: DAP UGX 50,000, Urea UGX 35,000, NPK UGX 45,000. Prices valid until Friday. Order in bulk for discounts.
```

### **New Product Launch:**
```
#addnews general high
New Product: Maxim F2 Tomato Seeds
We now stock the new Maxim F2 tomato variety with 30% higher yield and better disease resistance. Available in 10g and 25g packs. Order now!
```

### **Seasonal Reminder:**
```
#addnews weather high
Planting Season Starting
This is the ideal time to plant your first season crops. Maize, beans, and tomatoes recommended. Rainfall forecast looks good for the next 2 months.
```

### **Cleaning Up Old News:**
```
#listnews
(See list with IDs)

#deletenews 1
#deletenews 3
#deletenews 5
(Remove outdated news)
```

---

## 🛠️ TROUBLESHOOTING

### **Problem: Bot doesn't respond to commands**

**Check 1 - Is your number admin?**
```bash
# Check environment variable
cat /home/darksagae/Desktop/agrof-auto/whatsapp-bot/.env | grep ADMIN_NUMBERS
```

**Solution:** Add your number to ADMIN_NUMBERS in `.env`

**Check 2 - Is bot running?**
```bash
# Check if WhatsApp bot is running
ps aux | grep "node.*bot.js"
```

**Solution:** Start the bot
```bash
cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot
npm start
```

---

### **Problem: News doesn't appear in mobile app**

**Check 1 - Is news in database?**
```bash
curl -s "http://192.168.1.15:3001/api/news?limit=5" | python3 -m json.tool
```

**Check 2 - Is store-backend running?**
```bash
sudo docker ps | grep store-backend
```

**Check 3 - Reload mobile app**
- Shake device → Reload
- Or close and reopen app

---

## 📝 NEWS MANAGEMENT SCHEDULE

### **Recommended Routine:**

**Daily:**
- Check for urgent alerts (fraud, disease)
- Post any critical updates
- Respond to farmer inquiries

**Weekly:**
- Post price updates (Monday)
- Review and delete old news (Friday)
- Post planting reminders (seasonal)

**Monthly:**
- Clean up all resolved/outdated news
- Post research updates
- Share success stories

**As Needed:**
- Fraud alerts (immediate)
- Disease outbreaks (immediate)
- Weather warnings (immediate)
- New product launches
- Special promotions

---

## 🎯 EXAMPLE: WEEK 1 NEWS MANAGEMENT

**Monday Morning:**
```
#addnews price medium
Weekly Price Update
Current fertilizer prices: DAP UGX 50K, Urea UGX 35K, NPK UGX 45K. Valid until Friday.
```

**Tuesday - Fraud Detected:**
```
#addnews fraud urgent
Fake Pesticide Warning
Counterfeit Lambda-cyhalothrin detected. Check for hologram seal. Buy from AGROF only.
```

**Wednesday - Weather Alert:**
```
#addnews weather high
Heavy Rains Expected
Delay planting until Friday. Current crops may need drainage support.
```

**Friday - Remove Old News:**
```
#listnews
(Check old news)

#deletenews 10
#deletenews 11
#deletenews 12
(Remove news from 2+ weeks ago)
```

**Friday - Fraud Resolved:**
```
#resolvenews 8
(Fake pesticide issue resolved, dealers arrested)
```

---

## 💼 ADMIN RESPONSIBILITIES

### **News Quality:**
- ✅ Verify information before posting
- ✅ Use official sources (Ministry, NARO, etc.)
- ✅ Write clear, actionable messages
- ✅ Include AGROF product references when relevant

### **Timeliness:**
- ✅ Post urgent alerts immediately
- ✅ Regular price updates
- ✅ Remove outdated information
- ✅ Keep news fresh (< 2 weeks old)

### **Compliance:**
- ✅ Don't post false information
- ✅ Cite sources
- ✅ Don't spam farmers
- ✅ Respect farmer privacy

---

## 🔍 CHECKING NEWS REACH

### **How many farmers saw the news:**
```bash
# Check views count (if implemented)
curl -s "http://192.168.1.15:3001/api/news" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for item in data:
    print(f'{item[\"title\"]}: {item.get(\"views\", 0)} views')
"
```

---

## 📞 SUPPORT

### **Questions:**
1. **What happens to deleted news?**
   - Changed to "archived" status
   - Not shown in app
   - Remains in database for records

2. **Can I edit existing news?**
   - Not directly via WhatsApp
   - Delete old one, create new one
   - Or update via database

3. **How long does news stay?**
   - Until you delete it
   - Recommend: Keep recent (< 2 weeks)
   - Auto-archive after 30 days (optional)

4. **Can I schedule news?**
   - Not currently
   - Post manually when needed
   - Or use cron job for recurring

---

## ✅ SUMMARY

**To Add News:**
```
#addnews fraud urgent
Title Here
Message here...
```

**To Delete News:**
```
#listnews (see ID)
#deletenews 123
```

**To Resolve:**
```
#resolvenews 123
```

**To See All:**
```
#listnews
```

**That's it!** Simple WhatsApp commands manage all agricultural news for your entire farmer community! 🎉

---

**Date:** October 18, 2025  
**System:** AGROF WhatsApp News Management  
**Status:** ✅ Fully Operational

