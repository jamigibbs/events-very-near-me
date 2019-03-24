import React from 'react'

const Button = ({handleClick, value}) => {
  return (
    <button onClick={() => handleClick()}>{value}</button>
  )
}

export default Button;