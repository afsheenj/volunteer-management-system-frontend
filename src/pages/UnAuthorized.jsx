import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
const UnAuthorized = () => {

  const {user,logout} = useContext(AuthContext);

  return (
    <>
    <div>UnAuthorized</div>
    <button onClick={logout}>Logout</button>
    </>
  )
}

export default UnAuthorized