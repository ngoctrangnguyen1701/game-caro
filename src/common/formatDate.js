import moment from 'moment'

const formatDate = timestamp => {
  if (timestamp) {
    const relativeTime = moment(timestamp).startOf('minutes').fromNow()
    const date = moment(timestamp).format('YYYY-MM-DD, h:mm:ss')
    return `${relativeTime} (${date})`
  }
  return null
}

export default formatDate