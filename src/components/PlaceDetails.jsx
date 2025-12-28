import React, { useState, useEffect } from 'react'
import './PlaceDetails.css'

function PlaceDetails({ place, userLocation, onClose, onGetDirections, isFavorite, onToggleFavorite }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showAllReviews, setShowAllReviews] = useState(false)

  const photos = place.photos || []
  const reviews = place.reviews || []
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  const formatPriceLevel = (level) => {
    if (!level) return 'Not specified'
    return '₹'.repeat(level)
  }

  const formatPhoneNumber = (phone) => {
    if (!phone) return null
    return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }

  const getPhotoUrl = (photoReference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
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
      </div>
    )
  }

  const formatOpeningHours = () => {
    if (!place.opening_hours?.weekday_text) return null
    return place.opening_hours.weekday_text
  }

  const handleShare = async () => {
    const url = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
    const text = `Check out ${place.name} at ${place.formatted_address || place.vicinity}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: text,
          url: url
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${text}\n${url}`)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="place-details-overlay" onClick={onClose}>
      <div className="place-details-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="photo-gallery">
            <img
              src={getPhotoUrl(photos[currentPhotoIndex].photo_reference)}
              alt={place.name}
              className="main-photo"
            />
            {photos.length > 1 && (
              <>
                <button
                  className="photo-nav prev"
                  onClick={() => setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  className="photo-nav next"
                  onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)}
                  aria-label="Next photo"
                >
                  ›
                </button>
                <div className="photo-indicator">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        )}

        <div className="place-details-content">
          {/* Header */}
          <div className="details-header">
            <div>
              <h2 className="place-title">{place.name}</h2>
              {place.rating && (
                <div className="details-rating">
                  {renderStars(place.rating)}
                  <span className="rating-text">
                    {place.rating.toFixed(1)} ({place.user_ratings_total || 0} reviews)
                  </span>
                </div>
              )}
            </div>
            <button
              className={`favorite-button-large ${isFavorite ? 'active' : ''}`}
              onClick={onToggleFavorite}
              aria-label="Toggle favorite"
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Status and Info */}
          <div className="details-info-grid">
            {place.opening_hours && (
              <div className="info-item">
                <span className="info-label">Status</span>
                <span
                  className={`status-badge ${place.opening_hours.open_now ? 'open' : 'closed'}`}
                >
                  {place.opening_hours.open_now ? '● Open Now' : '● Closed'}
                </span>
              </div>
            )}
            {place.price_level !== undefined && (
              <div className="info-item">
                <span className="info-label">Price Level</span>
                <span className="price-level">{formatPriceLevel(place.price_level)}</span>
              </div>
            )}
            {place.formatted_phone_number && (
              <div className="info-item">
                <span className="info-label">Phone</span>
                <a
                  href={`tel:${place.formatted_phone_number}`}
                  className="phone-link"
                >
                  {formatPhoneNumber(place.formatted_phone_number)}
                </a>
              </div>
            )}
          </div>

          {/* Address */}
          {(place.formatted_address || place.vicinity) && (
            <div className="details-section">
              <h3 className="section-title">📍 Address</h3>
              <p className="address-text">{place.formatted_address || place.vicinity}</p>
            </div>
          )}

          {/* Opening Hours */}
          {formatOpeningHours() && (
            <div className="details-section">
              <h3 className="section-title">🕐 Opening Hours</h3>
              <div className="opening-hours">
                {formatOpeningHours().map((day, index) => (
                  <div key={index} className="hours-row">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Website */}
          {place.website && (
            <div className="details-section">
              <h3 className="section-title">🌐 Website</h3>
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="website-link"
              >
                Visit Website →
              </a>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="details-section">
              <h3 className="section-title">💬 Reviews</h3>
              <div className="reviews-list">
                {displayedReviews.map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <div className="review-author">
                        {review.profile_photo_url && (
                          <img
                            src={review.profile_photo_url}
                            alt={review.author_name}
                            className="review-avatar"
                          />
                        )}
                        <div>
                          <div className="review-author-name">{review.author_name}</div>
                          {review.rating && (
                            <div className="review-rating">
                              {renderStars(review.rating)}
                            </div>
                          )}
                        </div>
                      </div>
                      {review.relative_time_description && (
                        <span className="review-time">{review.relative_time_description}</span>
                      )}
                    </div>
                    {review.text && (
                      <p className="review-text">{review.text}</p>
                    )}
                  </div>
                ))}
                {reviews.length > 3 && (
                  <button
                    className="show-more-button"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="details-actions">
            <button
              className="action-button secondary"
              onClick={handleShare}
            >
              📤 Share
            </button>
            {place.formatted_phone_number && (
              <a
                href={`tel:${place.formatted_phone_number}`}
                className="action-button secondary"
              >
                📞 Call
              </a>
            )}
            <button
              className="action-button primary"
              onClick={() => {
                if (onGetDirections && place.geometry?.location) {
                  onGetDirections(place.geometry.location)
                } else {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}`
                  window.open(url, '_blank')
                }
              }}
            >
              🧭 Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceDetails

