import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Dialog,
  DialogContent,
} from '@mui/material'
import { useSelector } from 'react-redux';

const ModifyDialog = styled(Dialog)`
  //.css-1t1j96h-MuiPaper-root-MuiDialog-paper{
  //class có chữ 'css' này khi deploy lên product sẽ bị thay đổi
  //nên đừng lấy nó để set lại style cho material ui
  .MuiDialog-paperWidthSm{
    background: none;
    box-shadow: none
  }
`

const Container = styled.div`
  width: 150px;
  height: 150px;
  position: relative;
  margin: 30px auto;
  overflow: hidden;
`
const spin = keyframes`
  from {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
`
const Spinner = styled.div`
  position: absolute;
  width: calc(100% - 9.9px);
  height: calc(100% - 9.9px);
  border: 5px solid transparent;
  border-top-color: ${props => props.color ? props.color : '#ff5722'};

  border-radius: 50%;
  -webkit-animation: ${spin} 5s cubic-bezier(0.17, 0.49, 0.96, 0.76) infinite;
  animation: ${spin} 5s cubic-bezier(0.17, 0.49, 0.96, 0.76) infinite;
`
//https://codepen.io/camdenfoucht/pen/BVxawq

const FullScreenLoading = () => {
  const showLoading = useSelector(state => state.fullscreenLoading.loading)

  return (
    <ModifyDialog
      open={showLoading}
    >
      <DialogContent>
        <Container>
          <Spinner color='#33e3d4'>
            <Spinner color='#4ceee0'>
              <Spinner color='#63f9ec'>
                <Spinner color='#9ef9f2'>
                  <Spinner color='#a4fff8'>
                    <Spinner color='#B8FFF9'></Spinner>
                  </Spinner>
                </Spinner>
              </Spinner>
            </Spinner>
          </Spinner>
        </Container>
      </DialogContent>
    </ModifyDialog>

  );
};

export default React.memo(FullScreenLoading)