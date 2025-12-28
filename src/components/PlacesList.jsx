import React from 'react'
import './PlacesList.css'

function PlacesList({ places, userLocation, onPlaceClick, isLoading, isFavorite, onToggleFavorite }) {
  const calculateDistance = (placeLocation) => {
    if (!userLocation) return null
    
    const R = 6371e3 // Earth's radius in meters
    const φ1 = userLocation.lat * Math.PI / 180
    const φ2 = placeLocation.lat * Math.PI / 180
    const Δφ = (placeLocation.lat - userLocation.lat) * Math.PI / 180
    const Δλ = (placeLocation.lng - userLocation.lng) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    const distance = R * c
    if (distance < 1000) {
      return `${Math.round(distance)}m`
    }
    return `${(distance / 1000).toFixed(1)}km`
  }

  const formatPriceLevel = (level) => {
    if (!level) return ''
    return '₹'.repeat(level)
  }

  const getStatusColor = (isOpen) => {
    return isOpen ? 'var(--secondary-color)' : 'var(--danger-color)'
  }

  const renderStars = (rating) => {
    if (!rating) return null
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="rating-stars">
        {Array(fullStars).fill(0).map((_, i) => (
          <span key={i}>⭐</span>
        ))}
        {hasHalfStar && <span>⭐</span>}
        {Array(emptyStars).fill(0).map((_, i) => (
          <span key={i} className="empty-star">☆</span>
        ))}
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="places-list-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Searching nearby places...</p>
        </div>
      </div>
    )
  }

  if (places.length === 0) {
    return (
      <div className="places-list-container">
        <div className="empty-state">
          <span className="empty-icon">📍</span>
          <p>No places found</p>
          <p className="empty-subtitle">Try adjusting your filters or search for a different area</p>
        </div>
      </div>
    )
  }

  return (
    <div className="places-list-container">
      <div className="places-list-header">
        <h2>Found {places.length} places</h2>
      </div>
      <div className="places-list">
        {places.map((place) => {
          const distance = calculateDistance(place.geometry.location)
          const photoUrl = place.photos?.[0] 
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
            : null
          const isOpen = place.opening_hours?.open_now

          return (
            <div
              key={place.place_id}
              className="place-card"
              onClick={() => onPlaceClick(place)}
            >
              {photoUrl && (
                <div className="place-card-image">
                  <img src={photoUrl} alt={place.name} />
                </div>
              )}
              <div className="place-card-content">
                <div className="place-card-header">
                  <h3 className="place-name">{place.name}</h3>
                  <button
                    className={`favorite-button ${isFavorite(place.place_id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFavorite(place)
                    }}
                    aria-label="Add to favorites"
                  >
                    {isFavorite(place.place_id) ? '❤️' : '🤍'}
                  </button>
                </div>
                
                {place.rating && renderStars(place.rating)}
                
                <div className="place-card-info">
                  {distance && (
                    <span className="info-item">
                      <span className="info-icon">📍</span>
                      {distance}
                    </span>
                  )}
                  {place.price_level !== undefined && (
                    <span className="info-item">
                      {formatPriceLevel(place.price_level)}
                    </span>
                  )}
                  <span 
                    className="info-item status"
                    style={{ color: getStatusColor(isOpen) }}
                  >
                    <span className="info-icon">●</span>
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>

                {place.vicinity && (
                  <p className="place-address">{place.vicinity}</p>
                )}

                <div className="place-card-actions">
                  <button
                    className="action-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (place.formatted_phone_number) {
                        window.location.href = `tel:${place.formatted_phone_number}`
                      }
                    }}
                    disabled={!place.formatted_phone_number}
                  >
                    📞 Call
                  </button>
                  <button
                    className="action-button primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}`
                      window.open(url, '_blank')
                    }}
                  >
                    🧭 Directions
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlacesList

