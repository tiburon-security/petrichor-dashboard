import React, { Component } from 'react';
import {FullWidget} from '../WidgetStyles.js'


class FakeWidget4 extends Component {
	
	constructor(state){
		super(state);
		
		this.state = ({loading:true})
	}
	
	componentDidMount(){	
		console.debug("FakeWidget4 mounted");
		
		// Simulate loading data for 5 seconds
		setTimeout(() => { this.setState({loading:false}) }, 5000);
	}
	
	render() {
    
		return (  
			<FullWidget settings_button={true} close_button={true} title="FakeWidget4" {...this.props} loading={this.state.loading}>
				<span>Fake data</span>
				<button onClick={() =>{this.setState({loading:!this.state.loading}); setTimeout(() => { this.setState({loading:false}) }, 5000);}}>click to fake loading data</button>
			</FullWidget>
		);
  
	}

}

export default FakeWidget4;