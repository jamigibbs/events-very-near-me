import React from 'react'
import './EventsList.scss';

const EventsList = ({events}) => {
  return (
    <ul className="event-list">
      <h4 className="event-list__header">
      We found {events.length} event{events.length > 1 ? 's' : ''}! 🎉
      </h4>
      { events.map((event, i) => {
          return ( 
            
              <li className="event-list__item" key={i}>
                <h5 className="event-list__title">Venue</h5>
                {event.venue_name}
                <h5 className="event-list__title">Name</h5>
                <a className="event-list__link" target="_blank" rel="noopener noreferrer" href="https://google.com">
                  {event.title}
                </a>
                <h5 className="event-list__title">Location</h5>
                <a className="event-list__link" target="_blank" rel="noopener noreferrer" href="https://maps.google.com">
                  {event.venue_address}
                </a>
                <h5 className="event-list__title">Time</h5>
                {event.start_time}
              </li> 
          )
        })
      }
    </ul>
  )
}

export default EventsList