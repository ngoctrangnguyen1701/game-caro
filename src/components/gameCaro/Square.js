import React from "react";

const style = {
  width: '30px', 
  height: '30px',
  border: '1px solid #ddd',
  display: 'inline-block',
  fontWeight: 'bold',
  fontSize: '18px',
}

const Square = ({ onClick, value }) => {

  return (
    <button 
      onClick={onClick}
      style={style}
      className={value === 'X' ? 'text-danger' : 'text-primary'}
    >
       {value}
    </button>
  );
}

export default React.memo(Square)