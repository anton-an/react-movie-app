import { Pagination, Spin, Alert } from 'antd'
import { Component } from 'react'
import './SearchPage.css'
import { debounce } from 'lodash'

import MovieDBapiService from '../../movieDBapi'
import MoviesList from '../MoviesList'
import SearchBox from '../SearchBox'

export default class SearchPage extends Component {
  state = {
    moviesData: null,
    searchQuery: '',
    currentPage: 1,
    loading: false,
    totalMovies: 0,
    error: null,
  }

  componentDidUpdate(prevProps) {
    const { searchQuery } = this.props
    if (searchQuery !== prevProps.searchQuery) {
      this.setState({ searchQuery })
    }
  }

  getMovie = debounce((query, page = 1) => {
    this.setState({ loading: true })
    localStorage.setItem('searchQuery', query)
    MovieDBapiService.getMovies(query, page)
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

  clearMovies = () => {
    this.getMovie.cancel()
    this.setState({
      moviesData: null,
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

  render() {
    const { rateMovie } = this.props
    const { moviesData, currentPage, totalMovies, error, loading } = this.state
    return (
      <div className="search-page">
        <SearchBox searchMovie={this.searchMovie} clearMovies={this.clearMovies} />
        {loading && !error ? <Spin className="spinner" size="large" /> : null}
        {error ? <Alert message={error.message} type="error" showIcon /> : null}
        <MoviesList moviesData={moviesData} rateMovie={rateMovie} />
        <Pagination
          total={totalMovies}
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
