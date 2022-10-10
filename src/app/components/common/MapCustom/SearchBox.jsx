import React, { Component } from 'react'
import PropTypes from 'prop-types'

class SearchBox extends Component {
  static propTypes = {
    mapsapi: PropTypes.shape({
      places: PropTypes.shape({
        SearchBox: PropTypes.func,
      }),
      event: PropTypes.shape({
        clearInstanceListeners: PropTypes.func,
      }),
    }).isRequired,
    placeholder: PropTypes.string,
    onPlacesChanged: PropTypes.func,
  }

  static defaultProps = {
    placeholder: 'Tìm kiếm vị trí...',
    onPlacesChanged: null,
  }

  constructor(props) {
    super(props)

    this.searchInput = React.createRef()
  }

  componentDidMount() {
    const {
      mapsapi: { places },
      map,
    } = this.props

    this.searchBox = new places.SearchBox(this.searchInput?.current)

    map.addListener('bounds_changed', () => {
      this.searchBox.setBounds(map.getBounds())
    })

    this.searchBox.addListener('places_changed', this.onPlacesChanged)
  }

  componentWillUnmount() {
    const {
      mapsapi: { event },
    } = this.props

    event.clearInstanceListeners(this.searchBox)
  }

  onPlacesChanged = () => {
    let markers = []

    const places = this.searchBox.getPlaces()
    if (places.length === 0) {
      return
    }

    markers.forEach(marker => {
      marker.setMap(null)
    })
    markers = []
    console.log(this.props.mapsapi)
    const bounds = new this.props.mapsapi.LatLngBounds()

    places.forEach(place => {
      if (!place.geometry || !place.geometry.location) {
        console.log('Returned place contains no geometry')
        return
      }

      const icon = {
        url: place.icon,
        size: new this.props.mapsapi.Size(71, 71),
        origin: new this.props.mapsapi.Point(0, 0),
        anchor: new this.props.mapsapi.Point(17, 34),
        scaledSize: new this.props.mapsapi.Size(25, 25),
      }

      // Create a marker for each place.
      markers.push(
        new this.props.mapsapi.Marker({
          map: this.props.mapInstance,
          icon,
          title: place.name,
          position: place.geometry.location,
        }),
      )
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    })
    this.props.map.fitBounds(bounds)
  }

  render() {
    const { placeholder } = this.props

    return (
      <input
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
        ref={this.searchInput}
        placeholder={placeholder}
        type="text"
        style={{
          width: '392px',
          height: '48px',
          position: 'absolute',
          top: '-22%',
          left: 0,
          paddingLeft: '10px',
        }}
      />
    )
  }
}

export default SearchBox
