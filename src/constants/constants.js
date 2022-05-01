//when push code and deploy, change 'LOCAL' to 'HOSTING'
// export const linkServer = process.env.REACT_APP_LINK_SERVER_LOCAL
// export const linkServer = process.env.REACT_APP_LINK_SERVER_HOSTING
const LINK_SERVER_LOCAL = 'http://localhost:5000'
const LINK_SERVER_HOSTING = 'https://server-play-game-caro.herokuapp.com'
export const ADMIN_WALLET = '0xC57918d202BDB425Df377B57F9648D717119bd8C'

export const linkServer = process.env.NODE_ENV === 'development' ? LINK_SERVER_LOCAL : LINK_SERVER_HOSTING