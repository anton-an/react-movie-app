import { Tag } from 'antd'
import PropTypes, { number } from 'prop-types'

export default function GenresList({ genreIds, genresData }) {
  if (!genreIds || !genresData) {
    return null
  }
  const genres = genreIds.map((id) => (
    <Tag className="movie-card__tag" key={id}>
      {genresData[id]}
    </Tag>
  ))
  return <div className="movie-card__tag-list">{genres}</div>
}

GenresList.defaultProps = {
  genreIds: null,
  genresData: null,
}

GenresList.propTypes = {
  genreIds: PropTypes.arrayOf(number),
  genresData: PropTypes.objectOf(PropTypes.string),
}
