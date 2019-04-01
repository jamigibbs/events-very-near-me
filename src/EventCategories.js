import React from 'react'
import './Button.scss';
import './EventCategories.scss';

const EventCategories = ({categories}) => {
  return (
    <ul className="event-categories">
    {categories.map((category, i) => {
      return (
        <li 
          className="event-categories__item"
          key={i} 
          dangerouslySetInnerHTML={{ __html: `${category.name}` }}></li>
      )
    })}
    </ul>
  )
}

export default EventCategories
