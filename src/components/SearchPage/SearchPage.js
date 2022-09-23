import { Pagination, Spin, Alert } from 'antd'
import PropTypes, { number } from 'prop-types'
import { Component } from 'react'
import './SearchPage.css'

import MoviesList from '../MoviesList'
import SearchBox from '../SearchBox'

export default class SearchPage extends Component {
  state = {
    searchQuery: '',
    currentPage: 1,
  }

  componentDidUpdate(prevProps) {
    const { searchQuery } = this.props
    if (searchQuery !== prevProps.searchQuery) {
      this.setState({ searchQuery })
    }
  }

  onChangePage = (page) => {
    const { searchMovie } = this.props
    const { searchQuery } = this.state
    this.setState({
      currentPage: page,
    })
    searchMovie(searchQuery, page)
  }

  render() {
    const { moviesData, searchMovie, totalMovies, loading, rateMovie, clearMovies, error } = this.props
    const { currentPage } = this.state
    return (
      <div className="search-page">
        <SearchBox searchMovie={searchMovie} clearMovies={clearMovies} />
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

SearchPage.defaultProps = {
  moviesData: null,
  error: null,
}

SearchPage.propTypes = {
  moviesData: PropTypes.arrayOf(
    PropTypes.shape({
      poster_path: PropTypes.string,
      adult: PropTypes.bool,
      overview: PropTypes.string,
      release_date: PropTypes.string,
      genre_ids: PropTypes.arrayOf(number),
      id: PropTypes.number,
      original_title: PropTypes.string,
      original_language: PropTypes.string,
      title: PropTypes.string,
      backdrop_path: PropTypes.string,
      popularity: PropTypes.number,
      vote_count: PropTypes.number,
      video: PropTypes.bool,
      vote_average: PropTypes.number,
    })
  ),
  searchMovie: PropTypes.func.isRequired,
  totalMovies: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  rateMovie: PropTypes.func.isRequired,
  clearMovies: PropTypes.func.isRequired,
  error: PropTypes.instanceOf(Error),
}
