import React, { Component } from 'react';
import {FullWidget} from '../WidgetStyles.js'
import { connect } from 'react-redux';
import { removeDashboardWidget } from '../../redux/actions/Dashboard.js';


/**
*
* TODO - widgetKey is passed into widget so it knows which id to pass to the redux function removeDashboardWidget()
* this requires brreaking out widget styles into individual files to make connecting to redux easier.

/ ALSO work on building the interwidget communications redux functions... let it take/pass arbitrary object of data
*/

class FakeWidget extends Component {
		
	constructor(state){
		super(state);
		
		this.state = ({loading:false})
	}
	
	
	componentDidMount(){	
		console.debug("FakeWidget mounted");
	}
	
	render() {
    
		return (  
			<FullWidget settings_button={true} close_button={true} title="FakeWidget" loading={this.state.loading} {...this.props}>
				Fake data
			</FullWidget>
		);
  
	}

}

const mapStateToProps = (state) => {
    return {
        widgets: state.dashboard.widgets
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        removeDashboardWidget: (id) => dispatch(removeDashboardWidget(id)),
    };
};


export default connect(mapStateToProps, null)(FakeWidget);