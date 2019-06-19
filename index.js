import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <div>
        <Header location = "Boulder"/>
        <WeatherCard day = "Thu" tempLow = "67" tempHigh = "89"/>
        <i class="wi wi-night-sleet"></i>
      </div>
    );
  }
}

class Header extends Component {
  render(){
    return(
      <h1> Weather for {this.props.location} </h1>
    );
  };
}

class WeatherCard extends Component{
  render(){
    return(
      <div class = "weatherCard">
        <div class = "weatherDay">{this.props.day}</div>
        <div class = "weatherIcon"> </div>
        <div class = "weatherTemps">
          {this.props.tempLow}°   {this.props.tempHigh}°
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
