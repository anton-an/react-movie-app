import { Pagination, Spin, Alert, Input } from 'antd'
import React from 'react'
import './SearchPage.css'
import { debounce } from 'lodash'

import MovieDBapiService from '../../movieDBapi'
import MoviesList from '../MoviesList'

export default class SearchPage extends React.Component {
  state = {
    moviesData: [],
    ratedMovies: {},
    searchQuery: localStorage.getItem('searchPageData')
      ? JSON.parse(localStorage.getItem('searchPageData')).searchQuery
      : '',
    currentPage: localStorage.getItem('searchPageData')
      ? JSON.parse(localStorage.getItem('searchPageData')).currentPage
      : 1,
    loading: false,
    totalMovies: 0,
    error: null,
  }

  componentDidMount() {
    const { searchQuery, currentPage } = this.state
    this.setState({ loading: true })
    if (searchQuery) {
      this.getMovies(searchQuery, currentPage)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, currentPage } = this.state
    if (searchQuery !== prevState.searchQuery || currentPage !== prevState.currentPage) {
      this.setState({ error: null })
      if (!searchQuery) {
        this.clearMovies()
        return
      }
      this.setState({ loading: true })
      this.getMovies(searchQuery, currentPage)
    }
  }

  getMovies = debounce((query, page = 1) => {
    this.setState({ loading: true })
    MovieDBapiService.getMovies(query, page)
      .then((body) => {
        this.setState({
          moviesData: body.results,
          searchQuery: query,
          loading: false,
          totalMovies: body.total_results,
        })
        this.saveSearchState()
      })
      .catch((error) => {
        this.clearMovies()
        this.setState({ error })
      })
  }, 800)

  saveSearchState = () => {
    const { currentPage, searchQuery } = this.state
    let state = {
      currentPage,
      searchQuery,
    }
    state = JSON.stringify(state)
    localStorage.setItem('searchPageData', state)
  }

  searchMovie = (query, page) => {
    this.setState({
      moviesData: [],
      loading: true,
      totalMovies: 0,
      error: null,
    })
    this.getMovies(query, page)
  }

  clearMovies = () => {
    this.getMovies.cancel()
    this.setState({
      moviesData: [],
      loading: false,
      totalMovies: 0,
    })
  }

  onChangePage = (page) => {
    const { searchQuery } = this.state
    this.setState({
      currentPage: page,
    })
    this.searchMovie(searchQuery, page)
  }

  onInput = (e) => {
    this.setState({ searchQuery: e.target.value })
  }

  render() {
    const { moviesData, currentPage, totalMovies, error, loading, ratedMovies, searchQuery } = this.state
    return (
      <div className="search-page">
        <Input className="search-box" placeholder="Type to search..." onChange={this.onInput} value={searchQuery} />
        {loading && !error ? <Spin className="spinner" size="large" /> : null}
        {error ? <Alert message={error.message} type="error" showIcon /> : null}
        <MoviesList moviesData={moviesData} ratedMovies={ratedMovies} />
        <Pagination
          total={totalMovies}
          defaultCurrent={1}
          current={currentPage}
          showSizeChanger={false}
          hideOnSinglePage
          pageSize={20}
          size="small"
          onChange={this.onChangePage}
          className="pagination"
        />
      </div>
    )
  }
}
