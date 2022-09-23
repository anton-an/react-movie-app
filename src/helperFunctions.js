export function truncText(str, maxLength, separator = ' ') {
  if (str.length <= maxLength) return str
  const result = str.substr(0, str.lastIndexOf(separator, maxLength))
  return `${result}...`
}

export function getRatingColor(rating) {
  let color = '#66E900'
  if (rating <= 3) color = '#E90000'
  if (rating <= 5) color = '#E97E00'
  if (rating <= 7) color = '#E9D100'
  return color
}
