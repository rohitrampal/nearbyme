const FAVORITES_KEY = 'nearbyme_favorites'

export const FavoritesManager = {
  getFavorites() {
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY)
      return favorites ? JSON.parse(favorites) : []
    } catch (error) {
      console.error('Error getting favorites:', error)
      return []
    }
  },

  addFavorite(place) {
    try {
      const favorites = this.getFavorites()
      const exists = favorites.some(fav => fav.place_id === place.place_id)
      
      if (!exists) {
        favorites.push({
          place_id: place.place_id,
          name: place.name,
          location: place.geometry?.location,
          rating: place.rating,
          photos: place.photos,
          vicinity: place.vicinity,
          formatted_address: place.formatted_address,
          addedAt: new Date().toISOString()
        })
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      }
      
      return favorites
    } catch (error) {
      console.error('Error adding favorite:', error)
      return this.getFavorites()
    }
  },

  removeFavorite(placeId) {
    try {
      const favorites = this.getFavorites()
      const filtered = favorites.filter(fav => fav.place_id !== placeId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
      return filtered
    } catch (error) {
      console.error('Error removing favorite:', error)
      return this.getFavorites()
    }
  },

  toggleFavorite(place) {
    const isFavorite = this.isFavorite(place.place_id)
    if (isFavorite) {
      return this.removeFavorite(place.place_id)
    } else {
      return this.addFavorite(place)
    }
  },

  isFavorite(placeId) {
    const favorites = this.getFavorites()
    return favorites.some(fav => fav.place_id === placeId)
  },

  clearFavorites() {
    try {
      localStorage.removeItem(FAVORITES_KEY)
      return []
    } catch (error) {
      console.error('Error clearing favorites:', error)
      return this.getFavorites()
    }
  }
}

export default FavoritesManager

