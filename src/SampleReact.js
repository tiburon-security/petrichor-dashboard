import React, { Component } from 'react';



export class App extends Component {
  

	render() {
    

		return (
      
			<div className="App">
        
				<div className="App-header">
          
          
						<h2>Welcome to React</h2>
        
				</div>
        
				<p className="App-intro">
          
					To get started, edit <code>src/App.js</code> and save to reload.
        
				</p>
	
				<div className="Main">{this.props.main}</div>
      
			</div>
    
		);
  
	}

}
