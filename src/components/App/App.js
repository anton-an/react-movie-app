import 'antd/dist/antd.css'
import './App.css'
import React from 'react'
import { Alert, Tabs } from 'antd'

import MovieDBapiService from '../../movieDBapi'
import SearchPage from '../SearchPage'
import { GenresProvider } from '../../GenresContext/GenresContext'
import RatedPage from '../RatedPage'

export default class App extends React.Component {
  state = {
    genresData: [],
    error: null,
  }

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
    this.setState({})
    MovieDBapiService.guestSessionInit().then(this.getRatedMovies)
  }

  getGenres = () => {
    MovieDBapiService.getGenres()
      .then((genres) => this.setState({ genresData: genres }))
      .catch((error) => this.setState({ error }))
  }

  render() {
    const { genresData, error } = this.state

    const tabs = [
      {
        label: 'Search',
        key: 'search',
        children: <SearchPage />,
      },
      {
        label: 'Rated',
        key: 'rated',
        children: <RatedPage />,
      },
    ]

    return (
      <div className="movies">
        {error ? <Alert type="error" message={error.toString()} /> : null}
        <GenresProvider value={genresData}>
          <Tabs centered items={tabs} destroyInactiveTabPane />
        </GenresProvider>
      </div>
    )
  }
}
