const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

if (!GOOGLE_PLACES_API_KEY) {
  console.warn('Google Maps API key is not set. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file')
}

export const searchNearbyPlaces = async (
  lat,
  lng,
  type = null,
  radius = 5000,
  minRating = 0,
  priceLevel = null,
  openNow = false,
  keyword = null
) => {
  try {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    )

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: radius,
      ...(type && { type: type }),
      ...(keyword && { keyword: keyword })
    }

    return new Promise((resolve, reject) => {
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          let filteredResults = results

          // Filter by rating
          if (minRating > 0) {
            filteredResults = filteredResults.filter(
              place => place.rating && place.rating >= minRating
            )
          }

          // Filter by price level
          if (priceLevel !== null) {
            filteredResults = filteredResults.filter(
              place => place.price_level === priceLevel
            )
          }

          // Filter by open now
          if (openNow) {
            filteredResults = filteredResults.filter(
              place => place.opening_hours?.open_now === true
            )
          }

          resolve(filteredResults)
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([])
        } else {
          reject(new Error(`Places search failed: ${status}`))
        }
      })
    })
  } catch (error) {
    console.error('Error searching nearby places:', error)
    throw error
  }
}

export const getPlaceDetails = async (placeId) => {
  try {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    )

    return new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId: placeId,
          fields: [
            'name',
            'rating',
            'formatted_phone_number',
            'formatted_address',
            'geometry',
            'photos',
            'reviews',
            'opening_hours',
            'website',
            'price_level',
            'user_ratings_total',
            'vicinity',
            'types'
          ]
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(place)
          } else {
            reject(new Error(`Place details request failed: ${status}`))
          }
        }
      )
    })
  } catch (error) {
    console.error('Error getting place details:', error)
    throw error
  }
}

export const getPlacePhotos = (photoReference, maxWidth = 400) => {
  if (!photoReference) return null
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`
}

export const autocompletePlaces = async (input, location = null) => {
  try {
    const service = new window.google.maps.places.AutocompleteService()
    
    return new Promise((resolve, reject) => {
      const request = {
        input: input,
        ...(location && {
          location: new window.google.maps.LatLng(location.lat, location.lng),
          radius: 5000
        })
      }

      service.getPlacePredictions(request, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(predictions || [])
        } else {
          resolve([])
        }
      })
    })
  } catch (error) {
    console.error('Error getting autocomplete suggestions:', error)
    return []
  }
}

export default {
  searchNearbyPlaces,
  getPlaceDetails,
  getPlacePhotos,
  autocompletePlaces
}

