import React from 'react';
import styled, {keyframes} from 'styled-components'

/*Huge thanks to @tobiasahlin at http://tobiasahlin.com/spinkit/ */
const bouncedelay = keyframes`
  0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
`

export const Loader = styled.div`
  // margin: 100px auto 0;
  // width: 70px;
  display: inline-block;
  text-align: center;
  margin-left: 5px;

  div{
    width: 5px;
    height: 5px;
    background-color: rgba(220, 53, 69, 0.6);
    margin-right: 2px;
  
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: ${bouncedelay} 1.4s infinite ease-in-out both;
    animation: ${bouncedelay} 1.4s infinite ease-in-out both;
  }

  .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  
  .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
`

const LoadingThreeDots = () => {
  return (
    <Loader>
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </Loader>
  );
};

export default React.memo(LoadingThreeDots);