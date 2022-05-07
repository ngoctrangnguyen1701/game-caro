const formatNumber = value => {
  if(value) {
    if(typeof value === 'string') {
      return parseFloat(value).toLocaleString()
    }
    if(typeof value === 'number') {
      return value.toLocaleString()
    }
  }
  return 0
}
export default formatNumber