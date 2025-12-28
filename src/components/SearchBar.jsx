import React, { useState, useRef, useEffect } from 'react'
import './SearchBar.css'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [isListening, setIsListening] = useState(false)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = localStorage.getItem('recentSearches')
    if (recent) {
      setRecentSearches(JSON.parse(recent))
    }

    // Initialize voice recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        setIsListening(false)
        handleSearch(transcript)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.trim()) {
      // Simple autocomplete suggestions (can be enhanced with Google Places Autocomplete)
      const filtered = recentSearches.filter(search => 
        search.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    onSearch(searchQuery)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice search is not supported in your browser')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search places, restaurants, cafes..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => query && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {query && (
          <button
            className="clear-button"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <button
          className={`voice-button ${isListening ? 'listening' : ''}`}
          onClick={handleVoiceSearch}
          aria-label="Voice search"
          title="Voice search"
        >
          🎤
        </button>
      </div>

      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="suggestions-dropdown">
          {suggestions.length > 0 && (
            <>
              <div className="suggestions-header">Suggestions</div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">🔍</span>
                  {suggestion}
                </div>
              ))}
            </>
          )}
          {recentSearches.length > 0 && (
            <>
              <div className="suggestions-header">Recent Searches</div>
              {recentSearches.slice(0, 5).map((search, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(search)}
                >
                  <span className="suggestion-icon">🕐</span>
                  {search}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar

