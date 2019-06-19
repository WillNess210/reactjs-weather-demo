import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      city: "Boulder"
    };
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.updateCity = this.updateCity.bind(this);
  }
  componentDidMount() {
    this.setState({isLoading: true});
  }
  forceUpdateHandler(){
    this.forceUpdate();
  }
  updateCity(e){
    this.setState({city: e.target.value});
  }
  render() {
    console.log("Rendering!");
    return(
    <div>
      <WeatherInfo city = {this.state.city}/>
      {/*<input type = "text" onChange = {this.updateCity}/>
      <button onClick = {this.forceUpdateHandler}> Update </button> */}
    </div>);
  }
}

class Header extends Component {
  render(){
    return(
      <h1 id = "header"> Weather for {this.props.location} </h1>
    );
  };
}

class WeatherCard extends Component{
  render(){
    return(
      <div class = "weatherCard">
        <div class = "weatherDay">{this.props.day}</div>
        <div class = "weatherIcon">
          <img src={'https://openweathermap.org/img/w/' + this.props.iconid + '.png'} />
        </div>
        <div class = "weatherTemps">
          <div class = "weatherTemp">{this.props.tempHigh}°</div>
          <div class = "weatherTemp tempLow">{this.props.tempLow}°</div>
        </div>
      </div>
    );
  }
}

class WeatherInfo extends Component{
  constructor(){
    super();
    this.state = {
      weather: []
    };
  }
  componentDidMount(){
    console.log("Finding data for " + this.props.city);
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + this.props.city + ',us&units=imperial&APPID=c6e37785c8fc15099d7c0d9618b187d9')
    .then(res => res.json())
    .then((data) => {
      this.setState({weather: data, isLoading: false});
    })
    .catch(console.error);
  }

  render(){
    console.log("city: " + this.props.city);
    const { weather, isLoading } = this.state;
    if(isLoading || weather.city == null){
      console.log("loading")
      return <p> Loading </p>;
    }else{
      return (
        <div>
          <Header location = {weather.city.name + ", " + weather.city.country}/>
          <div id = "weatherRow">
            {this.renderWeatherCards()}
          </div>
        </div>
      );
    }
  }

  renderWeatherCards = () => {
    for(var i = 0; i < this.state.weather.list.length; i++){
      this.state.weather.list[i].dt_txt = this.state.weather.list[i].dt_txt.split(" ")[0];
    }
    var minMaxs = [];
    for(var i = 0; i < 5; i++){
      minMaxs.push(["nodate", -999, -999, -999]);
    }
    var curDate = "nodate";
    var curIndex = -1;
    var curIn = 0;
    for(var i = 0; i < this.state.weather.list.length; i++){
      var thisWeather = this.state.weather.list[i];
      if(curDate != thisWeather.dt_txt){
        curDate = thisWeather.dt_txt;
        curIndex++;
        if(curIndex >= 5){
          break;
        }
        curIn = 0;
        minMaxs[curIndex][0] = curDate;
        minMaxs[curIndex][1] = thisWeather.main.temp_min;
        minMaxs[curIndex][2] = thisWeather.main.temp_max;
        minMaxs[curIndex][3] = thisWeather.weather[0].icon;
      }else{
        minMaxs[curIndex][1] = Math.min(minMaxs[curIndex][1], thisWeather.main.temp_min);
        minMaxs[curIndex][2] = Math.max(minMaxs[curIndex][2], thisWeather.main.temp_max);
        curIn++;
        if(curIn == 4){
          minMaxs[curIndex][3] = thisWeather.weather[0].icon;
          console.log("!");
        }
      }
    }
    var weatherList = [];
    for(var i = 0; i < minMaxs.length; i++){
      var thisWeather = minMaxs[i];
      var date = "Today";
      if(i > 0){
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        date = months[parseInt(thisWeather[0].split("-")[1]) - 1] + " " + thisWeather[0].split("-")[2];
      }
      weatherList.push(
        <WeatherCard day = {date} tempLow = {Math.round(thisWeather[1])} tempHigh = {Math.round(thisWeather[2])} iconid = {thisWeather[3]}/>
      );
    }
    return weatherList;
  }

}

render(<App />, document.getElementById('root'));
