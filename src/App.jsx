import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api'
import SearchBar from './components/SearchBar'
import CategoryBar from './components/CategoryBar'
import PlacesList from './components/PlacesList'
import PlaceDetails from './components/PlaceDetails'
import FiltersModal from './components/FiltersModal'
import LocationManager from './components/LocationManager'
import FavoritesManager from './utils/favoritesManager'
import { searchNearbyPlaces, getPlaceDetails, getPlacePhotos } from './utils/googlePlacesAPI'
import './App.css'

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
}

const categories = [
  { id: 'restaurant', name: 'Restaurants', icon: '🍽️', type: 'restaurant' },
  { id: 'lodging', name: 'Hotels', icon: '🏨', type: 'lodging' },
  { id: 'cafe', name: 'Cafes', icon: '☕', type: 'cafe' },
  { id: 'gas_station', name: 'Petrol Pumps', icon: '⛽', type: 'gas_station' },
  { id: 'beauty_salon', name: 'Salons', icon: '💇', type: 'beauty_salon' },
  { id: 'gym', name: 'Gyms', icon: '💪', type: 'gym' },
  { id: 'atm', name: 'ATMs', icon: '🏦', type: 'atm' },
  { id: 'charging_station', name: 'EV Charging', icon: '🔌', type: 'charging_station' },
  { id: 'hospital', name: 'Hospitals', icon: '🏥', type: 'hospital' }
]

