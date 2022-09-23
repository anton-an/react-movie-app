import PropTypes, { number } from 'prop-types'
import { Pagination } from 'antd'

import './RatedPage.css'
import MoviesList from '../MoviesList'

export default function RatedPage({ ratedMovies }) {
  return (
    <div>
      <MoviesList moviesData={ratedMovies} rated />
      <Pagination hideOnSinglePage />
    </div>
  )
}

RatedPage.defaultProps = {
  ratedMovies: null,
}

RatedPage.propTypes = {
  ratedMovies: PropTypes.arrayOf(
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
}
