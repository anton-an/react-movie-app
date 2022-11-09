import { Pagination, Spin, Alert } from 'antd'
import { Component } from 'react'

import './RatedPage.css'
import MoviesList from '../MoviesList'
import MovieDBapiService from '../../movieDBapi'

export default class RatedPage extends Component {
  state = {
    ratedMovies: '',
    error: '',
    loading: false,
    currentPage: 1,
    totalMovies: 0,
  }

  componentDidMount() {
    const { currentPage } = this.state
    this.setState({ loading: true })
    this.getRatedMovies(currentPage)
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage } = this.state
    if (prevState.currentPage !== currentPage) {
      this.getRatedMovies(currentPage)
    }
  }

  getRatedMovies = (page) => {
    MovieDBapiService.getRatedMovies(page)
      .then((body) => {
        this.setState({ ratedMovies: body.results, loading: false, totalMovies: body.total_results })
      })
      .catch((error) => {
        this.setState({
          error,
          loading: false,
        })
      })
  }

  onPageChange = (page) => {
    this.setState({ currentPage: page })
  }

  render() {
    const { ratedMovies, loading, error, currentPage, totalMovies } = this.state
    return (
      <div>
        {loading && !error ? <Spin className="spinner" size="large" /> : null}
        {error ? <Alert message={error.message} type="error" showIcon /> : null}
        <MoviesList moviesData={ratedMovies} rated />
        <Pagination
          className="pagination"
          current={currentPage}
          total={totalMovies}
          pageSize={20}
          size="small"
          showSizeChanger={false}
          onChange={this.onPageChange}
          hideOnSinglePage
        />
      </div>
    )
  }
}
