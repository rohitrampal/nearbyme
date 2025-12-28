import React, { useState } from 'react'
import './PlacesList.css'

const ITEMS_PER_PAGE = 10

function PlacesList({ places, userLocation, onPlaceClick, isLoading, isFavorite, onToggleFavorite }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // Calculate pagination
  const totalPages = Math.ceil(places.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPlaces = places.slice(startIndex, endIndex)

  // Reset to page 1 when places change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [places.length])
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

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="places-list-container">
      <div className="places-list-header">
        <div className="header-top">
          <h2>Found {places.length} places</h2>
          <div className="view-toggle">
            <button
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>
        {places.length > ITEMS_PER_PAGE && (
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(endIndex, places.length)} of {places.length}
          </div>
        )}
      </div>
      <div className={`places-list ${viewMode}`}>
        {currentPlaces.map((place) => {
          const distance = calculateDistance(place.geometry.location)
          const photoUrl = place.photos?.[0] 
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
            : null
          const isOpen = place.opening_hours?.open_now

          return (
            <div
              key={place.place_id}
              className={`place-card ${photoUrl ? 'has-image' : ''}`}
              onClick={() => onPlaceClick(place)}
            >
              {photoUrl && (
                <div className="place-card-image">
                  <img src={photoUrl} alt={place.name} />
                  {/* Overlay with rating for grid view */}
                  {viewMode === 'grid' && place.rating && (
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <div className="overlay-rating">
                          {renderStars(place.rating)}
                          <span className="overlay-rating-value">{place.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  )}
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
                
                {/* Show rating in list view, hide in grid view (shown in overlay) */}
                {place.rating && viewMode === 'list' && (
                  <div className="rating-section">
                    {renderStars(place.rating)}
                  </div>
                )}
                
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
      
      {/* Pagination */}
      {places.length > ITEMS_PER_PAGE && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ← Previous
          </button>
          
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => goToPage(page)}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="pagination-ellipsis">...</span>
              }
              return null
            })}
          </div>
          
          <button
            className="pagination-button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default PlacesList

