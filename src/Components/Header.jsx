import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
    
        <Link to='/signup'>SignUp</Link> <br /> <br />
        <Link to='login'>Login</Link>
    
    </>
  )
}

export default Header