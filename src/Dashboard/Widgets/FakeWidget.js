import React, { Component } from 'react';
import {WidgetHeader, WidgetBody, WidgetContent} from '../WidgetStyles.js'


class FakeWidget extends Component {
	
	componentDidMount(){	
		console.debug("FakeWidget mounted");
	}
	
	render() {
    
		return (  
			<WidgetBody>
				<WidgetHeader settings_button={true} close_button={true} title="FakeWidget"/>
				<WidgetContent>Fake data</WidgetContent>
			</WidgetBody>
		);
  
	}

}

export default FakeWidget;
