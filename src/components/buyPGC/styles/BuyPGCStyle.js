import styled from 'styled-components'

export const Frame = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 15px;
`
export const SmallFrame = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  background: white;
  height: 40px;
  line-height: 40px;
`
export const Input = styled.input`
  border: none;
  border-radius: 5px 0 0 5px;
  background: none;
  padding: 0 10px;
  line-height: 40px;

  &:focus {
    box-shadow: none
  }
`
export const Unit = styled.div`
  width: 50px;
  border-left: 1px solid #cccc;
  text-align: center;
`