function App() {
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [places, setPlaces] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [viewMode, setViewMode] = useState('map') // 'map' or 'list'
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    radius: 5000,
    minRating: 0,
    priceLevel: null,
    openNow: false
  })
  const [sortBy, setSortBy] = useState('distance')
  const [directions, setDirections] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [map, setMap] = useState(null)
  const [favorites, setFavorites] = useState(FavoritesManager.getFavorites())
  const [mapsLoaded, setMapsLoaded] = useState(false)
  const [mapsError, setMapsError] = useState(null)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation)
    }
  }, [userLocation])

  useEffect(() => {
    if (selectedCategory) {
      searchByCategory(selectedCategory)
    }
  }, [selectedCategory, filters, sortBy])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          setMapCenter(location)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Use default location if permission denied
          setUserLocation(defaultCenter)
        }
      )
    } else {
      setUserLocation(defaultCenter)
    }
  }

  const searchByCategory = async (category) => {
    if (!map) return
    
    setIsLoading(true)
    try {
      const center = userLocation || mapCenter
      const results = await searchNearbyPlaces(
        center.lat,
        center.lng,
        category.type,
        filters.radius,
        filters.minRating,
        filters.priceLevel,
        filters.openNow
      )
      
      // Sort results
      const sortedResults = sortPlaces(results, sortBy, center)
      setPlaces(sortedResults)
    } catch (error) {
      console.error('Error searching places:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query.trim()) return
    
    setSearchQuery(query)
    setIsLoading(true)
    try {
      const center = userLocation || mapCenter
      const results = await searchNearbyPlaces(
        center.lat,
        center.lng,
        null,
        filters.radius,
        filters.minRating,
        filters.priceLevel,
        filters.openNow,
        query
      )
      
      const sortedResults = sortPlaces(results, sortBy, center)
      setPlaces(sortedResults)
      setSelectedCategory(null)
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sortPlaces = (placesList, sortType, center) => {
    const sorted = [...placesList]
    
    switch (sortType) {
      case 'distance':
        return sorted.sort((a, b) => {
          const distA = calculateDistance(center, a.geometry.location)
          const distB = calculateDistance(center, b.geometry.location)
          return distA - distB
        })
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'popularity':
        return sorted.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0))
      default:
        return sorted
    }
  }

  const calculateDistance = (point1, point2) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = point1.lat * Math.PI / 180
    const φ2 = point2.lat * Math.PI / 180
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c
  }

  const handlePlaceClick = async (place) => {
    try {
      const details = await getPlaceDetails(place.place_id)
      setSelectedPlace(details)
    } catch (error) {
      console.error('Error fetching place details:', error)
      setSelectedPlace(place)
    }
  }

  const handleGetDirections = (destination) => {
    if (!userLocation) {
      alert('Please enable location services to get directions')
      return
    }

    const directionsService = new window.google.maps.DirectionsService()
    directionsService.route(
      {
        origin: userLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result)
        } else {
          console.error('Directions request failed:', status)
        }
      }
    )
  }

  const handleMapClick = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    setMapCenter(clickedLocation)
    if (selectedCategory) {
      searchByCategory(selectedCategory)
    }
  }

  const toggleFavorite = (place) => {
    const updatedFavorites = FavoritesManager.toggleFavorite(place)
    setFavorites(updatedFavorites)
  }

  const isFavorite = (placeId) => {
    return FavoritesManager.isFavorite(placeId)
  }

  const handleLocationChange = (location) => {
    setMapCenter(location)
    setUserLocation(location)
    if (selectedCategory) {
      searchByCategory(selectedCategory)
    }
  }

  const applyFilters = (newFilters, newSortBy) => {
    setFilters(newFilters)
    setSortBy(newSortBy)
    setShowFilters(false)
  }

  const getMarkerIcon = (category) => {
    const colors = {
      restaurant: '#ef4444',
      lodging: '#3b82f6',
      cafe: '#f59e0b',
      gas_station: '#10b981',
      beauty_salon: '#ec4899',
      gym: '#8b5cf6',
      atm: '#6366f1',
      charging_station: '#14b8a6',
      hospital: '#dc2626'
    }
    return colors[category] || '#6b7280'
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
        <h1 style={{ color: 'var(--danger-color)', fontSize: '1.5rem' }}>⚠️ API Key Missing</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '500px' }}>
          Please set your Google Maps API key in the <code>.env</code> file.
          <br />
          See <code>setupguide.md</code> for instructions.
        </p>
      </div>
    )
  }

  return (
    <LoadScript 
      googleMapsApiKey={apiKey} 
      libraries={['places']}
      onLoad={() => {
        setMapsLoaded(true)
        setMapsError(null)
      }}
      onError={(error) => {
        console.error('Error loading Google Maps:', error)
        setMapsError('Failed to load Google Maps. Please check your API key and internet connection.')
        setMapsLoaded(false)
      }}
    >
      {mapsError ? (
        <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
          <h1 style={{ color: 'var(--danger-color)', fontSize: '1.5rem' }}>⚠️ Error Loading Maps</h1>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '500px' }}>
            {mapsError}
            <br />
            <br />
            Please check:
            <br />
            1. Your API key is correct in .env file
            <br />
            2. Required APIs are enabled in Google Cloud Console
            <br />
            3. Your internet connection is working
          </p>
        </div>
      ) : !mapsLoaded ? (
        <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
          <div className="spinner" style={{ width: '48px', height: '48px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading Google Maps...</p>
        </div>
      ) : (
        <div className="app-container">
          {/* Header */}
          <header className="app-header">
            <div className="header-content">
              <h1 className="app-title">NearByMe</h1>
              <div className="header-actions">
                <LocationManager
                  currentLocation={userLocation}
                  onLocationChange={handleLocationChange}
                />
                <button
                  className="icon-button"
                  onClick={() => setShowFilters(true)}
                  aria-label="Filters"
                >
                  🔍
                </button>
                <button
                  className="icon-button"
                  onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                  aria-label="Toggle View"
                >
                  {viewMode === 'map' ? '📋' : '🗺️'}
                </button>
              </div>
            </div>
            <SearchBar onSearch={handleSearch} />
            <CategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </header>

          {/* Main Content */}
          <main className="app-main">
            {/* Map View */}
            {viewMode === 'map' && mapsLoaded && window.google && window.google.maps && (
              <div className="map-container">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={15}
                  onClick={handleMapClick}
                  onLoad={(map) => {
                    setMap(map)
                    console.log('Google Map loaded successfully')
                  }}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true
                  }}
                >
                  {/* User Location Marker */}
                  {userLocation && window.google && window.google.maps && (
                    <Marker
                      position={userLocation}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#2563eb',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                      }}
                      title="Your Location"
                    />
                  )}

                  {/* Places Markers */}
                  {places.map((place) => (
                    <Marker
                      key={place.place_id}
                      position={place.geometry.location}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 6,
                        fillColor: selectedCategory ? getMarkerIcon(selectedCategory.type) : '#6b7280',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                      }}
                      onClick={() => handlePlaceClick(place)}
                      title={place.name}
                    />
                  ))}

                  {/* Directions */}
                  {directions && (
                    <DirectionsRenderer directions={directions} />
                  )}
                </GoogleMap>
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <PlacesList
                places={places}
                userLocation={userLocation || mapCenter}
                onPlaceClick={handlePlaceClick}
                isLoading={isLoading}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            )}

            {/* Place Details Panel */}
            {selectedPlace && (
              <PlaceDetails
                place={selectedPlace}
                userLocation={userLocation}
                onClose={() => setSelectedPlace(null)}
                onGetDirections={handleGetDirections}
                isFavorite={isFavorite(selectedPlace.place_id)}
                onToggleFavorite={() => toggleFavorite(selectedPlace)}
              />
            )}

            {/* Filters Modal */}
            {showFilters && (
              <FiltersModal
                filters={filters}
                sortBy={sortBy}
                onApply={applyFilters}
                onClose={() => setShowFilters(false)}
              />
            )}
          </main>
        </div>
      )}
    </LoadScript>
  )
}

export default App

