import React, {Component} from 'react'
import './Map.scss';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
console.log(GOOGLE_MAPS_API_KEY)
class Map extends Component {
  constructor(props){
    super(props)
    this.state = { markers: [] }
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.eventsAvailable !== this.props.eventsAvailable) {
      const markers = this.props.events.map((event) => {
        return {
          venue: event.venue_name,
          lat: Number(event.latitude),
          lng: Number(event.longitude) 
        }
      }, [])

      this.setState({ markers }, () => {
        if (markers.length > 0) {
          this.addEventMarkers()
        }
      })
    }
  }

  addEventMarkers = () => {
    this.state.markers.forEach((event, i) => {
      const marker = new window.google.maps.Marker({
        position: { lat: event.lat, lng: event.lng },
        map: this.map,
        title: event.venue_name
      })
      
      const content = '<div class="map__content">'+
      `<p>${event.venue}</p>`+
      '</div>';

      const locationInfo = new window.google.maps.InfoWindow({
        content
      })

      marker.addListener('click', function() {
        locationInfo.open(this.map, marker)
      })
    })
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