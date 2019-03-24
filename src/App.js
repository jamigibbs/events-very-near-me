import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import API_KEY from './config'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: [],
      location: {},
      locationReady: false
    }
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.setState({
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          locationReady: true
        })
      })
    } else {
      console.log('Geolocation is not supported for this Browser/OS.');
    }
  }

  handleClick = async () => {
    try {
      const { data } = await axios.get('/json/events/search/', {
        params: {
          app_key: API_KEY,
          location: `${this.state.location.lat}, ${this.state.location.lng}`,
          date: 'Today',
          within: 1,
          unit: 'mi',
          include: 'popularity',
          sort_order: 'popularity'
        }
      })
      
      // Make sure only events matching current date.
      const dateToday = this.dateToday()
      const events = data.events.event.filter((event) => {
        // API format: 2019-03-24 19:30:00
        const startTime = event.start_time.split(' ')[0]
        return startTime === dateToday
      })

      this.setState({ events })
    } catch (err) {
      console.log('err', err)
    }
  }

  dateToday = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = today.getFullYear()
    // Format: 2019-03-24
    return yyyy + '-' + mm + '-' + dd
  }

  render() {
    const lat = this.state.location.lat
    const lng = this.state.location.lng
    const location = this.state.location.lat ? lat + `, ` + lng : 'loading...'
    const eventsAvailable = this.state.events.length > 0
    return (
      <div className="App">
        <header className="App-header">
        
          <h2 style={{color: 'white'}}>Your current location is: { location } </h2>

          { this.state.locationReady &&
            <button onClick={this.handleClick}>Events near me</button>
          }

          { eventsAvailable && 
            <ul>
              {this.state.events.length}
              { this.state.events.map((event, i) => {
                  return ( 
                    <li key={i}> Name: {event.title} - Venue: {event.venue_name} - Location: {event.venue_address} - Day/Time: {event.start_time}</li> 
                  )
                })
              }
            </ul>
          }

        </header>
      </div>
    );
  }
}

export default App;
