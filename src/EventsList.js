import React from 'react'
import './EventsList.scss';

const EventsList = ({events}) => {
  
  /**
   * Replacing localhost:3000 with the eventful domain name when we're 
   * working in development environment.
   * 
   * @param {string} url 
   */
  function cleanEventfulURL(url) {
    const path = url.split('3000')[1]
    return path ? `https://eventful.com/${path}` : url
  }
  
  return (
    <ul className="event-list">
      <h4 className="event-list__header">
      We found {events.length} event{events.length === 1 ? '' : 's'} happening today! 🎉
      </h4>
      { events.map((event, i) => {
          return ( 
            
              <li className="event-list__item" key={i}>
                <h5 className="event-list__title">Venue</h5>
                {event.venue_name}
                <h5 className="event-list__title">Event</h5>
                <a className="event-list__link" target="_blank" rel="noopener noreferrer" href={cleanEventfulURL(event.url)}>
                  {event.title}
                </a>
                <h5 className="event-list__title">Location</h5>
                <a className="event-list__link" target="_blank" rel="noopener noreferrer" href="https://maps.google.com">
                  {event.venue_address}
                </a>
              </li> 
          )
        })
      }
    </ul>
  )
}

export default EventsList
