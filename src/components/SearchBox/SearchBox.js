import { Input } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import './SearchBox.css'

export default class SearchBox extends React.Component {
  state = {
    searchInputValue: localStorage.getItem('searchQuery') ? localStorage.getItem('searchQuery') : '',
  }

  componentDidMount() {
    const { searchMovie } = this.props
    const { searchInputValue } = this.state
    if (searchInputValue) {
      searchMovie(searchInputValue)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchMovie, clearMovies } = this.props
    const { searchInputValue } = this.state
    if (searchInputValue !== prevState.searchInputValue) {
      if (!searchInputValue) {
        clearMovies()
      } else {
        searchMovie(searchInputValue)
      }
    }
  }

  onSearch = (e) => {
    this.setState({
      searchInputValue: e.target.value,
    })
  }

  render() {
    const { searchInputValue } = this.state
    return (
      <Input className="search-box" placeholder="Type to search..." onChange={this.onSearch} value={searchInputValue} />
    )
  }
}

SearchBox.propTypes = {
  searchMovie: PropTypes.func.isRequired,
  clearMovies: PropTypes.func.isRequired,
}
