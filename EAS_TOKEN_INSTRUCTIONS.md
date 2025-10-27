# EAS Build Authentication Instructions

## Problem
You're experiencing network connectivity issues (`fetch failed`) when trying to authenticate with Expo using `npx eas login`. 

## Solution: Use an Access Token

### Step 1: Get Your Expo Access Token

1. Visit: https://expo.dev/accounts/agrof/settings/access-tokens
2. Click **"Create Token"**
3. Give it a name (e.g., "EAS Build CLI")
4. Copy the token that is displayed

### Step 2: Use the Token

You have two options:

#### Option A: Use the Setup Script (Interactive)
```bash
cd /home/darksagae/Desktop/agrof-auto
./eas-build-setup.sh
```

#### Option B: Set Environment Variable Manually
```bash
export EXPO_TOKEN="your-token-here"
cd /home/darksagae/Desktop/agrof-auto/agrof-main/mobile/app
npx eas build --platform android --profile preview
```

### Step 3: Optional - Make Token Permanent

To avoid setting the token every time, add it to your shell configuration:

```bash
echo 'export EXPO_TOKEN="your-token-here"' >> ~/.bashrc
source ~/.bashrc
```

## Alternative: Work Offline

If you just want to develop locally without building:
```bash
cd /home/darksagae/Desktop/agrof-auto/agrof-main/mobile/app
npx expo start --offline
```

## Your Project Info

- **Project ID**: `5078ace1-2ba3-4c26-8cfa-62c952a21a2c`
- **Owner**: agrof
- **Scope**: @agrof/agrof-crop-health
- **Status**: Signing keys already configured ✓

## Troubleshooting

If you still get "fetch failed" errors after setting the token, it means your network cannot reach Expo's API servers. In this case:

1. Try again later (could be temporary network issue)
2. Use a different network (mobile hotspot, etc.)
3. Consider using Expo's managed build service on a machine with better connectivity
