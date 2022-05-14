import React from 'react';
import styled, {keyframes} from 'styled-components';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const DualRing = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;

  &:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #0d6efd;
    border-color: #0d6efd transparent #0d6efd transparent;
    animation: ${rotate} 1.2s linear infinite;
  }
`

const DualRingLoading = ({showLoading}) => {
  return (
    <div className={showLoading ? 'd-block' : 'd-none'}>
      <DualRing />
    </div>
  );
};

export default React.memo(DualRingLoading)