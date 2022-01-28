import styled, {css, keyframes} from 'styled-components'

import CardContent from '@mui/material/CardContent';



const linearBlack = '-45deg, #121212, #121212, #121212, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), #121212, #121212, #121212'
const linearBlack2 = '-45deg, #121212, #121212, #121212, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2), #121212, #121212, #121212'
const linearOrange = '-45deg, #ff7b00, #ff7b00, #ff7b00, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), #ff7b00, #ff7b00, #ff7b00'
const linearOrange2 = '-45deg, #ff7b00, #ff7b00, #ff7b00, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2), #ff7b00, #ff7b00, #ff7b00'

const moveLinearBlack = keyframes`
  0% {background-size: 100% 100%; background-image: linear-gradient(${linearBlack2})}
  50% {background-size: 300% 100%; background-image: linear-gradient(${linearBlack2})}
  100% {background-size: 100% 100%; background-image: linear-gradient(${linearBlack2})}
`;
const moveLinearOrange = keyframes`
  0% {background-size: 100% 100%; background-image: linear-gradient(${linearOrange2})}
  50% {background-size: 300% 100%; background-image: linear-gradient(${linearOrange2})}
  100% {background-size: 100% 100%; background-image: linear-gradient(${linearOrange2})}
`;

export const Card = styled.div`
  background-color: ${props => props?.color === 'black' ? '#121212' : ''};
  background-color: ${props => props?.color === 'orange' ? '#ff7b00' : ''};
  text-align: center;
  opacity: ${props => props.opacity && props.opacity};

  position: relative;
`

export const Content = styled(CardContent)`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 24px 0;
  
  background-image: linear-gradient(${props => props?.color === 'black' ? linearBlack : ''});
  background-image: linear-gradient(${props => props?.color === 'orange' ? linearOrange : ''});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  &:hover{   
    ${props => props?.color === 'black' ? css`animation-name: ${moveLinearBlack}` : ''};
    ${props => props?.color === 'orange' ? css`animation-name: ${moveLinearOrange}` : ''};
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
`