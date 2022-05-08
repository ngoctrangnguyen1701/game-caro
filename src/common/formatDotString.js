const formatDotString = string => {
  if (string) {
    const head = string.slice(0, 5)
    const foot = string.slice(string.length - 5)
    return `${head}...${foot}`
  }
  return ''
}

export default formatDotString