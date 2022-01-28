export default function setConfigApi(){
  const accessToken = JSON.parse(localStorage.getItem('accessToken')) || JSON.parse(sessionStorage.getItem('accessToken'))
  const config = {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : 'Bearer'
    } 
  }
  return config
}