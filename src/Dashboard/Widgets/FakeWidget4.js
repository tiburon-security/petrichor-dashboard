import React, { Component } from 'react';
import {WidgetHeader, WidgetBody, WidgetContent} from '../WidgetStyles.js'


class FakeWidget4 extends Component {
	
	componentDidMount(){	
		console.debug("FakeWidget4 mounted");
	}
	
	render() {
    
		return (  
			<WidgetBody>
				<WidgetHeader settings_button={true} close_button={true} title="FakeWidget4"/>
				<WidgetContent>Fake data</WidgetContent>
			</WidgetBody>
		);
  
	}

}

export default FakeWidget4;