import React, {Component} from 'react';

// ES6 
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
// import config from "./config.json";

// const { accessToken } = config;
export default class ReactMapbox extends Component {
	state = {
		center: [-0.481747846041145, 51.3233379650232]
	};

	render() {
		return (
			<div id="map">
				<ReactMapboxGl
				  style="mapbox://styles/mapbox/streets-v8"
				  accessToken="pk.eyJ1IjoibGFuZWZlbGtlciIsImEiOiJjajBjdW1jNTAwM3ppMnhwZ2RyNXB0NDhzIn0.3L7Yzv7pPdG9MXnceUGvpA"
				  center={this.state.center}
				  containerStyle={{
				    height: "100vh",
				    width: "100vw"
				  }}>
				  <Layer
			      type="symbol"
			      id="marker"
			      layout={{ "icon-image": "marker-15" }}>
			      <Feature coordinates={this.state.center}/>
				  </Layer>
				</ReactMapboxGl>
			</div>
		);
	}
}
