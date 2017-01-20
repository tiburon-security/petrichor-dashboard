import React, { Component } from 'react';
import LoadingIcon from './loading-icon.svg'

/**
 *
 * Premade widget Styles for uniform display on Dashboard. Usage:
 * 
 * <WidgetBody>
 *   <WidgetHeader title='title'/>
 *   <WidgetContent>My widget content.</WidgetContent>
 * </WidgetBody>
 *
 * Or use the wrapper:
 * <FullWidget title='title'>My widget content.</FullWidget>
 *
 */
 
 
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
    settings_button_clickhandler: React.PropTypes.func,
    close_button: React.PropTypes.bool.isRequired,
    close_button_clickhandler: React.PropTypes.func,
    title: React.PropTypes.string.isRequired
  }
  
	render() {
		return ( 
				
			<div className="x_title widget_draggabble_area">
			
				<h2>{this.props.title}</h2>
				
				<ul className="nav navbar-right panel_toolbox">
				{this.props.settings_button ? <li><a onClick={this.props.settings_button_clickhandler}><i className="fa fa-wrench"></i></a></li> : null}
				{this.props.close_button ? <li><a onClick={this.props.close_button_clickhandler}><i className="fa fa-close"></i></a></li> : null}
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


/**
 * Full widget style wrapper. Includes additional functionality
 * to indicate whether the widget is loading.
 */
class FullWidget extends Component {
	
	constructor(state){
		super(state)
		
		this.state = {loading : this.props.loading};
	}

	static defaultProps = {
		settings_button: false,
		settings_button_clickhandler: null,
		close_button: false,
		close_button_clickhandler: null,
		title: "Default Header",
		loading: true
	}

	static propTypes = {
		settings_button: React.PropTypes.bool.isRequired,
		settings_button_clickhandler: React.PropTypes.func,
		close_button: React.PropTypes.bool.isRequired,
		close_button_clickhandler: React.PropTypes.func,
		title: React.PropTypes.string.isRequired
	}
	
	
	/**
	 * Toggles loading state
	 */
	toggleLoading(){
		this.setState({loading : !this.state.loading});
	}
	
	
	/**
	 * Update loading state if props loading props changed
	 */
	componentDidUpdate(prevProps, prevState){
		if(prevProps.loading != this.props.loading){
			this.setState({loading : this.props.loading});
		}	
	}
	
	render(){
		
		return (
			<WidgetBody>
				<WidgetHeader {...this.props}></WidgetHeader>
					<WidgetContent>
						{(this.state.loading ? <img className="x_loading_overlay" src={LoadingIcon}/> : null)}
						<div style={{"display": (this.state.loading ? "none" : null)}}>{this.props.children}</div>
					</WidgetContent>
			</WidgetBody>
		)
	}
}

export {
	WidgetHeader, WidgetBody, WidgetContent, FullWidget
}