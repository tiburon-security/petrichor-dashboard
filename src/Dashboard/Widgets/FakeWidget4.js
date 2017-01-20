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
		setInterval(() => { this.setState({loading:false}) }, 5000);
	}
	
	render() {
    
		return (  
			<FullWidget settings_button={true} close_button={true} title="FakeWidget4" {...this.props} loading={this.state.loading}>
				Fake data
				<a href="#" onClick={() =>{this.setState({loading:!this.state.loading})}}>click</a>
			</FullWidget>
		);
  
	}

}

export default FakeWidget4;