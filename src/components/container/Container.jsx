import React, { useState } from 'react'
import Card from '../card/Card'
import Navbar from '../navbar/Navbar'

const Container = () => {
  const [fetching, setFetching] = useState(false)
  

  return (
    <div className='container__page'>
      <Navbar setFetching={setFetching} />
      <Card/>
    </div>
  )
}

export default Container