import React, { Component } from 'react';
import fetchJsonp from 'fetch-jsonp'
import Spinner from 'react-spinkit'
import './App.scss';
import Button from './Button'
import EventsList from './EventsList'
import Map from './Map'
import testData from './data'

const EVENTFUL_API_KEY = process.env.REACT_APP_EVENTFUL_API_KEY
const EVENTFUL_SEARCH =  process.env.NODE_ENV === 'development' ? '/json/events/search' : 'https://api.eventful.com/json/events/search'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: [],
      location: {},
      distance: 1,
      locationReady: false,
      eventsAvailable: false,
      isFetching: false,
      locationDenied: false
    }
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError)
    } else {
      console.log('Geolocation is not supported for this Browser/OS.')
      this.setState({locationDenied: true})
    }
  }
  
  geoSuccess = (pos) => {
    this.setState({
      location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      locationReady: true,
      locationDenied: false
    })
  }
  
  geoError = (error) => {
    console.error('geolocation error. Code:', error.code, '-', error.message)
    this.setState({locationDenied: true})
  }

  getEvents = async () => {
    const { location, distance } = this.state
    this.setState({isFetching: true})

    try {
      fetchJsonp(`${EVENTFUL_SEARCH}?app_key=${EVENTFUL_API_KEY}&location=${location.lat},${location.lng}&date=Today&include=popularity,categories,price&sort_order=popularity&within=${distance}&units=mi&page_size=50`)
        .then((response) => {
          return response.json()
        }).then((data) => {
          this.setState({ 
            events: data.events.event,
            eventsAvailable: true,
            isFetching: false 
          })
        }).catch((ex) => {
          console.log('parsing failed', ex)
        })

      // setTimeout(() => {
      //   this.setState({
      //     events: testData.data.events.event, 
      //     //events: [],
      //     eventsAvailable: true,
      //     isFetching: false
      //   })
      // }, 2000)
    
    } catch (err) {
      console.log('err', err)
    }
  }

  handleRadiusUpdate = (distance) => {
    this.setState({distance, eventsAvailable: false}, () => {
      this.getEvents()
    })
  }

  render() {
    const { lat, lng } = this.state.location
    if (this.state.locationDenied) {
      return (
        <div className="app">
          <div className="app__error-text"><p>Oops! This app requires access to your <br />current location. <span role="img" aria-label="thinking face">🤔</span></p></div>
        </div>
      )
    }
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
          { this.state.isFetching &&
            <div className="loading-indicator">
              <Spinner name="ball-scale-multiple" color="fuchsia" fadeIn="none" />
            </div>
          }
          { this.state.locationReady && !this.state.eventsAvailable && !this.state.isFetching &&
            <Button handleClick={this.getEvents} value="Get Events Very Near Me" />
          }
          { this.state.eventsAvailable && 
            <EventsList 
              events={this.state.events} 
              handleRadiusUpdate={this.handleRadiusUpdate} 
              distance={this.state.distance} />
          }
        </div>

      </div>
    );
  }
}

export default App;
