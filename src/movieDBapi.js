export default class MovieDBapiService {
  apiKey = '0f0863b97ceac687ce7913524f736fe6'

  url = 'https://api.themoviedb.org/3/'

  imagesUrl = 'https://image.tmdb.org/t/p/original'

  static requestToken

  getMovies = async (query, page = 1) => {
    const searchQuery = `${this.url}search/movie?language=en-US&api_key=${this.apiKey}&query=${query}&page=${page}`
    const response = await fetch(searchQuery)
    if (!response.ok) {
      throw new Error(`Couldn't fetch ${query}, recieved ${response.status}`)
    }
    const data = await response.json()
    if (data.results.length === 0) throw new Error('No movies found!')
    return data
  }

  getGenres = async () => {
    const genresQuery = `${this.url}genre/movie/list?api_key=${this.apiKey}&language=en-US`
    const response = await fetch(genresQuery)
    if (!response.ok) {
      throw new Error(`Couldn't fetch genres, recieved ${response.status}`)
    }

    const body = await response.json()
    return body
  }

  getPoster = async (posterPath) => {
    const response = await fetch(`${this.imagesUrl}${posterPath}`)
    return response.json()
  }

  createGuestSession = async () => {
    const sessionQuery = `${this.url}authentication/guest_session/new?api_key=${this.apiKey}`
    const response = await fetch(sessionQuery)
    return response.json()
  }

  createRequestToken = async () => {
    const response = await fetch(`${this.url}authentication/token/new?api_key=${this.apiKey}`)

    return response.json()
  }

  rateMovie = async (rating, movieId, guestId) => {
    const ratingData = { value: rating }
    const rateQuery = `${this.url}movie/${movieId}/rating?api_key=${this.apiKey}$guest_session_id=${guestId}`
    const response = await fetch(rateQuery, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(ratingData),
    })
    if (!response.ok) {
      throw new Error(`Couldn't fetch rateMovie, recieved ${response.status}`)
    }
    return response.json()
  }

  getRatedMovies = async (guestId) => {
    const getRatedQuery = `${this.url}guest_session/${guestId}/rated/movies?api_key=${this.apiKey}`
    const response = await fetch(getRatedQuery)
    return response.json()
  }
}
