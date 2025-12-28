# NearByMe - Setup Guide

This guide will walk you through setting up and running the NearByMe application step by step.

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A Google Cloud account (for API keys)

## 🔑 Step 1: Get Google Maps API Key

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top
4. Click **"New Project"**
5. Enter a project name (e.g., "NearByMe")
6. Click **"Create"**

### 1.2 Enable Required APIs

1. In the Google Cloud Console, navigate to **"APIs & Services" > "Library"**
2. Search for and enable the following APIs:
   - **Maps JavaScript API** - For displaying the map
   - **Places API** - For searching and getting place details
   - **Geocoding API** - For converting addresses to coordinates
   - **Directions API** - For route planning (optional but recommended)

### 1.3 Create API Key

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials" > "API Key"**
3. Copy the generated API key
4. (Recommended) Click **"Restrict Key"** to secure your API key:
   - Under **"Application restrictions"**, select **"HTTP referrers"**
   - Add your domain (e.g., `http://localhost:3000/*` for development)
   - Under **"API restrictions"**, select **"Restrict key"**
   - Choose the APIs you enabled in step 1.2
   - Click **"Save"**

### 1.4 Set Up Billing (Required)

⚠️ **Important**: Google Maps APIs require a billing account, but they offer a free tier:
- $200 free credit per month
- This is usually enough for development and small applications

1. Go to **"Billing"** in the Google Cloud Console
2. Link a billing account (credit card required)
3. Don't worry - you won't be charged unless you exceed the free tier

## 🚀 Step 2: Set Up the Project

### 2.1 Clone or Download the Project

If you have the project files, navigate to the project directory:

```bash
cd nearbyme
```

### 2.2 Install Dependencies

Install all required packages using npm:

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

### 2.3 Configure Environment Variables

1. Create a `.env` file in the root directory of the project
2. Copy the contents from `.env.sample`:

```bash
# On Windows (PowerShell)
Copy-Item .env.sample .env

# On Mac/Linux
cp .env.sample .env
```

3. Open the `.env` file and replace `your_google_maps_api_key_here` with your actual Google Maps API key:

```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

## 🏃 Step 3: Run the Application

### 3.1 Start the Development Server

Run the following command:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will start on `http://localhost:3000` (or another port if 3000 is busy).

### 3.2 Open in Browser

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. Allow location access when prompted (required for the app to work)

## 🎯 Step 4: Using the Application

### First Time Setup

1. **Allow Location Access**: When you first open the app, your browser will ask for location permission. Click **"Allow"** to enable location-based features.

2. **Explore Categories**: Click on any category (Restaurants, Hotels, Cafes, etc.) to see nearby places.

3. **Search Places**: Use the search bar to find specific places or types of places.

4. **View Details**: Click on any place marker or card to see detailed information.

### Features to Try

- **Search**: Type in the search bar to find places
- **Categories**: Click category buttons to filter by type
- **Filters**: Click the filter icon to refine your search
- **List/Map View**: Toggle between map and list views
- **Favorites**: Click the heart icon to save places
- **Directions**: Click "Get Directions" to see routes
- **Location**: Click the location icon to change your search area

## 🏗️ Step 5: Build for Production

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
nearbyme/
├── src/
│   ├── components/          # React components
│   │   ├── SearchBar.jsx
│   │   ├── CategoryBar.jsx
│   │   ├── PlacesList.jsx
│   │   ├── PlaceDetails.jsx
│   │   ├── FiltersModal.jsx
│   │   └── LocationManager.jsx
│   ├── utils/               # Utility functions
│   │   ├── favoritesManager.js
│   │   └── googlePlacesAPI.js
│   ├── App.jsx              # Main app component
│   ├── App.css
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (create this)
├── .env.sample              # Sample environment file
├── index.html
├── package.json
├── vite.config.js
└── setupguide.md            # This file
```

## 🐛 Troubleshooting

### Issue: Map not loading

**Solution**: 
- Check that your API key is correctly set in `.env`
- Verify that "Maps JavaScript API" is enabled in Google Cloud Console
- Check browser console for error messages

### Issue: Places not showing

**Solution**:
- Ensure "Places API" is enabled in Google Cloud Console
- Check that your API key has Places API access
- Verify billing is set up (even if using free tier)

### Issue: Location not working

**Solution**:
- Allow location permissions in your browser
- Check that you're using HTTPS or localhost (required for geolocation)
- Try manually searching for a location using the location button

### Issue: API key errors

**Solution**:
- Verify the API key is correct (no extra spaces)
- Check API restrictions in Google Cloud Console
- Ensure all required APIs are enabled
- Verify billing account is linked

### Issue: Build errors

**Solution**:
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Check Node.js version (should be 16+)

## 🔒 Security Notes

1. **API Key Security**: 
   - Never commit your `.env` file
   - Restrict your API key to specific domains in production
   - Use different API keys for development and production

2. **Rate Limiting**:
   - Google Maps APIs have rate limits
   - Monitor your usage in Google Cloud Console
   - Implement caching if needed for production

## 📚 Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## 💡 Tips

1. **Development**: Use `localhost` for testing without API restrictions
2. **Testing**: Try different locations using the location search feature
3. **Performance**: The app uses local storage for favorites and recent searches
4. **Mobile**: Test on mobile devices for the best experience

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify all setup steps were completed correctly
3. Check Google Cloud Console for API status
4. Review the troubleshooting section above

---

**Happy Exploring! 🗺️**

