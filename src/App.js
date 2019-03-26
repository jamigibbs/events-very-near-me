import React, { Component } from 'react';
import axios from 'axios'
import './App.scss';
import Button from './Button'
import EventsList from './EventsList'
import Map from './Map'


const EVENTFUL_API_KEY = process.env.REACT_APP_EVENTFUL_API_KEY
const EVENTFUL_SEARCH =  process.env.NODE_ENV === 'development' ? '/json/events/search' : 'https://api.eventful.com/json/events/search'

console.log(process.env.NODE_ENV)

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: [],
      location: {},
      locationReady: false,
      eventsAvailable: false
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.events !== this.state.events) {
      this.setState({ eventsAvailable: true })
    }
  }

  buildUrl = (url, parameters) => {
    let qs = "";
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const value = parameters[key];
            qs +=
                encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
    }

    return url;
}

  getEvents = async () => {
    try {
      const { data } = await axios.get(EVENTFUL_SEARCH, {
        withCredentials: true,
        params: {
          app_key: EVENTFUL_API_KEY,
          location: `${this.state.location.lat}, ${this.state.location.lng}`,
          date: 'Today',  
          within: 1,
          unit: 'mi',
          include: 'popularity',
          sort_order: 'popularity'
        }
      })

      // fetch(EVENTFUL_SEARCH, {
      //   app_key: EVENTFUL_API_KEY,
      //   location: `${this.state.location.lat}, ${this.state.location.lng}`,
      //   date: 'Today',
      //   within: 1,
      //   unit: 'mi',
      //   include: 'popularity',
      //   sort_order: 'popularity'
      // })
      //   .then(res => console.log(res.json()))
      //   .catch(error => console.error(error))

      // fetch(this.buildUrl(EVENTFUL_SEARCH, {
      //   app_key: EVENTFUL_API_KEY,
      //   location: `${this.state.location.lat}, ${this.state.location.lng}`,
      //   date: 'Today',
      //   within: 1,
      //   unit: 'mi',
      //   include: 'popularity',
      //   sort_order: 'popularity'
      // }))
      //   .then(res => {
      //     return res.json()
      //   })
      //   .then((data) => {
      //     this.setState({ events: data.events.event })
      //   })
      //   .catch(error => console.error('fetch error: ', error))
      
      /**
       * TODO: Flag recurring events. For example, an art show that is showing for 3 weeks
       * and the recurrence falls within today's date.
       * 
       * Ref: http://api.eventful.com/docs/faq
       */

      // Make sure only events matching current date.
      // const dateToday = this.dateToday()
      // const events = data.events.event.filter((event) => {
      //   console.log(event)
      //   // API format: 2019-03-24 19:30:00
      //   const startTime = event.start_time.split(' ')[0]
      //   console.log(startTime, dateToday)
      //   return startTime === dateToday
      // })

      this.setState({ events: data.events.event })
    } catch (err) {
      console.log('err', err)
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      }
    }
  }

  // dateToday = () => {
  //   const today = new Date();
  //   const dd = String(today.getDate()).padStart(2, '0')
  //   const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  //   const yyyy = today.getFullYear()
  //   // Format: 2019-03-24
  //   return yyyy + '-' + mm + '-' + dd
  // }

  render() {
    const lat = this.state.location.lat
    const lng = this.state.location.lng
    const eventsAvailable = this.state.events.length > 0
    return (
      <div className="app">
        { this.state.locationReady &&
            <div className="map">
            <Map
              id="map__primary"
              eventsAvailable={this.state.eventsAvailable}
              events={this.state.events}
              options={{ center: { lat, lng }, zoom: 13 }}
              onMapLoad={map => {

                const currentLocationMarker = new window.google.maps.Marker({
                  position: { lat, lng },
                  map: map,
                  title: 'You are here'
                })

                const currentLocationStr = '<div class="map__content">'+
                '<p>You are here</p>'+
                '</div>';

                const currentLocationInfo = new window.google.maps.InfoWindow({
                  content: currentLocationStr
                })

                currentLocationMarker.addListener('click', function() {
                  currentLocationInfo.open(map, currentLocationMarker)
                })

              }}
            />
          </div>
        }

        <div>
          { this.state.locationReady && !eventsAvailable &&
            <Button handleClick={this.getEvents} value="Get Events Very Near Me" />
          }
          { eventsAvailable && 
            <EventsList events={this.state.events} />
          }
        </div>

      </div>
    );
  }
}

export default App;
