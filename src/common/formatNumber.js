const formatNumber = value => {
  if(value && typeof value === 'number') {
    return value.toLocaleString()
  }
  return 0
}
export default formatNumber