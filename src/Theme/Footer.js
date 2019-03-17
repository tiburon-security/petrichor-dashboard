import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const StyledFooter = styled.footer`
	background:#fff;
	display:block;
	padding:15px 20px;

	${props => !props.sidebar_menu_is_fullsize && `
		margin-left:70px;
	`}
`;

class Footer extends Component {	
	
	render() {
		return (
            
            
		<StyledFooter sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}>
          <div className="pull-right">
			{this.props.children}
          </div>
          <div className="clearfix"></div>
        </StyledFooter>
        
           
            
		);
	}
}

const mapStateToProps = (state) => {
    return {
        sidebar_menu_is_fullsize: state.sidebar.isFullSize,
    };
};

export default connect(mapStateToProps, null)(Footer);