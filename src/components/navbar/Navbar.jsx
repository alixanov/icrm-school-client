import React, { useState } from 'react'
import { Link } from "react-router-dom"
import "./navbar.css"
import Add from '../add/Add'

const Navbar = ({setFetching}) => {
     const [isAddOpen, setIsAddOpen] = useState(false)
     const handleAddClick = () => {
          setIsAddOpen(true)
     }

     const handleCloseAdd = () => {
          setIsAddOpen(false)
     }
     
  return (
<nav className='navbar__container'>
            <Link onClick={handleAddClick} >
                 Гурух кушиш
            </Link>          
            {isAddOpen && <Add onClose={handleCloseAdd} />}
</nav>
  )
}

export default Navbar