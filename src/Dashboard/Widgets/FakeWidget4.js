import React, { Component } from 'react';


class FakeWidget4 extends Component {
	
	
	
	// Specifies the default values for props:
defaultProps = {
  fake: 'Stranger'
 };
	constructor(props){
		super(props)
		
		this.test = "bro";
	}
	componentDidMount(){
		console.debug("FakeWidget4 mounted");
	}
	
	render() {
    
		return (  
			<div key="a" data-grid={{x: 0, y: 0, w: 1, h: 2}}>FakeWidget4</div>
		);
  
	}

}

export default FakeWidget4;
