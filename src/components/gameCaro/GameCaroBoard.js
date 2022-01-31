import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";

import { fightingAction } from "src/reducers/fighting/playSlice";
import { fightingSettingSelector, fightingStatusSelector, fightingWinnerSelector, fightingXIsNextSelector } from "src/selectors/fightingSelector";

import Square from "./Square";

const GameCaroBoard = () =>{
  const dispatch = useDispatch()
  const width = useSelector(fightingSettingSelector).width
  const height = useSelector(fightingSettingSelector).height
  const status = useSelector(fightingStatusSelector)
  const xIsNext = useSelector(fightingXIsNextSelector)
  const winner = useSelector(fightingWinnerSelector)

  const [squares, setSquares] = useState([])

  useEffect(()=>{
    let board = []
    for(let y = 0; y < height; y++){
      let row = []
      for(let x = 0; x < width; x++){
        row.push({x, y, value: null})
      }
      board = [...board, ...row]
    }
    setSquares([...board])
  }, [height, width])


  const handleClick = index => {
    if (winner || squares[index]?.value /* || isFinish */) {
      //nếu có winner or click lại ô cũ or ván cờ đã kết thúc thì ko click được nữa
      return;
    }

    if(squares && squares.length > 0){
      squares[index].value = xIsNext ? "X" : "O"
      setSquares([...squares])
      // setXIsNext(!xIsNext)
      dispatch(fightingAction.changeTurn())
    }
  }

  let elementSquare = []
  let elementRow = []

  // if(squares && squares.length > 0){
  //   elementSquare = squares.map((item, index) => {
  //     let yParam = 0
  //     let lastObj = squares[squares.length - 1]
  //     if(yParam !== item.y){
  //       //khi bắt đầu chuyển sang hàng khác
  //       //console.log('yParam: ', yParam)
  //       //console.log('item.y: ', item.y)
  //       yParam = item.y
  //       return <div key={index} className="d-flex justify-content-center">{elementRow}</div>
  //       // elementRow = []
  //     }
      
  //     elementRow.push(<Square
  //                       key={index}
  //                       index={index}
  //                       value={item.value}
  //                       onClick={() => handleClick(index)}
  //                     />)

  //     if(lastObj.x === item.x && lastObj.y === item.y){
  //       //khi forEach chạy đến phần tử cuối cùng thì đổ elementRow đã push đầy đủ các ô
  //       //nếu không ô render ra sẽ bị thiếu hàng cuối cùng
  //       elementSquare.push(<div key={index} className="d-flex justify-content-center">{elementRow}</div>)
  //     }
  //   })
  // }

  // if(squares && squares.length > 0){
  //   let elementRow = []
  //   let yParam = 0
  //   let lastObj = squares[squares.length - 1]
  //   squares.forEach((item, index) => {
  //     if(yParam !== item.y){
  //       //khi bắt đầu chuyển sang hàng khác
  //       //console.log('yParam: ', yParam)
  //       //console.log('item.y: ', item.y)
  //       yParam = item.y
  //       elementSquare.push(<div key={index} className="d-flex justify-content-center">{elementRow}</div>)
  //       elementRow = []
  //     }
      
  //     elementRow.push(<Square
  //                       key={index}
  //                       index={index}
  //                       value={item.value}
  //                       onClick={() => handleClick(index)}
  //                     />)

  //     if(lastObj.x === item.x && lastObj.y === item.y){
  //       //khi forEach chạy đến phần tử cuối cùng thì đổ elementRow đã push đầy đủ các ô
  //       //nếu không ô render ra sẽ bị thiếu hàng cuối cùng
  //       elementSquare.push(<div key={index} className="d-flex justify-content-center">{elementRow}</div>)
  //     }
  //   })
  // }

  return (
    <div className="mt-3">
      {status === 'start' && elementSquare}
    </div>
  );
}

export default React.memo(GameCaroBoard)