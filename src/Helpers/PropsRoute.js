import React, { Component } from 'react';
import { Route } from 'react-router';


const renderMergedProps = (WrappedComponent, passedProps)=>{
    return (
        class Route extends Component{
            render(){
                let props = Object.assign({}, this.props, passedProps)
                return  <WrappedComponent {...props} />
            }
        }
    )
}

const PropsRoute = ({ component, ...rest }) => {
	
	
	
  return (
    <Route {...rest} render={routeProps => {
		let Component = renderMergedProps(component, routeProps, rest);
      return <Component/>;
    }}/>
  );
}

export default PropsRoute