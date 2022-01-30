import styled, {keyframes, css} from 'styled-components'


const blue = 'rgba(13,110,253, 1)'
const blueOpacity2 = 'rgba(13,110,253, 0.2)'
const blueOpacity5 = 'rgba(13,110,253, 0.5)'
const blueOpacity7 = 'rgba(13,110,253, 0.7)'

const orange = 'rgba(255, 123, 0, 1)'
const orangeOpacity2 = 'rgba(255, 123, 0, 0.2)'
const orangeOpacity5 = 'rgba(255, 123, 0, 0.5)'
const orangeOpacity7 = 'rgba(255, 123, 0, 0.7)'

const load5 = (color, colorOpacity2, colorOpacity5, colorOpacity7) => keyframes`
  0%,
  100% {
    box-shadow: 0em -2.6em 0em 0em ${color}, 1.8em -1.8em 0 0em ${colorOpacity2}, 2.5em 0em 0 0em ${colorOpacity2}, 1.75em 1.75em 0 0em ${colorOpacity2}, 0em 2.5em 0 0em ${colorOpacity2}, -1.8em 1.8em 0 0em ${colorOpacity2}, -2.6em 0em 0 0em ${colorOpacity5}, -1.8em -1.8em 0 0em ${colorOpacity7};
  }
  12.5% {
    box-shadow: 0em -2.6em 0em 0em ${colorOpacity7}, 1.8em -1.8em 0 0em ${color}, 2.5em 0em 0 0em ${colorOpacity2}, 1.75em 1.75em 0 0em ${colorOpacity2}, 0em 2.5em 0 0em ${colorOpacity2}, -1.8em 1.8em 0 0em ${colorOpacity2}, -2.6em 0em 0 0em ${colorOpacity2}, -1.8em -1.8em 0 0em ${colorOpacity5};
  }
  25% {
    box-shadow: 0em -2.6em 0em 0em ${colorOpacity5}, 1.8em -1.8em 0 0em ${colorOpacity7}, 2.5em 0em 0 0em ${color}, 1.75em 1.75em 0 0em ${colorOpacity2}, 0em 2.5em 0 0em ${colorOpacity2}, -1.8em 1.8em 0 0em ${colorOpacity2}, -2.6em 0em 0 0em ${colorOpacity2}, -1.8em -1.8em 0 0em ${colorOpacity2};
  }
  37.5% {
    box-shadow: 0em -2.6em 0em 0em ${colorOpacity2}, 1.8em -1.8em 0 0em ${colorOpacity5}, 2.5em 0em 0 0em ${colorOpacity7}, 1.75em 1.75em 0 0em ${color}, 0em 2.5em 0 0em ${colorOpacity2}, -1.8em 1.8em 0 0em ${colorOpacity2}, -2.6em 0em 0 0em ${colorOpacity2}, -1.8em -1.8em 0 0em ${colorOpacity2};
  }
  50% {
    box-shadow: 0em -2.6em 0em 0em ${colorOpacity2}, 1.8em -1.8em 0 0em ${colorOpacity2}, 2.5em 0em 0 0em ${colorOpacity5}, 1.75em 1.75em 0 0em ${colorOpacity7}, 0em 2.5em 0 0em ${color}, -1.8em 1.8em 0 0em ${colorOpacity2}, -2.6em 0em 0 0em ${colorOpacity2}, -1.8em -1.8em 0 0em ${colorOpacity2};
  }
  62.5% {
    box-shadow: 0em -2.6em 0em 0em ${colorOpacity2}, 1.8em -1.8em 0 0em ${colorOpacity2}, 2.5em 0em 0 0em ${colorOpacity2}, 1.75em 1.75em 0 0em ${colorOpacity5}, 0em 2.5em 0 0em ${colorOpacity7}, -1.8em 1.8em 0 0em ${color}, -2.6em 0em 0 0em ${colorOpacity2}, -1.8em -1.8em 0 0em ${colorOpacity2};
  }
  75% {
    box-shadow: 0em -2.6em 0em 0em ${colorOpacity2}, 1.8em -1.8em 0 0em ${colorOpacity2}, 2.5em 0em 0 0em ${colorOpacity2}, 1.75em 1.75em 0 0em ${colorOpacity2}, 0em 2.5em 0 0em ${colorOpacity5}, -1.8em 1.8em 0 0em ${colorOpacity7}, -2.6em 0em 0 0em ${color}, -1.8em -1.8em 0 0em ${colorOpacity2};
  }
  87.5% {
    box-shadow: 0em -2.6em 0em 0em ${colorOpacity2}, 1.8em -1.8em 0 0em ${colorOpacity2}, 2.5em 0em 0 0em ${colorOpacity2}, 1.75em 1.75em 0 0em ${colorOpacity2}, 0em 2.5em 0 0em ${colorOpacity2}, -1.8em 1.8em 0 0em ${colorOpacity5}, -2.6em 0em 0 0em ${colorOpacity7}, -1.8em -1.8em 0 0em ${color};
  }
`

export const Loader = styled.div`
  margin: 100px auto;
  font-size: 16px;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  -webkit-animation: load5 1s infinite ease;
  // animation: load5 1s infinite ease;
  ${props => props.color === 'blue' ? css`animation: ${load5(blue, blueOpacity2, blueOpacity5, blueOpacity7)} 1s infinite ease` : ''};
  ${props => props.color === 'orange' ? css`animation: ${load5(orange, orangeOpacity2, orangeOpacity5, orangeOpacity7)} 1s infinite ease` : ''};
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
`