import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingIconImg from './loading-icon.svg'
import styled from 'styled-components';
import WidgetHeader from './WidgetHeader';

 
// Overall container for a widget
const WidgetBody = styled.div`
	overflow: hidden;
	position:relative;
	width:100%;
	height:100%;
	margin-bottom:10px;
	display:flex;
	flex-direction:column;
	background:#fff;
	border:1px solid #E6E9ED;
	column-break-inside:avoid;
	opacity:1;
	transition:all .2s ease;
	padding:10px 17px;
`;

// Container for contents of a widget
const ContentContainer = styled.div`
	position:relative;
	width:100%;
	height:100%;
	float:left;
	clear:both;
	margin-top:5px;
	display:flex;
	flex-direction:column;
	padding:0 5px 6px;

	h4 {
		font-size:16px;
		font-weight:500;
	}
`;

const Content = styled.div`
	height : 100%;
	${props => props.loading && `display:none`};

`;


const LoadingIcon = styled.img`
	position:absolute;
	top:40%;
	left:50%;
	margin-top:-24px;
	margin-left:-24px;
`;

/**
 *
 * Premade widget Styles for uniform display on Dashboard. Usage:
 *
 * <FullWidget title='title'>
 * 	My widget content.
 * </FullWidget>
 *
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
		title: null,
		loading: true
	}

	static propTypes = {
		settings_button: PropTypes.bool.isRequired,
		settings_button_clickhandler: PropTypes.func,
		close_button: PropTypes.bool.isRequired,
		close_button_clickhandler: PropTypes.func,
		title: PropTypes.string
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
		if(prevProps.loading !== this.props.loading){
			this.setState({loading : this.props.loading});
		}	
	}
	
	render(){
				
		return (
			<WidgetBody>
				
				{this.props.title && (
					<WidgetHeader {...this.props}></WidgetHeader>
				)}
			
				<ContentContainer>
				
					{ this.state.loading && (
						<LoadingIcon alt="Loading Icon" src={LoadingIconImg} /> 
					)}
					
					<Content loading={this.state.loading ? 1 : 0}>
						{this.props.children}
					</Content>
					
				</ContentContainer>
			</WidgetBody>
		)
	}
}

export { FullWidget }