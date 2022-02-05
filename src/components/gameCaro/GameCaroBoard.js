import React, {useEffect, useState, useContext} from "react";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "src/App";
import { fightingAction } from "src/reducers/fighting/playSlice";
import { fightingBoardSelector, fightingRowSelector, fightingSettingSelector, fightingStatusSelector, fightingWinnerSelector, fightingXIsNextSelector } from "src/selectors/fightingSelector";
import { AuthContext } from "src/contexts/AuthContextProvider";


// import Square from "./Square";
import GameCaroRow from "./GameCaroRow";

const GameCaroBoard = () =>{
  const dispatch = useDispatch()
  const row = useSelector(fightingRowSelector)
  const status = useSelector(fightingStatusSelector)

  useEffect(()=>{
    socket.on('changeTurn', data => {
      console.log('changeTurn: ', data)
      return dispatch(fightingAction.changeTurn(data))
      //return to not double dispatch
    })
    //when component unmount, off listen 'changeTurn',
    //avoid to create many function listen when component render
    return () => socket.off('changeTurn')
  }, [])


  // useEffect(()=>{
  //   if(board && board.length > 0){
  //     const rowArr = []
  //     board.forEach(item => {
  //       if(!rowArr.includes(item.y)){
  //         rowArr.push(item.y)
  //       }
  //     })
  //     // console.log({rowArr})
  //     setRow([...rowArr])
  //   }
  // }, [board])

  // useEffect(()=>{
  //   let board = []
  //   for(let y = 0; y < height; y++){
  //     let row = []
  //     for(let x = 0; x < width; x++){
  //       row.push({x, y, value: null})
  //     }
  //     board = [...board, ...row]
  //   }
  //   setSquares([...board])
  // }, [height, width])

  


  // const handleClick = index => {
  //   if (winner || squares[index]?.value /* || isFinish */) {
  //     //nếu có winner or click lại ô cũ or ván cờ đã kết thúc thì ko click được nữa
  //     return;
  //   }

  //   if(squares && squares.length > 0){
  //     squares[index].value = xIsNext ? "X" : "O"
  //     setSquares([...squares])
  //     // setXIsNext(!xIsNext)
  //     dispatch(fightingAction.changeTurn())
  //   }
  // }

  let elementRow = []
  // let yParam = 0
  if(row && row.length > 0){
    elementRow = row.map((item, index) => {
      // if(item !== yParam){
      //   yParam = item
      // }
      return (
        <GameCaroRow
          key={index}
          // squares={squares}
          // board={board}
          yParam={item}
          // handleClick={handleClick}
          // yParam={yParam}
          // handleClick={handleClick}
        />
      )
    })
  }
  // let elementSquare = []
  // let elementRow = []
  // let yParam = 0
  // if(squares && squares.length > 0){
    
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
      {(status === 'start' || status === 'stop') && elementRow}
    </div>
  );
}

export default React.memo(GameCaroBoard)