import React, { Component } from 'react';
import {FullWidget} from '../WidgetStyles.js'


class FakeWidget3 extends Component {
	
	constructor(state){
		super(state);
		
		this.state = ({loading:false})
	}
	
	
	componentDidMount(){	
		console.debug("FakeWidget3 mounted");
	}
	
	
	render() {
    
		return (  
			<FullWidget settings_button={true} close_button={true} title="FakeWidget3" loading={this.state.loading} {...this.props}>
				Fake data
			</FullWidget>
		);
  
	}

}

export default FakeWidget3;