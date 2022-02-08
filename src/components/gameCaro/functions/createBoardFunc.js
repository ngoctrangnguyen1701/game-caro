const createBoardFunc = (width, height) => {
  let newArr = []
  if(width && height){
    for(let y = 0; y < height; y++){
      let row = []
      for(let x = 0; x < width; x++){
        row.push({x, y, value: null})
      }
      newArr = [...newArr, ...row]
    }
  }
  return newArr
}

export default createBoardFunc