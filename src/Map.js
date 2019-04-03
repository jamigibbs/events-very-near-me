import React, {Component} from 'react'
import './Map.scss'
import { cleanEventfulURL } from './utils'

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

class Map extends Component {
  constructor(props){
    super(props)
    this.state = { 
      markers: [],
      locations: {} 
    }
    this.map = null
  }

  componentDidMount(){
    if (!window.google) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.google.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      const scriptElement = document.getElementsByTagName('script')[0]
      scriptElement.parentNode.insertBefore(script, scriptElement)

      script.addEventListener('load', e => this.onScriptLoad())
    } else {
      this.onScriptLoad()
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.eventsAvailable !== this.props.eventsAvailable && this.props.eventsAvailable) {
      await this.deleteMarkers()

      for (var i = 0; i < this.props.events.length; i++) {
        await this.addMarker(this.props.events[i])
      }
    }
  }
  
  addMarker = (event) => {
    const location = { lat: Number(event.latitude), lng: Number(event.longitude) }
    const key = `${location.lat},${location.lng}`
    const duplicate = this.state.locations.hasOwnProperty(key)

    if (!duplicate) {
      this.setState({
        locations: {...this.state.locations, [key]: [{ [event.url]: event.title }]}
      })
    } else {
      this.setState({
        locations: {...this.state.locations, [key]: [...this.state.locations[key], { [event.url]: event.title }]}
      })
    }

    const eventsList = this.state.locations[key].map((eventInfo) => {
      const url = cleanEventfulURL(Object.keys(eventInfo)[0])
      const title = eventInfo[Object.keys(eventInfo)[0]]
      return `<li class="map-content__list-item"><a class="map-content__list-item-link" target="_blank" rel="noopener noreferrer" href=${url}>${title}</a></li>`
    }).join('')
    
    const content = '<div class="map-content">'+
    `<h3 class="map-content__header">${event.venue_name}</h3>`+
    `<h4 class="map-content__title">Events</h4>`+
    `<ul class="map-content__list">${eventsList}</ul>`+
    '</div>';

    const locationInfo = new window.google.maps.InfoWindow({
      content
    })

    const marker = new window.google.maps.Marker({
      position: location,
      map: this.map,
      infoWindow: locationInfo,
      icon: 'event-pin.svg'
    })

    marker.addListener('click', () => {
      this.hideAllInfoWindows()
      marker.infoWindow.open(this.map, marker)
    })

    this.setState({markers: [...this.state.markers, marker]})
  }

  hideAllInfoWindows = () => {
    this.state.markers.forEach((marker) => {
      marker.infoWindow.close(this.map, marker)
    })
  }

  setMapOnAll = async (map) => {
    for (var i = 0; i < this.state.markers.length; i++) {
      await this.state.markers[i].setMap(map)
    }
  }

  clearMarkers = async () => {
    await this.setMapOnAll(null)
  }

  /**
   * Deletes all markers in the array by removing references to them.
   * 
   * @ref https://goo.gl/ruFtz3
   */
  deleteMarkers = async () => {
    await this.clearMarkers()
    this.setState({markers: [], locations: {}})
  }

  onScriptLoad = () => {
    this.map = new window.google.maps.Map(document.getElementById(this.props.id), this.props.options)
    this.props.onMapLoad(this.map)
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }} id={this.props.id} />
    )
  }
}

export default Map
