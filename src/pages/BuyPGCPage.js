import React from 'react';
import { web3Action } from 'src/reducers/web3/web3';
import { useDispatch } from 'react-redux';
import BuyPGC from 'src/components/buyPGC/BuyPGC';

const BuyPGCPage = props => {
  const dispatch = useDispatch()
  
  React.useLayoutEffect(() => {
    dispatch(web3Action.connect())
  }, [])

  return (
    <div>
      <BuyPGC/>
    </div>
  );
};

export default React.memo(BuyPGCPage);