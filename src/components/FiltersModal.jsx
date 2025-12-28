import React, { useState } from 'react'
import './FiltersModal.css'

function FiltersModal({ filters, sortBy, onApply, onClose }) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [localSortBy, setLocalSortBy] = useState(sortBy)

  const radiusOptions = [
    { value: 500, label: '500m' },
    { value: 1000, label: '1km' },
    { value: 2000, label: '2km' },
    { value: 5000, label: '5km' },
    { value: 10000, label: '10km' }
  ]

  const ratingOptions = [
    { value: 0, label: 'Any Rating' },
    { value: 3, label: '3+ Stars' },
    { value: 4, label: '4+ Stars' },
    { value: 4.5, label: '4.5+ Stars' }
  ]

  const priceLevelOptions = [
    { value: null, label: 'Any Price' },
    { value: 1, label: '₹ - Budget' },
    { value: 2, label: '₹₹ - Moderate' },
    { value: 3, label: '₹₹₹ - Expensive' },
    { value: 4, label: '₹₹₹₹ - Very Expensive' }
  ]

  const sortOptions = [
    { value: 'distance', label: 'Distance' },
    { value: 'rating', label: 'Rating' },
    { value: 'popularity', label: 'Popularity' }
  ]

  const handleApply = () => {
    onApply(localFilters, localSortBy)
  }

  const handleReset = () => {
    const resetFilters = {
      radius: 5000,
      minRating: 0,
      priceLevel: null,
      openNow: false
    }
    setLocalFilters(resetFilters)
    setLocalSortBy('distance')
  }

  return (
    <div className="filters-modal-overlay" onClick={onClose}>
      <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filters-header">
          <h2>Filters & Sort</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="filters-content">
          {/* Distance Radius */}
          <div className="filter-section">
            <label className="filter-label">Distance Radius</label>
            <div className="radio-group">
              {radiusOptions.map((option) => (
                <label key={option.value} className="radio-option">
                  <input
                    type="radio"
                    name="radius"
                    value={option.value}
                    checked={localFilters.radius === option.value}
                    onChange={(e) => setLocalFilters({ ...localFilters, radius: Number(e.target.value) })}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-section">
            <label className="filter-label">Minimum Rating</label>
            <div className="radio-group">
              {ratingOptions.map((option) => (
                <label key={option.value} className="radio-option">
                  <input
                    type="radio"
                    name="rating"
                    value={option.value}
                    checked={localFilters.minRating === option.value}
                    onChange={(e) => setLocalFilters({ ...localFilters, minRating: Number(e.target.value) })}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Level */}
          <div className="filter-section">
            <label className="filter-label">Price Level</label>
            <div className="radio-group">
              {priceLevelOptions.map((option) => (
                <label key={option.value || 'any'} className="radio-option">
                  <input
                    type="radio"
                    name="priceLevel"
                    value={option.value || ''}
                    checked={localFilters.priceLevel === option.value}
                    onChange={(e) => setLocalFilters({ ...localFilters, priceLevel: e.target.value ? Number(e.target.value) : null })}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Open Now Toggle */}
          <div className="filter-section">
            <label className="toggle-option">
              <input
                type="checkbox"
                checked={localFilters.openNow}
                onChange={(e) => setLocalFilters({ ...localFilters, openNow: e.target.checked })}
              />
              <span className="toggle-label">Open Now Only</span>
            </label>
          </div>

          {/* Sort By */}
          <div className="filter-section">
            <label className="filter-label">Sort By</label>
            <div className="radio-group">
              {sortOptions.map((option) => (
                <label key={option.value} className="radio-option">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={localSortBy === option.value}
                    onChange={(e) => setLocalSortBy(e.target.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="filters-actions">
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
          <button className="apply-button" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FiltersModal

