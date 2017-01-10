import React, { Component } from 'react';
import {WidgetHeader, WidgetBody, WidgetContent} from '../WidgetStyles.js'


class FakeWidget2 extends Component {
	
	componentDidMount(){	
		console.debug("FakeWidget2 mounted");
	}
	
	render() {
    
		return (  
			<WidgetBody>
				<WidgetHeader settings_button={true} close_button={true} title="FakeWidget2"/>
				<WidgetContent>Fake data</WidgetContent>
			</WidgetBody>
		);
  
	}

}

export default FakeWidget2;