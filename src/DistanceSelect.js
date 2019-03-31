import React from 'react'
import './DistanceSelect.scss'

const DistanceSelect = ({updateRadius, currentRadius}) => {
  const distanceSelections = [1, 1.5, 2]
  return (
    <div>
      <ul className="distance-select">
      { distanceSelections.map((distance) => {
          return (
            <li key={distance}>
              <button 
                className={`distance-select__button ${currentRadius === distance ? 'distance-select__button--active' : ''}`}
                onClick={() => updateRadius(distance)}
              >
                {distance} mile{distance > 1 ? 's' : ''}
              </button>
            </li>
          )
        })
      }
        {/* <li>
          <button 
            className="distance-select__button"
            onClick={() => updateRadius(1)}>1 miles</button>
        </li>
        <li>
          <button 
            className="distance-select__button"
            onClick={() => updateRadius(1.5)}>1.5 miles</button>
        </li>
        <li>
          <button 
            className="distance-select__button"
            onClick={() => updateRadius(2)}>2 miles</button>
        </li> */}
      </ul>
    </div>
  )
}

export default DistanceSelect