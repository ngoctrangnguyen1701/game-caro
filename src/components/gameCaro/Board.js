import React from "react";

import Square from "./Square";

const Board = ({ squares, onClick }) =>{
  let elementSquare = []

  if(squares && squares.length > 0){
    let elementRow = []
    let yParam = 0
    let lastObj = squares[squares.length - 1]
    squares.forEach((item, index) => {
      if(yParam !== item.y){
        //khi bắt đầu chuyển sang hàng khác
        //console.log('yParam: ', yParam)
        //console.log('item.y: ', item.y)
        yParam = item.y
        elementSquare.push(<div key={index} className="d-flex justify-content-center">{elementRow}</div>)
        elementRow = []
      }
      
      elementRow.push(<Square
                        key={index}
                        value={item.value}
                        onClick={() => onClick(index)}
                      />)

      if(lastObj.x === item.x && lastObj.y === item.y){
        //khi forEach chạy đến phần tử cuối cùng thì đổ elementRow đã push đầy đủ các ô
        //nếu không ô render ra sẽ bị thiếu hàng cuối cùng
        elementSquare.push(<div key={index} className="d-flex justify-content-center">{elementRow}</div>)
      }
    })
  }

  return (
    <div className="mt-3">
      {elementSquare}
    </div>
  );
}

export default React.memo(Board)