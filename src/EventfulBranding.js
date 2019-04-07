import React from 'react'
import './EventfulBranding.scss'

const EventfulBranding = () => {
  return (
    <div className="eventful-badge eventful-small">
      <img src="https://api.eventful.com/images/powered/eventful_58x20.gif"
        alt="Local Events, Concerts, Tickets" />
      <p><a href="https://eventful.com/">Events by Eventful</a></p>
    </div>
  )
}

export default EventfulBranding