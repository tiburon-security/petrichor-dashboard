import React, { Component } from 'react';
import {WidgetHeader, WidgetBody, WidgetContent} from '../WidgetStyles.js'


class FakeWidget3 extends Component {
	
	componentDidMount(){	
		console.debug("FakeWidget3 mounted");
	}
	
	render() {
    
		return (  
			<WidgetBody>
				<WidgetHeader settings_button={true} close_button={true} title="FakeWidget3"/>
				<WidgetContent>Fake data</WidgetContent>
			</WidgetBody>
		);
  
	}

}

export default FakeWidget3;