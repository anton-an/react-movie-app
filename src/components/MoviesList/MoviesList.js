import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'

import Movie from '../Movie'

export default function MoviesList({ moviesData, rateMovie, rated }) {
  if (!moviesData) return null

  const movies = moviesData.map((movie) => (
    <Col key={movie.id} xs={24} sm={24} md={12} lg={12}>
      <Movie
        releaseDate={movie.release_date}
        title={movie.title}
        overview={movie.overview}
        averageRating={movie.vote_average}
        posterPath={movie.poster_path}
        genreIds={movie.genre_ids}
        movieId={movie.id}
        rateMovie={rateMovie}
        userRating={movie.rating || null}
        rated={rated}
      />
    </Col>
  ))

  return (
    <div className="movies-list">
      <Row
        gutter={[
          { xs: 16, sm: 16, md: 16, lg: 32 },
          { xs: 16, sm: 16, md: 16, lg: 32 },
        ]}
      >
        {movies}
      </Row>
    </div>
  )
}

MoviesList.defaultProps = {
  rateMovie: null,
  rated: false,
}

MoviesList.propTypes = {
  rateMovie: PropTypes.func,
  rated: PropTypes.bool,
}
