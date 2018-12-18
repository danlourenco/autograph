import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Autograph from './Autograph/index';
import cultLogo from './cultivator-box-dark-copy-2.svg';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Autograph width={1000} height={400} backgroundImg={ cultLogo } />
      </div>
    );
  }
}

export default App;
