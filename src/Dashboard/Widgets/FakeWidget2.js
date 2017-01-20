import React, { Component } from 'react';
import {FullWidget} from '../WidgetStyles.js'


class FakeWidget2 extends Component {
	
	constructor(state){
		super(state);
		
		this.state = ({loading:false})
	}
	
	
	componentDidMount(){	
		console.debug("FakeWidget2 mounted");
	}
	
	render() {
    
		return (  
			<FullWidget settings_button={true} close_button={true} title="FakeWidget2" loading={this.state.loading} {...this.props}>
				Fake data
			</FullWidget>
		);
  
	}

}

export default FakeWidget2;