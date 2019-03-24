import React from 'react'
import Geocode from 'react-geocode'
import { GOOGLE_MAPS_API_KEY } from './config'

// Geocode.setApiKey('AIzaSyBOkFprSNEWYlN8PQeJSkfNjFZDHfb4KeY')

const CurrentLocation = ({location}) => {
  console.log(location)
  let address = "loading..."

    // Geocode.enableDebug();
    // Geocode.fromLatLng(location.lat, location.lng).then(
    //   response => {
    //     address = response.results[0].formatted_address
    //   },
    //   error => {
    //     console.error(error)
    //   }
    // )
    
    // create a geocoder object
    const geocoder  = new window.google.maps.Geocoder()
    // turn coordinates into an object 
    var loc  = new window.google.maps.LatLng(location.lat, location.lng)         
    geocoder.geocode({'latLng': loc}, function (results, status) {
      // if geocode success
      if (status == window.google.maps.GeocoderStatus.OK) {
        // if address found, pass to processing function
        address = results[0].formatted_address;
      }
    })


  return (
    <h4 style={{color: 'white'}}>Your current location is: {address}</h4>
  )
}

export default CurrentLocation