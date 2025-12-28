# 🗺️ NearByMe

A modern web-based application that helps users discover nearby places and services using their current location. Built with React, Vite, and Google Maps API.

## ✨ Features

- 🗺️ **Interactive Google Map** - Full-screen map with real-time location tracking
- 🔍 **Smart Search** - Search by place name or type with autocomplete suggestions
- 🎤 **Voice Search** - Search using your voice (browser-supported)
- 📱 **Category Quick Access** - 9 categories: Restaurants, Hotels, Cafes, Petrol Pumps, Salons, Gyms, ATMs, EV Charging, Hospitals
- 📋 **List & Map Views** - Toggle between map and list views
- ⭐ **Place Details** - Comprehensive information including photos, reviews, hours, and more
- 🔍 **Advanced Filters** - Filter by distance, rating, price level, and open status
- 🧭 **Directions** - Get directions to any place with route visualization
- ❤️ **Favorites** - Save your favorite places locally
- 📍 **Location Management** - Search any location or use current location
- 📱 **Fully Responsive** - Mobile-first design that works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Google Maps API key (see [Setup Guide](./setupguide.md) for details)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nearbyme
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the sample file
cp .env.sample .env

# Edit .env and add your Google Maps API key
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:3000`

For detailed setup instructions, see [setupguide.md](./setupguide.md).

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Google Maps JavaScript API** - Map rendering and place data
- **Google Places API** - Place search and details
- **CSS3** - Styling with CSS variables and modern features

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
├── .env                     # Environment variables (not in git)
├── .env.sample              # Sample environment file
├── index.html
├── package.json
├── vite.config.js
├── setupguide.md            # Detailed setup instructions
└── README.md                # This file
```

## 🔑 Getting Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API
4. Create an API key in Credentials
5. Set up billing (free tier available)

See [setupguide.md](./setupguide.md) for detailed instructions.

## 🎯 Usage

1. **Allow Location Access**: Grant location permissions when prompted
2. **Browse Categories**: Click any category to see nearby places
3. **Search**: Use the search bar to find specific places
4. **View Details**: Click on any place to see full information
5. **Get Directions**: Click "Get Directions" to see routes
6. **Save Favorites**: Click the heart icon to save places
7. **Filter Results**: Use the filter button to refine searches

## 📱 Responsive Design

The app is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🔒 Security

- API keys are stored in `.env` (not committed to git)
- Local storage used for favorites and recent searches
- No user data is sent to external servers (except Google Maps API)

## 🐛 Troubleshooting

See the [Setup Guide](./setupguide.md) for common issues and solutions.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Maps Platform for APIs
- React team for the amazing framework
- Vite for the fast build tool

---

Made with ❤️ for discovering amazing places nearby!

