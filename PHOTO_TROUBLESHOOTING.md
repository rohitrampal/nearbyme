# Google Places Photos - Troubleshooting Guide

## Why Photos Might Not Be Visible

Google Places API photos require specific setup and permissions. Here's how to fix it:

## ✅ Required Setup

### 1. Enable Places API
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Navigate to **"APIs & Services" > "Library"**
- Search for **"Places API"** (not "Places API (New)")
- Click **"Enable"**

### 2. Check API Key Permissions
- Go to **"APIs & Services" > "Credentials"**
- Click on your API key
- Under **"API restrictions"**, make sure **"Places API"** is included
- If using restrictions, ensure **"Maps JavaScript API"** is also enabled

### 3. Verify Billing
- Photos require an active billing account
- Go to **"Billing"** in Google Cloud Console
- Ensure billing is enabled (free tier $200/month credit is usually enough)

## 🔍 Common Issues

### Issue 1: Photos Not Loading
**Symptoms**: Place cards show placeholder instead of images

**Solutions**:
1. Check browser console for errors (F12)
2. Verify Places API is enabled
3. Check if API key has Places API permission
4. Ensure billing is set up

### Issue 2: "Photo Reference Not Found"
**Symptoms**: Console shows photo reference errors

**Solutions**:
1. Some places don't have photos - this is normal
2. The app will show a placeholder icon
3. Try searching for popular places (restaurants, cafes) which usually have photos

### Issue 3: CORS Errors
**Symptoms**: Browser console shows CORS errors

**Solutions**:
1. Photos are loaded from Google's servers - CORS should be handled automatically
2. If issues persist, check API key restrictions
3. Make sure you're not blocking third-party images in browser settings

## 🧪 Testing

1. Open browser console (F12)
2. Search for places
3. Check for errors related to:
   - `place/photo`
   - `photo_reference`
   - API key errors
   - CORS errors

## 📝 API Requirements

For photos to work, you need:
- ✅ Places API enabled
- ✅ Valid API key with Places API access
- ✅ Active billing account
- ✅ API key not restricted from Places API

## 🔗 Useful Links

- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Places API Photos](https://developers.google.com/maps/documentation/places/web-service/photos)
- [Google Cloud Console](https://console.cloud.google.com/)

## 💡 Note

- Not all places have photos available
- Photos are provided by Google and business owners
- The app shows a placeholder icon when photos aren't available
- This is normal behavior and not an error

