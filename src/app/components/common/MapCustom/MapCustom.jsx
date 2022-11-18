import React, { useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import { Icon, Typography } from '@mui/material'
import SearchBox from './SearchBox'

const cssMarker = {
  color: 'red',
  fontSize: '40px',
  position: 'absolute',
  top: '-35px',
  left: '-25px',
}
const AnyReactComponent = () => (
  <div style={{ position: 'relative' }}>
    <Icon style={cssMarker}>location_on_icon</Icon>
  </div>
)

const MapCustom = React.forwardRef(({ center }, ref) => {
  const [latMarker, setLatMarker] = React.useState()
  const [lngMarker, setLngMarker] = React.useState()
  const [apiReady, setApiReady] = React.useState(false)
  const [mapInstance, setMapInstance] = React.useState(null)
  const [mapsapi, setMapsapi] = React.useState(null)
  const [address, setAddress] = React.useState(null)

  const defaultProps = {
    zoom: 11,
  }

  React.useImperativeHandle(ref, () => ({
    getCreateDegrees: () => {
      return {
        lat: latMarker,
        lng: lngMarker,
      }
    },
  }))

  const handleApiLoaded = (map, maps) => {
    if (map && maps) {
      setMapInstance(map)
      setMapsapi(maps)
      setApiReady(true)
    }
  }

  useEffect(() => {
    setLatMarker(center?.lat)
    setLngMarker(center?.lng)
  }, [])

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '50vh', width: '100%', margin: '25px 0 60px' }}>
      <div>Vị trí trên bản đồ*:</div>
      {center && (
        <>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: 'AIzaSyCsmWuKHE8I4_RCVEFdumyVDMUyKSLiEG0',
              libraries: ['places', 'drawing'],
            }}
            defaultCenter={center}
            defaultZoom={defaultProps.zoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            onClick={({ x, y, lat, lng, event }) => {
              setLatMarker(lat)
              setLngMarker(lng)
              const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) }
              var geocoder = new google.maps.Geocoder()
              geocoder.geocode(
                { location: latlng },
                function (results, status) {
                  if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                      const request = {
                        placeId: results[1].place_id,
                        fields: [
                          'name',
                          'formatted_address',
                          'place_id',
                          'geometry',
                        ],
                      }

                      const service = new google.maps.places.PlacesService(
                        mapInstance,
                      )

                      service.getDetails(request, (place, status) => {
                        if (
                          status ===
                            google.maps.places.PlacesServiceStatus.OK &&
                          place &&
                          place.geometry &&
                          place.geometry.location
                        ) {
                          setAddress(place.formatted_address)
                        }
                      })
                    } else {
                      window.alert('No results found')
                    }
                  } else {
                    window.alert('Geocoder failed due to: ' + status)
                  }
                },
              )
            }}
          >
            <AnyReactComponent lat={latMarker} lng={lngMarker} />
            {apiReady && (
              <SearchBox
                map={mapInstance}
                mapsapi={mapsapi}
                setLatMarker={setLatMarker}
                setLngMarker={setLngMarker}
                setAddress={setAddress}
              />
            )}
          </GoogleMapReact>
          <Typography variant="subtitle2" gutterBottom mt={2}>
            {address}
          </Typography>
        </>
      )}
    </div>
  )
})

export default MapCustom
