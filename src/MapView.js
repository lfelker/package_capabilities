
import React, {Component} from 'react';
import ReactMapboxGl, { Layer, Feature, Popup, ZoomControl, GeoJSONLayer } from 'react-mapbox-gl';
import geolib from 'geolib';
import GraphHopper from 'graphhopper-js-api-client';

import style from './map-style.js';
import route_request from './state/grasshopper_route_optimization.json';
import config from './config.json';

const { mapBoxToken, mapStyle, graphHopperToken } = config;

export default class MapView extends Component {

	state = {
		delivery_locations: this.props.delivery_locations,
		map_data: this.props.map_data,
	};

	componentWillMount() {
		// discover bounds of delivery_locations
		var structuredBounds = this._calculateBounds();
  	this.setState({fit_bounds: structuredBounds});

  	this._buildRoutingRequest();
	  var ghOpt = new GraphHopperOptimization({key: graphHopperToken, profile: "car"});

	  // get optimized route between delivery locations
		ghOpt.doRequest(route_request)
	     .then(json => {
	        var geoJson = {
	        	"type": "FeatureCollection",
    				"features": []
	        }

	        var points = json.solution.routes[0].points;
	        for (var i = 0; i < points.length; i++) {
	        	geoJson.features.push({
	        			"type": "Feature",
				        "geometry": points[i]
	        	});
	        }

	        this.setState({route_layer: geoJson});
	        if (this.state.map_reference) {
	        	this._addLayer(this.state.map_reference, geoJson);
	        }
	     })
	     .catch(function(err){
	        console.error(err.message);
	     });
	}

	// returns bounds in MapBox bounds format
	_calculateBounds() {
		var coords = this.state.delivery_locations.map(location => {
  		var coord = {
  			latitude: location.Latitude,
  			longitude: location.Longitude
  		}
  		return coord;
  	})
  	var bounds = geolib.getBounds(coords);
  	return [[bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]];
	}

	// constructs json request for graphHopper route optimization api and stroes it in the state
	_buildRoutingRequest() {
		var locations = this.state.delivery_locations;
		var firstPoint = locations[0];
	  var servicesArray = [];
	  for (var pointIndex in locations) {
	      if (pointIndex < 1)
	          continue;
	      var point = locations[pointIndex];
	      var obj = {
	          "id": "_" + pointIndex,
	          "name": "maintenance " + pointIndex,
	          "address": {
	              "location_id": "_location_" + pointIndex,
	              "lon": parseFloat(point.Longitude),
	              "lat": parseFloat(point.Latitude)
	          }
	      };
	      servicesArray.push(obj);
	  }

	  var list = [];
	  list.push({
	      "vehicle_id": "vehicle1",
	      "start_address": {
	          "location_id": "_start_location",
	          "lon": parseFloat(firstPoint.Longitude),
	          "lat": parseFloat(firstPoint.Latitude)
	      }
	  });

	  route_request["vehicles"] = list;
	  route_request["services"] = servicesArray;
	}

	// MARKER / POPUP FUNCTIONS
	_markerClick = (location, { feature }) => {
    this.setState({
      center: feature.geometry.coordinates,
      active_feature: feature.key,
      location: location,
      popupShowLabel: true
    });
  };

  _onToggleHover(cursor, { map }) {
    map.getCanvas().style.cursor = cursor;
  }

  _popupChange(popupShowLabel) {
    this.setState({ popupShowLabel });
  }

  // reactJs method for interacting with mapbox-gl-js map object
  // here I store it in state for other functions to access
  _onStyleLoad = (map, event) => {
  	if (this.state.geoJson) {   // in case api call finishes first
  		_addLayer(map, this.state.geoJson);
  	} else { // in case map load finishes first
  		this.setState({
  			map_reference: map
  		});
  	}
  }

  _addLayer(map, geoJson) {
  	map.addLayer({
  		"id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": geoJson
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#4286f4",
            "line-width": 3
        }
    });
  }

	render() {
		const { location, popupShowLabel, active_feature } = this.state;

		return (
			<div id="map">
				<ReactMapboxGl
				  style={mapStyle}
				  accessToken={mapBoxToken}
				  containerStyle={style.container}
          fitBounds={this.state.fit_bounds}
          ref='map'
          onStyleLoad={this._onStyleLoad}
				  >

				  <Layer
			      type="symbol"
			      id="marker"
			      cluster="false"
			      layout={{ "icon-image": "marker-15" }}
			      >
		      	{
		      		this.state.delivery_locations
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
	                    {"Close"}
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