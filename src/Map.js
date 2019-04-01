import React, {Component} from 'react'
import './Map.scss';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

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
    var marker = new window.google.maps.Marker({
      position: location,
      map: this.map
    })

    const content = '<div class="map__content">'+
    `<p>${event.venue_name}</p>`+
    '</div>';

    const locationInfo = new window.google.maps.InfoWindow({
      content
    })

    marker.addListener('click', function() {
      locationInfo.open(this.map, marker)
    })

    this.setState({markers: [...this.state.markers, marker]})
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
    this.setState({markers: []})
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
