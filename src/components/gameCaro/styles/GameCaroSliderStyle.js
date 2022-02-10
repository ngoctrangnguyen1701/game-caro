import styled from "styled-components";

export const Slider = styled.div`
  width: 100%;
  height: 6px;
  position: relative;
`

export const Rail = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #ccc;
  border-radius: 3px;
`

export const CircleLine = styled.div`
  position: absolute;
  z-index: 1;
  top: -20px;

  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid #dc3545;
  box-shadow: 0 .5rem 1rem rgba(220, 53, 69, .3);
  background: white;
  display: flex;

  &.left{
    left: 0%;
    transition: 1s ease-out;
  }
  &.right{
    left: calc(100% - 46px);
    transition: 1s ease-out;
  }
`

export const Ball = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  margin: auto;
  background-color: #dc3545;

  line-height: 38px;
  text-align: center;
  color: white;
  font-size: 14px;
`