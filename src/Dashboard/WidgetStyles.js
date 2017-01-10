import React, { Component } from 'react';


class WidgetHeader extends Component {
	
  static defaultProps = {
    settings_button: false,
	settings_button_clickhandler: null,
    close_button: false,
	close_button_clickhandler: null,
	title: "Default Header"
  }
  
  static propTypes = {
    settings_button: React.PropTypes.bool.isRequired,
    settings_button_clickhandler: React.PropTypes.string,
    close_button: React.PropTypes.bool.isRequired,
    close_button_clickhandler: React.PropTypes.string,
    title: React.PropTypes.string.isRequired
  }
  
	render() {
		return ( 
				
			<div className="x_title">
			
				<h2>{this.props.title}</h2>
				
				<ul className="nav navbar-right panel_toolbox">
				{this.props.settings_button ? <li><a clickHandler={this.props.settings_button_clickhandler}><i className="fa fa-wrench"></i></a></li> : null}
				{this.props.close_button ? <li><a clickHandler={this.props.close_button_clickhandler}><i className="fa fa-close"></i></a></li> : null}
				</ul>
				<div className="clearfix"></div>
				
			</div>
			
		);
	}
} 

class WidgetBody extends Component {
  
	render() {
		return ( 
			<div className="x_panel tile">{this.props.children}</div>			
		);
	}
} 

class WidgetContent extends Component {
  
	render() {
		return ( 
			<div className="x_content">{this.props.children}</div>			
		);
	}
} 
export {
	WidgetHeader, WidgetBody, WidgetContent
	
}