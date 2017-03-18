import React, {Component} from 'react';
import ReactMapboxGl, { Layer, Feature, Popup, ZoomControl } from 'react-mapbox-gl';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import geolib from 'geolib'

// import config from "./config.json";
import style from './map-style.js';
import initial_state from './state/initial_map_state.json';
// to test new locations modify source json here.
import locations from './state/locations.json';

// const { accessToken } = config;
function getDeliveryPoints() {
	// mock api call
	return locations;
}

// Route View Controller
export default class ReactMapbox extends Component {

	constructor() {
		super();
    this.state = {
      map: initial_state,
      delivery_locations: [],
      fit_bounds: {}
    };
  }

  // called before rendering
  componentWillMount() {
  	this.setState({delivery_locations: getDeliveryPoints()}, function() {
  		// process for retrieving bounds of points
  		var coords = this.state.delivery_locations.map(location => {
	  		//console.log(location);
	  		var coord = {
	  			latitude: location.Latitude,
	  			longitude: location.Longitude
	  		}
	  		return coord;
	  	})
	  	var bounds = geolib.getBounds(coords);
	  	console.log(bounds);
	  	var structuredBounds = [[bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]];
	  	console.log(structuredBounds);
	  	this.setState({fit_bounds: structuredBounds});
	  });
  }

	render() {
		return (
			<Router>
				<Route exact={true} path="/" render={() => (
					<MapView map_data={this.state}/>
				)}/>
			</Router>
		);
	}
}

class MapView extends Component {

	state = this.props.map_data

	_onControlClick = (map, zoomDiff) => {
	    const zoom = map.getZoom() + zoomDiff;
	    this.setState({ zoom: [zoom] });
	};

	_markerClick = (location, { feature }) => {
    this.setState({
      center: feature.geometry.coordinates,
      zoom: [14],
      active_feature: feature.key,
      location: location,
      popupShowLabel: true
    });
  };

  _onDrag = () => {
    if (this.state.location) {
      this.setState({
        location: null,
        active_feature: null
      });
    }
  };

  _onToggleHover(cursor, { map }) {
    map.getCanvas().style.cursor = cursor;
  }

  _popupChange(popupShowLabel) {
    this.setState({ popupShowLabel });
  }

	render() {
		const { location, skip, end, popupShowLabel, active_feature } = this.state;

		return (
			<div id="map">
				<ReactMapboxGl
				  style="mapbox://styles/mapbox/streets-v8"
				  accessToken="pk.eyJ1IjoibGFuZWZlbGtlciIsImEiOiJjajBjdW1jNTAwM3ppMnhwZ2RyNXB0NDhzIn0.3L7Yzv7pPdG9MXnceUGvpA"
				  center={this.props.map_data.map.center}
				  zoom={this.props.map_data.map.zoom}
				  containerStyle={style.container}
          onDrag={this._onDrag}
          fit_bounds={this.state.fit_bounds}
				  >

				  <Layer
			      type="symbol"
			      id="marker"
			      cluster={false}
			      layout={{ "icon-image": "marker-15" }}
			      >
		      	{
		      		this.props.map_data.delivery_locations
		      			.map( (location, i) => (
			      			<Feature
			      				key={i}
			      				onMouseEnter={this._onToggleHover.bind(this, "pointer")}
                    onMouseLeave={this._onToggleHover.bind(this, "")}
                    onClick={this._markerClick.bind(this, location)}
			      				coordinates={location.location}/>
		      		))
		      	}
				  </Layer>

				  {
					  location && (
              <Popup
                key={active_feature}
                offset={[0, -50]}
                coordinates={location.location}
                style={{
	                  display: popupShowLabel ? "block" : "none"
	                }}>
	                <div>
	                  <span>
	                    <p>Address Line 1: {location.AddressLine1 ? location.AddressLine1 : "" } </p>
	                    <p>Address Line 2: {location.AddressLine2 ? location.AddressLine2 : "" } </p>
	                    <p>Work Area {location.WorkArea ? location.WorkArea : ""}</p>
	                  </span>
	                  <button type="button" onClick={this._popupChange.bind(this, !popupShowLabel)}>
	                    {
	                      "Close"
	                    }
	                  </button>
	                </div>
              </Popup>
            )
	         }
				</ReactMapboxGl>
			</div>
		)
	}
}

