import React from 'react'
import './EventsList.scss';
import DistanceSelect from './DistanceSelect';
import EventCategories from './EventCategories';
import { cleanEventfulURL } from './utils'

const EventsList = ({events, handleRadiusUpdate, distance}) => {

  if (events.length === 0) {
    return (
      <div>
        <h4 className="event-list__header">
          We didn't find any events for this location radius. <span role="img" aria-label="sad face">😞</span> Maybe check a little further?
        </h4>
        <DistanceSelect updateRadius={handleRadiusUpdate} currentRadius={distance} />
      </div>
    )
  }
  
  return (
    <ul className="event-list">
      <h4 className="event-list__header">We found {events.length} event{events.length === 1 ? '' : 's'} within {distance} mile{distance > 1 ? 's' : ''}<br /> happening today! <span role="img" aria-label="celebrate">🎉</span>
      </h4>

      <DistanceSelect updateRadius={handleRadiusUpdate} currentRadius={distance} />

      { events.map((event, i) => {
          return ( 
              <li className="event-list__item" key={i}>
                <h5 className="event-list__title">Category</h5>
                <EventCategories categories={event.categories.category} />
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
                { event.recur_string !== null &&
                  <span>
                  <h5 className="event-list__title"><span className="event-list__recurring">Recurring Event</span></h5>
                  {event.recur_string}
                  </span>
                }
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
