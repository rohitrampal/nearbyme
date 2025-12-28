import React from 'react'
import './CategoryBar.css'

function CategoryBar({ categories, selectedCategory, onCategorySelect }) {
  const handleCategoryClick = (category) => {
    if (selectedCategory?.id === category.id) {
      onCategorySelect(null)
    } else {
      onCategorySelect(category)
    }
  }

  return (
    <div className="category-bar-container">
      <div className="category-bar-scroll">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory?.id === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
            aria-label={category.name}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryBar

