import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Autograph from './Autograph/index';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Autograph width={1200} height={800} />
      </div>
    );
  }
}

export default App;
