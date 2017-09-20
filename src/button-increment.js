import React from 'react';

class Button extends React.Component {
	handleClick = () => {
  	this.props.onClick(this.props.increment);
  }
	render() {
  	return (
      <button onClick={this.handleClick}>
      	+{this.props.increment}
      </button>
    );
  }
}

const Result = (props) => {
  return (
    <div>{props.value}</div>
  );
}

class ButtonIncrementApp extends React.Component {
	state = { counter: 0 };
  
  onIncrementClick = (increment) => {
  	this.setState((prevState) => ({
      	counter: prevState.counter + increment
    }));
  }
  
  render() {
  	return (
    	<div>
      	<Button onClick={this.onIncrementClick} increment={1} />
        <Button onClick={this.onIncrementClick} increment={5} />
        <Button onClick={this.onIncrementClick} increment={10} />
        <Result value={this.state.counter} />
      </div>
    );
  }
}

export default ButtonIncrementApp;