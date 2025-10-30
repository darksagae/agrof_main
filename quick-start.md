# AGROF Auto-Start Guide

## 🚀 Quick Start Commands

### Option 1: One-Command Start (Recommended)
```bash
cd /home/darksagae/Desktop/agrof-auto
./start-agrof.sh
```

### Option 2: Direct Auto-Start
```bash
cd /home/darksagae/Desktop/agrof-auto/agrof-main/mobile/app
./auto-start.sh --web
```

### Option 3: NPM Scripts
```bash
cd /home/darksagae/Desktop/agrof-auto/agrof-main/mobile/app
npm run start:auto        # Web mode
npm run start:auto:mobile # Mobile mode
```

## 🌐 Access URLs

- **Web App**: http://localhost:19006
- **Mobile Dev**: http://localhost:8086

## 🔧 What Auto-Start Does

1. **Sets up file watchers** (fixes Metro bundler issues)
2. **Checks dependencies** (installs if needed)
3. **Kills conflicting processes** (cleans up ports)
4. **Starts the app** (web or mobile mode)
5. **Handles errors gracefully** (with helpful messages)

## 📱 Modes Available

- `--web`: Web version (default, port 19006)
- `--mobile`: Mobile development mode (port 8086)
- `--port X`: Custom port

## 🛠️ Troubleshooting

If you get file watchers errors:
```bash
sudo ./auto-start.sh --web
```

If ports are busy:
```bash
./auto-start.sh --web --port 3000
```

## ✅ Features Fixed

- ✅ **Auto-loading** - No manual intervention needed
- ✅ **File watchers** - Automatically increased limit
- ✅ **Port management** - Cleans up conflicting processes
- ✅ **Dependency check** - Installs if missing
- ✅ **Error handling** - Helpful error messages
- ✅ **Multiple modes** - Web and mobile support

