import PropTypes, { number } from 'prop-types'
import { Card, Typography, Rate, Image, Statistic, message } from 'antd'
import { Component } from 'react'

import { GenresConsumer } from '../../GenresContext/GenresContext'
import GenresList from '../GenresList'
import { truncText, getRatingColor } from '../../helperFunctions'
import MovieDBapiService from '../../movieDBapi'

import './Movie.css'

const { Title, Text } = Typography

export default class Movie extends Component {
  state = {
    rating: 0,
  }

  componentDidMount() {
    const { movieId } = this.props
    if (localStorage.getItem('stars')) {
      const stars = JSON.parse(localStorage.getItem('stars'))
      if (stars[movieId]) {
        const star = stars[movieId]
        this.setState({ rating: star })
      }
    }
  }

  ratingStyle = () => {
    const { averageRating } = this.props
    const style = {
      position: 'absolute',
      top: '12px',
      right: '9px',
      width: '30px',
      height: '30px',
      paddingTop: '4px',
      textAlign: 'center',
      fontSize: '12px',
      border: '2px solid',
      borderColor: getRatingColor(averageRating),
      borderRadius: '50%',
    }
    return style
  }

  getPoster = () => {
    const { posterPath } = this.props
    if (!posterPath) {
      return (
        <Image
          className="movie-card__cover-image"
          src="no-image"
          preview={false}
          fallback="data:image/png;base64,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"
        />
      )
    }
    return (
      <Image
        className="movie-card__cover-image"
        src={`https://image.tmdb.org/t/p/original${posterPath}`}
        preview={false}
      />
    )
  }

  checkOverview = () => {
    const { overview } = this.props
    return overview || 'No description yet'
  }

  onRate = (rating) => {
    const { movieId } = this.props
    const stars = localStorage.getItem('stars')
    if (!stars) {
      localStorage.setItem('stars', '{}')
    }
    const newObject = JSON.parse(localStorage.getItem('stars'))
    newObject[movieId] = rating
    localStorage.setItem('stars', JSON.stringify(newObject))
    this.setState({ rating })
    MovieDBapiService.rateMovie(movieId, rating)
      .then(() => {
        message.success('Successfully rated!', 2)
      })
      .catch(() => message.error('Can not rate!', 2))
  }

  onDeleteRate = () => {
    const { movieId, deleteRatedFromState, rated } = this.props
    const stars = JSON.parse(localStorage.getItem('stars'))
    delete stars[movieId]
    localStorage.setItem('stars', JSON.stringify(stars))
    this.setState({ rating: 0 })
    MovieDBapiService.deleteRatedMovie(movieId)
      .then(() => {
        message.success('Rating successfully deleted!', 2)
        if (rated) {
          deleteRatedFromState(movieId)
        }
      })
      .catch(() => message.error('Can not delete rating!', 2))
  }

  render() {
    const { averageRating, title, releaseDate, genreIds } = this.props
    const { rating } = this.state
    return (
      <Card className="movie-card" bordered={false} cover={this.getPoster()}>
        <Statistic value={Math.round(averageRating * 10) / 10} valueStyle={this.ratingStyle()} />
        <Title level={3} className="movie-card__title">
          {truncText(title, 14)}
        </Title>
        <Text className="movie-card__release-date" type="secondary">
          {releaseDate}
        </Text>
        <GenresConsumer>{(genresData) => <GenresList genresData={genresData} genreIds={genreIds} />}</GenresConsumer>
        <Text className="movie-card__description">{truncText(this.checkOverview(), 150)}</Text>
        <div className="movie-card__stars-wrapper">
          <Rate
            className="movie-card__stars"
            count={10}
            allowHalf
            value={rating}
            onChange={rating ? this.onDeleteRate : this.onRate}
          />
        </div>
      </Card>
    )
  }
}

Movie.defaultProps = {
  genreIds: null,
  posterPath: '',
}

Movie.propTypes = {
  releaseDate: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  posterPath: PropTypes.string,
  averageRating: PropTypes.number.isRequired,
  movieId: PropTypes.number.isRequired,
  genreIds: PropTypes.arrayOf(number),
}
