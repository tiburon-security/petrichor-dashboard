import React, { Component } from 'react';


class FakeWidget extends Component {
	
	render() {
    
		return (  
			<div data-grid={{x: 0, y: 0, w: 3, h: 2}}>
				<div className='grid-stack-item-content'>
					<span className='fa fa-times remove-widget'> </span>
					<span className='fa fa-pencil select-use'></span>  
					<span className='fa fa-plus add-nested-widget-box'></span>

					<div>My fake dashboard widget - number 1</div>

				</div>
			</div>
		);
  
	}

}

export default FakeWidget;
