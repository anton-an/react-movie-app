import 'antd/dist/antd.css'
import './App.css'
import React from 'react'
import { Tabs } from 'antd'
import { debounce } from 'lodash'

import SearchPage from '../SearchPage'
import MovieDBapiService from '../../movieDBapi'
import { GenresProvider } from '../GenresContext/GenresContext'
import RatedPage from '../RatedPage'

export default class App extends React.Component {
  state = {
    moviesData: null,
    genresData: null,
    ratedMovies: null,
    error: null,
    loading: false,
    totalMovies: 0,
    searchQuery: '',
  }

  moviedbService = new MovieDBapiService()

  componentDidMount() {
    window.addEventListener('offline', () => {
      this.setState({ error: new Error('no internet') })
    })
    window.addEventListener('online', () => {
      this.setState({ error: null })
    })
    this.setState({
      genresData: this.getGenres(),
    })
    if (sessionStorage.getItem('ratedMovies')) {
      this.getRatedMovies()
    }
  }

  getGenres = () => {
    const genresData = {}
    this.moviedbService
      .getGenres()
      .then(({ genres }) => {
        const genresArray = genres
        genresArray.forEach((genre) => {
          genresData[genre.id] = genre.name
        })
      })
      .catch((error) => this.setState({ error }))
    return genresData
  }

  getMovie = debounce((query, page = 1) => {
    this.moviedbService
      .getMovies(query, page)
      .then((body) => {
        this.setState({
          moviesData: body.results,
          searchQuery: query,
          loading: false,
          totalMovies: body.total_results,
        })
      })
      .catch((error) => this.setState({ error }))
  }, 800)

  searchMovie = (query, page = 1) => {
    this.setState({
      moviesData: null,
      loading: true,
      totalMovies: 0,
      error: null,
    })
    this.getMovie(query, page)
  }

  rateMovie = (id, userRating) => {
    const { moviesData } = this.state
    let ratedMovies = []
    const rated = moviesData.filter((movie) => movie.id === id)
    rated[0].userRating = userRating
    if (!sessionStorage.getItem('ratedMovies')) {
      ratedMovies.push(rated[0])
      sessionStorage.setItem('ratedMovies', JSON.stringify(ratedMovies))
    } else {
      ratedMovies = JSON.parse(sessionStorage.getItem('ratedMovies'))
      if (!ratedMovies.find((movie) => movie.id === id)) {
        ratedMovies.push(rated[0])
        sessionStorage.setItem('ratedMovies', JSON.stringify(ratedMovies))
      } else {
        const movieIndex = ratedMovies.findIndex((movie) => movie.id === id)
        ratedMovies[movieIndex].userRating = userRating
        sessionStorage.setItem('ratedMovies', JSON.stringify(ratedMovies))
      }
    }
    this.getRatedMovies()
  }

  clearMovies = () => {
    this.getMovie.cancel()
    this.setState({
      moviesData: null,
      loading: false,
      totalMovies: 0,
    })
  }

  getRatedMovies = () => {
    if (sessionStorage.getItem('ratedMovies')) {
      this.setState({
        ratedMovies: JSON.parse(sessionStorage.getItem('ratedMovies')),
      })
    }
  }

  render() {
    const { moviesData, loading, totalMovies, searchQuery, genresData, ratedMovies, error } = this.state

    const tabs = [
      {
        label: 'Search',
        key: 'search',
        children: (
          <SearchPage
            moviesData={moviesData}
            loading={loading}
            searchMovie={this.searchMovie}
            getMovie={this.getMovie}
            searchQuery={searchQuery}
            totalMovies={totalMovies}
            rateMovie={this.rateMovie}
            clearMovies={this.clearMovies}
            error={error}
          />
        ),
      },
      {
        label: 'Rated',
        key: 'rated',
        children: <RatedPage ratedMovies={ratedMovies} />,
      },
    ]

    return (
      <div className="movies">
        <GenresProvider value={genresData}>
          <Tabs centered items={tabs} />
        </GenresProvider>
      </div>
    )
  }
}
