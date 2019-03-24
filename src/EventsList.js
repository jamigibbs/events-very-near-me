import React from 'react'

const EventsList = ({events}) => {
  return (
    <ul>
      <h5>Total Events Found: {events.length}</h5>
      { events.map((event, i) => {
          return ( 
            <li key={i}> Name: {event.title} - Venue: {event.venue_name} - Location: {event.venue_address} - Day/Time: {event.start_time}</li> 
          )
        })
      }
    </ul>
  )
}

export default EventsList