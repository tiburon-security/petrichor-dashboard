import React, { Component } from 'react';


class FakeWidget2 extends Component {
	
	render() {
    
		return (  
				<div className='grid-stack-item-content'>
				<span className='fa fa-times remove-widget'> </span>
				<span className='fa fa-pencil select-use'></span>  
				<span className='fa fa-plus add-nested-widget-box'></span>

				<div>My fake dashboard widget - number 2</div>

				</div>
		);
  
	}

}

export default FakeWidget2;
