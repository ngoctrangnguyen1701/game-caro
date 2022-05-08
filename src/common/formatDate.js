import moment from 'moment'

const formatDate = timestamp => {
  if (timestamp) {
    return moment(timestamp).format('YYYY-MM-DD, HH:MM:SS')
  }
  return null
}

export default formatDate