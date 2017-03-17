import React, {Component} from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { BrowserRouter as Router, Route} from 'react-router-dom';

// import config from "./config.json";
import style from './map-style.js';
import initial_state from './state/initial_map_state.json';

// const { accessToken } = config;
function getDeliveryPoints() {
	var result = [{
			location: [-0.481747846041145, 51.3233379650232],
			work_area: 1,
			address_line_1: "line 1",
			address_line_2: "line 2"
		},
		{
			location: [-0.163423, 51.509705],
			work_area: 2,
			address_line_1: "line 1",
			address_line_2: "line 2"
		}];

	return result;
}

// Route View Controller
export default class ReactMapbox extends Component {

	constructor() {
		super();
    this.state = {
      map: initial_state,
      delivery_locations: []
    };
  }

  // called before rendering
  componentWillMount() {
  	this.setState({delivery_locations: getDeliveryPoints()});
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

const MapView = ({map_data}) => (
	<div id="map">
		<ReactMapboxGl
		  style="mapbox://styles/mapbox/streets-v8"
		  accessToken="pk.eyJ1IjoibGFuZWZlbGtlciIsImEiOiJjajBjdW1jNTAwM3ppMnhwZ2RyNXB0NDhzIn0.3L7Yzv7pPdG9MXnceUGvpA"
		  center={map_data.map.center}
		  zoom={map_data.map.zoom}
		  containerStyle={style.container}>
		  <Layer
	      type="symbol"
	      id="marker"
	      layout={{ "icon-image": "marker-15" }}>
      	{
      		map_data.delivery_locations
      			.map( (element, i) => (
	      			<Feature
	      				key={i}
	      				coordinates={element.location}/>
      		))
      	}
		  </Layer>
		</ReactMapboxGl>
	</div>
);

