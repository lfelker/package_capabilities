import React, {Component} from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import initial_state from './state/initial_map_state.json';
import locations from './state/locations.json';
import MapView from './MapView';

export default class ReactMapbox extends Component {

	constructor() {
		super();
    this.state = {
      map: initial_state,
      delivery_locations: locations
    };
  }

	render() {
		return (
			<Router>
				<Route exact={true} path="/" render={() => (
					<MapView delivery_locations={this.state.delivery_locations} map_data={this.state.map} />
				)}/>
			</Router>
		);
	}
}