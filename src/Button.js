import React from 'react'
import './Button.scss';

const Button = ({handleClick, value}) => {
  return (
    <div className="button-wrap">
      <button className="button" onClick={() => handleClick()}>{value}</button>
    </div>
  )
}

export default Button;