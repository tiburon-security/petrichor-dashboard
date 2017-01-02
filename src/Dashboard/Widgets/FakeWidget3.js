import React, { Component } from 'react';


class FakeWidget3 extends Component {
	componentDidMount(){
	console.info("mounted widget 3");	
	}
	render() {
		console.info("rendered widget 3");
		return ( 
				<div className="x_panel tile">
				
					{/* Widget Header */}
					<div className="x_title">
						<h2>Sample Widget 3</h2>
						<ul className="nav navbar-right panel_toolbox">
							<li className="dropdown">
								<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
							</li>
							<li>
								<a className="close-link"><i className="fa fa-close"></i></a>
							</li>
						</ul>
						<div className="clearfix"></div>
					</div>
					{/* End Widget Header */}
					
					
					{/* Widget Content */}
					<div className="x_content">
						my widget content
					</div>
					{/* End Widget Content */}
					
				</div>
			
		);
  
	}

}

export default FakeWidget3;