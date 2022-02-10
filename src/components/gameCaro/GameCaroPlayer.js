import React from 'react'

import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Avatar,
  Select,
} from '@mui/material'


const chessShapeArr = [
  'https://product.hstatic.net/200000415025/product/155_3794_s_twllnnwzgxkjb3xt6m53whxat3oi_cfb8a9188b6a43b5818d019501f5ef63_large.jpg',
  'https://product.hstatic.net/1000231532/product/pokemon_plamo_pikachu_sun_moon_766a9a00c59d4eb282ec539002d9dda8_grande_e1d3cdfc79ed44bfad25b7e28ac5a4a9_large.jpg',
  'https://www.multcopets.org/sites/default/files/styles/medium/public/2020-11/Tiger%201.jpg',
  'https://product.hstatic.net/1000231532/product/pokemon_shop_ban_gengar_pokemon_plamo_collection_451a4325648943b58984033558556796_large.jpg',
  'https://i.servimg.com/u/f39/18/83/96/52/tm/03-sam10.jpg'
]


const GameCaroPlayer = props => {
  const {label, player, user, onChangeShape, defaultChessShape, chessShape, disabledChangeShape} = props
  

  const elementChessShape = chessShapeArr.map((item, index) => (
    <MenuItem value={item} key={index}>
      <div className='mx-auto'>
        <img src={item} alt={item} style={{width: '50px'}}/>
      </div>
    </MenuItem>
  ))

  return (
    <div className="col-4 text-center">
      <TextField
        error={player.username === user.username}
        disabled={player.username !== user.username}
        label={label}
        value={player.username || ''} 
        //do khi play yourself 'player.username' sẽ là undefined,
        //và khi chuyển qua play online, 'player.username' sẽ có giá trị
        //value của thẻ <input> chuyển từ undefined -> sang có giá trị sẽ bị báo lỗi
        //nên thêm giá trị rỗng khi play yourself để chuyển sang play online (value của thẻ <input> từ '' --> sang 'có giá trị' sẽ không bị báo lỗi)
      />
      <Avatar
        alt={player.username}
        src={player.avatar || "/static/images/avatar/1.jpg"}
        sx={{ width: 80, height: 80, margin: '10px auto' }}
      />
      <FormControl sx={{ m: 1, minWidth: 140 }}>
        <InputLabel>Shape chess</InputLabel>
        <Select
          color='success'
          value={chessShape}
          onChange={e=>onChangeShape(e.target.value)}
          disabled={disabledChangeShape}
        >
          <MenuItem value={defaultChessShape}>
            <div className='mx-auto'>{defaultChessShape}</div>
          </MenuItem>
          {elementChessShape}
        </Select>
      </FormControl>
    </div>
  );
};

export default React.memo(GameCaroPlayer);