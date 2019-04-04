import React, { Component } from 'react';
import fetchJsonp from 'fetch-jsonp'
import Spinner from 'react-spinkit'
import './App.scss';
import Button from './Button'
import CustomAddress from './CustomAddress'
import EventsList from './EventsList'
import Map from './Map'
import mapStyles from './mapStyles'
import testData from './data'

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
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
    if (!window.google) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.google.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      const scriptElement = document.getElementsByTagName('script')[0]
      scriptElement.parentNode.insertBefore(script, scriptElement)
      
      script.addEventListener('load', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError)
        }
      })
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
    this.setState({locationDenied: true})
  }

  getEvents = async () => {
    const { location, distance } = this.state
    this.setState({isFetching: true})

    try {
      fetchJsonp(`${EVENTFUL_SEARCH}?app_key=${EVENTFUL_API_KEY}&location=${location.lat},${location.lng}&date=Today&include=popularity,categories,price&sort_order=popularity&within=${distance}&units=mi&page_size=30`)
        .then((response) => {
          return response.json()
        }).then((data) => {
          if (data.events === null || !data.events) {
            this.setState({ events: [] })
          } else {
            this.setState({ events: data.events.event})
          }
          this.setState({eventsAvailable: true, isFetching: false})
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
  
  handleCustomLocation = (location) => {
    this.setState({location, locationReady: true, locationDenied: false})
  }

  render() {
    const { lat, lng } = this.state.location
    if (this.state.locationDenied) return <CustomAddress customLocation={this.handleCustomLocation} />
    return (
      <div className="app">
        { this.state.locationReady &&
            <div className="map">
            <Map
              id="map__primary"
              eventsAvailable={this.state.eventsAvailable}
              events={this.state.events}
              options={{ center: { lat, lng }, zoom: 13, styles: mapStyles, mapTypeControl: false, streetViewControl: false}}
              onMapLoad={map => {

                const currentLocationMarker = new window.google.maps.Marker({
                  position: { lat, lng },
                  map: map,
                  title: 'You are here',
                  icon: 'current-location-pin.svg'
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
              <Spinner name="ball-scale-multiple" color="#006DDA" fadeIn="none" />
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
