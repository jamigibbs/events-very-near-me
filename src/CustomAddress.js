import React from 'react'
import './CustomAddress.scss'

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

class CustomAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '' }
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    this.setState({ address })
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then((latLng) => {
        this.props.customLocation(latLng)
      })
      .catch(error => console.error('Error', error))
  }

  render() {
    return (
      <div className="app geo-custom" style={{backgroundImage: 'url("bg-blur.jpg")'}}>
        <div className="geo-custom__error-text">
        
          <p>You don't want to give out your geolocation willy nilly. No biggie. <span style={{fontSize: '140%'}} role="img" aria-label="shrug">🤷</span>But we need to start somewhere:</p>
          
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: 'Enter your location ...',
                    className: 'location-search-input',
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map(suggestion => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item';
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: 'rgba(0, 0, 0, 0.9)', cursor: 'pointer' }
                      : { backgroundColor: 'rgba(0, 0, 0, 0.5)', cursor: 'pointer' };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
      </div>
      </div>
    );
  }
}

export default CustomAddress
