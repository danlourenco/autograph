import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SignHere from './SignHere/index';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SignHere width={1200} height={800} />
      </div>
    );
  }
}

export default App;
