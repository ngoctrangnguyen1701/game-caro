//when push code and deploy, change 'LOCAL' to 'HOSTING'
// export const linkServer = process.env.REACT_APP_LINK_SERVER_LOCAL
// export const linkServer = process.env.REACT_APP_LINK_SERVER_HOSTING
const LINK_SERVER_LOCAL = 'http://localhost:5000'
const LINK_SERVER_HOSTING = 'https://server-game-caro.onrender.com'
// const LINK_SERVER_HOSTING = 'https://server-play-game-caro.herokuapp.com' //not use anymore

export const linkServer = process.env.NODE_ENV === 'development' ? LINK_SERVER_LOCAL : LINK_SERVER_HOSTING
// export const linkServer = LINK_SERVER_HOSTING