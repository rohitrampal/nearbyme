import React, { useState } from 'react'
import './LocationManager.css'

function LocationManager({ currentLocation, onLocationChange }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentLocations, setRecentLocations] = useState([])

  React.useEffect(() => {
    const recent = localStorage.getItem('recentLocations')
    if (recent) {
      setRecentLocations(JSON.parse(recent))
    }
  }, [])

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          onLocationChange(location)
          setShowDropdown(false)
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.')
          console.error('Error getting location:', error)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }

  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return

    if (!window.google || !window.google.maps) {
      alert('Google Maps is still loading. Please wait a moment and try again.')
      return
    }

    try {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address: searchQuery }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }
          onLocationChange(location)
          
          // Save to recent locations
          const updated = [
            { name: searchQuery, location },
            ...recentLocations.filter(loc => loc.name !== searchQuery)
          ].slice(0, 5)
          setRecentLocations(updated)
          localStorage.setItem('recentLocations', JSON.stringify(updated))
          
          setSearchQuery('')
          setShowDropdown(false)
        } else {
          alert('Location not found. Please try a different search.')
        }
      })
    } catch (error) {
      console.error('Error searching location:', error)
      alert('Error searching location. Please try again.')
    }
  }

  const handleRecentLocationClick = (location) => {
    onLocationChange(location.location)
    setShowDropdown(false)
  }

  return (
    <div className="location-manager">
      <button
        className="location-button"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Location"
        title="Change Location"
      >
        📍
      </button>

      {showDropdown && (
        <>
          <div
            className="dropdown-overlay"
            onClick={() => setShowDropdown(false)}
          />
          <div className="location-dropdown">
            <div className="dropdown-header">
              <h3>Change Location</h3>
              <button
                className="close-dropdown"
                onClick={() => setShowDropdown(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="dropdown-content">
              <button
                className="location-option primary"
                onClick={handleUseCurrentLocation}
              >
                <span className="option-icon">📍</span>
                <div>
                  <div className="option-title">Use Current Location</div>
                  <div className="option-subtitle">Detect automatically</div>
                </div>
              </button>

              <div className="search-section">
                <div className="search-input-group">
                  <input
                    type="text"
                    className="location-search-input"
                    placeholder="Search city or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                  />
                  <button
                    className="search-button"
                    onClick={handleLocationSearch}
                    aria-label="Search"
                  >
                    🔍
                  </button>
                </div>
              </div>

              {recentLocations.length > 0 && (
                <div className="recent-section">
                  <div className="section-title">Recent Locations</div>
                  {recentLocations.map((item, index) => (
                    <button
                      key={index}
                      className="location-option"
                      onClick={() => handleRecentLocationClick(item)}
                    >
                      <span className="option-icon">🕐</span>
                      <div>
                        <div className="option-title">{item.name}</div>
                        <div className="option-subtitle">
                          {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LocationManager

