//thêm trường hợp nếu như bị chặn 2 đầu thì sẽ ko thắng

const whoIsWinner = (arr, width, height) =>{
  if(arr && arr.length > 0){
    for(let i = 0; i < arr.length; i++){
      const currentValue = arr[i].value
      const sameRow = arr[i].y
      const sameColumn = arr[i].x
      if(currentValue){
        //chỉ xét khi value ở vị trí đó có giá trị

        //Xét theo hàng ngang
        const consecutiveRowCells = []
        const consecutiveRowIndexs = []
        /* vd: a = 0 -> index chính nó
               a = 1 -> index + 1
               a = 2 -> index + 2
        tọa độ của x nếu lớn hơn width - 5, khi xét theo hàng ngang từ trái qua phải sẽ không đủ 5 ô liên tiếp
         */
        if(sameColumn <= width - 5){
          for(let a = 0; a < 5; a++){
            //chạy for để lấy 5 ô hàng ngang liên tiếp (tọa độ x nhích sang phải 1 ô, tọa độ x giữ nguyên)
            //ô hàng ngang tiếp theo cách 1 cái index
            //nếu 5 ô liên tiếp hàng ngang đó cùng tọa độ y và cùng value -> winner
            const obj = arr[i + a]
            if(obj && obj.y === sameRow && obj.value === currentValue){
              consecutiveRowCells.push(obj)
              consecutiveRowIndexs.push(i + a)  //i + a --> index of cell consecutive row
            }
          }
          // // console.log('consecutiveRowCells: ', consecutiveRowCells)

          if(consecutiveRowCells.length === 5){
            let headStopCell = {}
            let footStopCell = {}
            if(sameColumn !== 0){
              //nếu là ô có tọa độ nằm sát biên bên trái (x = 0), không có ô chặn ở đầu
              //nên chỉ xét các ô có tọa độ x khác 0
              headStopCell = arr[i - 1] || {}
            }
            if(sameColumn !== width - 5){
              //nếu là ô có tọa độ cách biên bên phải (x = width - 5), không có ô chặn ở cuối
              //nên chỉ xét các ô có tọa độ x khác width - 5
              footStopCell = arr[i + 5] || {}
            }
            // // console.log('consecutiveRowCells', 'headStopCell', headStopCell)
            // // console.log('consecutiveRowCells', 'footStopCell', footStopCell)
            //X O O O O O X   --> not win
            //X O O O O O O   --> not win (6 ô liên tiếp cũng không thắng)
            //  O O O O O X   --> win
            //1 trong 2 không giá trị (chỉ bị chặn 1 đầu or không bị chặn )thì sẽ win
            if(!headStopCell.value || !footStopCell.value){
              if(headStopCell.value === currentValue || footStopCell.value === currentValue){
                //trường hợp không bị chặn (or bị chặn 1 đầu) 
                //xét tiếp ô chặn đầu or ô chặn cuối đó value có khác currentValue không
                //nếu value giống nhau, nghĩa là đang có hơn 5 ô liên tiếp giá trị giống nhau
                //X O O O O O O   --> not win (6 ô liên tiếp cũng không thắng)
              }
              else{
                // return currentValue
                return {winValue: currentValue, winFiveCells: consecutiveRowIndexs}
              }
            }
          }
        }
        
        
        //Xét theo hàng dọc
        const consecutiveColumnCells = []
        const consecutiveColumnIndexs = []
        /* vd: width = 10
        index + 10 qua moi vong for
        j = 0 -> index chính nó
        j = 1 -> index + 10
        j = 2 -> index + 10 + 10
        j = 3 -> index + 10 + 10 + 10 

        tọa độ của y nếu lớn hơn height - 5, khi xét xuống theo hàng dọc sẽ không đủ 5 ô liên tiếp
        */
        if(sameRow <= height - 5){
          for(let j = 0; j < 5; j++){
            //chạy for để lấy 5 ô hàng dọc liên tiếp (tọa độ x giữ nguyên, tọa độ y nhích xuống dưới 1 ô)
            //tùy thuộc vào width mà ô hàng dọc tiếp theo cách bao nhiêu cái index
            //nếu 5 ô hàng dọc liên tiếp đó cùng tọa độ x và cùng value -> winner
            const obj = arr[i + width*j]
            if(obj && obj.x === sameColumn && obj.value === currentValue){
              consecutiveColumnCells.push(obj)
              consecutiveColumnIndexs.push(i + width*j) //i + width*j --> index of cell consecutive column
            }
          }
          // // console.log('consecutiveColumnCells: ', consecutiveColumnCells)
          if(consecutiveColumnCells.length === 5){
            const headStopCell = arr[i - width] || {}
            const footStopCell = arr[i + width*5] || {}
            // // console.log('consecutiveColumnCells', 'headStopCell', headStopCell)
            // // console.log('consecutiveColumnCells', 'footStopCell', footStopCell)
            if(!headStopCell.value || !footStopCell.value){
              if(headStopCell.value === currentValue || footStopCell.value === currentValue){
              }
              else{
                // return currentValue
                return {winValue: currentValue, winFiveCells: consecutiveColumnIndexs}
              }
            }
          }
        }
        

        //Xét theo hàng chéo bên phải
        const consecutiveCrossRightCells = []
        const consecutiveCrossRightIndexs = []
        /* vd: width: 15, tọa độ {x: 1, y: 2} -> index 31
        chéo xuống bên phải, ô tiếp theo thứ nhất là {x: 2, y: 3}  -> index 47 = 31 + 16 -> cách cái width cộng thêm 1 đơn vị
        chéo xuống bên phải, ô tiếp theo thứ hai là {x: 3, y: 4}   -> index 63 = 31 + 16*2
        width: 15 nên chéo xuống bên phải chỉ xét chính xác được khi tới cột 10 (width - 5)
        sang những cột tiếp theo sẽ có ô bị đẩy xuống thêm 1 dòng nữa do bị sát biên
         */
        if(sameColumn <= width - 5){
          for(let z = 0; z < 5; z++){
            //chạy for để lấy 5 ô hàng chéo liên tiếp (tọa độ x nhích sang phải 1 ô, tọa độ y nhích xuống dưới 1 ô)
            //tùy thuộc vào width mà ô hàng chéo tiếp theo cách bao nhiêu cái index cộng thêm 1
            //nếu 5 ô hàng chéo liên tiếp đó cùng value -> winner
            const objRight = arr[i + (width + 1)*z]
            if(objRight && objRight.value === currentValue){
              consecutiveCrossRightCells.push(objRight)
              consecutiveCrossRightIndexs.push(i + (width + 1)*z) //index of cell consecutive cross right
            }
          }
          // console.log('consecutiveCrossRightCells: ', consecutiveCrossRightCells)

          if(consecutiveCrossRightCells.length === 5){
            let headStopCell = {}
            let footStopCell = {}
            
            if(sameColumn !== 0 && sameRow !== 0){
              //nếu là ô có tọa độ nằm sát biên bên trên (y = 0)
              //và ô có tọa độ nằm sát biên bên trái (x = 0), không có ô chặn ở đầu
              headStopCell = arr[i - (width + 1)] || {}
            }
            if(sameColumn !== width - 5){
              //nếu là ô có tọa độ cách biên bên phải  (x = width - 5)
              //thì không có ô chặn ở cuối
              footStopCell = arr[i + (width + 1)*5] || {}
            }
            // console.log('consecutiveCrossRightCells', 'headStopCell', headStopCell)
            // console.log('consecutiveCrossRightCells', 'footStopCell', footStopCell)
            if(!headStopCell.value || !footStopCell.value){
              if(headStopCell.value === currentValue || footStopCell.value === currentValue){
              }
              else{
                // return currentValue
                return {winValue: currentValue, winFiveCells: consecutiveCrossRightIndexs}
              }
            }
          }
        }
        
        
        //Xét theo hàng chéo bên trái
        const consecutiveCrossLeftCells = []
        const consecutiveCrossLeftIndexs = []
        /* vd: width: 15, tọa độ {x: 1, y: 2} -> index 31
        chéo xuống bên trái, ô tiếp theo thứ nhất là {x: 1, y: 4}  -> index 45 = 31 + 14 -> cách cái width cộng thêm 1 đơn vị
        do xét theo chéo xuống bên trái nên xét chính xác được bắt đầu từ ô của cột 5 trở đi (tương đương x >= 4)
        */
        if(sameColumn >= 4){
          for(let b = 0; b < 5; b++){
            //chạy for để lấy 5 ô hàng chéo liên tiếp (tọa độ x nhích sang phải 1 ô, tọa độ y nhích xuống dưới 1 ô)
            //tùy thuộc vào width mà ô hàng chéo tiếp theo cách bao nhiêu cái index cộng thêm 1
            //nếu 5 ô hàng chéo liên tiếp đó cùng value -> winner
            const objLeft = arr[i + (width - 1)*b]
            if(objLeft && objLeft.value === currentValue){
              consecutiveCrossLeftCells.push(objLeft)
              consecutiveCrossLeftIndexs.push(i + (width - 1)*b) //index of cell consecutive cross left
            }
          }
          // console.log('consecutiveCrossLeftCells: ', consecutiveCrossLeftCells)

          if(consecutiveCrossLeftCells.length === 5){
            let headStopCell = {}
            let footStopCell = {}
              
            if(sameRow !== 0 && sameColumn !== (width - 1)){
              //nếu ô có tọa độ nằm sát biên bên trên (y = 0)
              //và ô có tọa độ nằm sát biên bên phải (x = width - 1) -> không có ô chặn đầu
              headStopCell = arr[i - (width - 1)] || {}
            }
            if(sameColumn !== 4){
              //nếu là ô có tọa độ cách biên bên trái (x = 4)
              //thì không có ô chặn ở cuối
              footStopCell = arr[i + (width - 1)*5] || {}
            }
            // console.log('consecutiveCrossLeftCells', 'headStopCell', headStopCell)
            // console.log('consecutiveCrossLeftCells', 'footStopCell', footStopCell)

            if(!headStopCell.value || !footStopCell.value){
              if(headStopCell.value === currentValue || footStopCell.value === currentValue){
              }
              else{
                // return currentValue
                return {winValue: currentValue, winFiveCells: consecutiveCrossLeftIndexs}
              }
            }
          }
        }
      }
    }
  }
  // return null
  return {winValue: null, winFiveCells: []}
}

export default whoIsWinner