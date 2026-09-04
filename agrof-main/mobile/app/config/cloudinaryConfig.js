// Cloudinary configuration for React Native
// For mobile apps, we use unsigned uploads with upload presets
// This is secure and doesn't expose API secrets in the mobile app

export const getCloudinaryConfig = () => ({
  cloud_name: 'dsr8twjxe', // Your Cloudinary cloud name
  upload_preset: 'agrof_uploads', // Create this in Cloudinary dashboard (Settings > Upload > Upload presets)
  secure: true // Use HTTPS
});