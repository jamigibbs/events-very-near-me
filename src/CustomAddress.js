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
        
          <p>No biggie. You don't want to give out your current location willy nilly. But we need to start somewhere <span role="img" aria-label="shrug">🤷‍</span></p>
          
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
                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
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
