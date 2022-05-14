import React from 'react';
import {
  Pagination,
} from '@mui/material'

const Paginate = (props) => {
  const {page, totalPages, onPageChange} = props

  const handleChange = (event, page) => {
    onPageChange(page)
  }

  return (
    <div className='d-flex justify-content-end'>
      <Pagination
        count={totalPages}
        color="primary"
        variant="outlined"
        shape="rounded"
        page={page}
        onChange={handleChange}
      />
    </div>
  );
};

export default React.memo(Paginate);