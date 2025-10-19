export default {
  expo: {
    name: "AGROF AI - Smart Crop Assistant",
    slug: "agrof-crop-health",
    version: "2.0.0",
    orientation: "portrait",
    icon: "./assets/robot-icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/robot-icon.png",
        backgroundColor: "#4CAF50"
      },
      package: "com.agrof.cropdiseasedetectormobile"
    },
    web: {
      favicon: "./assets/robot-icon.png"
    },
    extra: {
      eas: {
        projectId: "5078ace1-2ba3-4c26-8cfa-62c952a21a2c"
      }
    },
    owner: "agrof",
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {}
  }
};