import React, { Component } from "react";
import "./App.css";
import SearchBar from "./SearchBar";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1 className="App-title">React Yelp Fusion API Testbed</h1>
          Make sure to put your own{" "}
          <a
            href="https://www.yelp.com/developers/v3/manage_app"
            rel="noopener noreferrer"
            target="_blank"
          >
            Yelp API key
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/Rob--W/cors-anywhere/"
            rel="noopener noreferrer"
            target="_blank"
          >
            CORS-Anyware
          </a>{" "}
          instance in <code>.env</code> to use this application.
        </header>
        <p className="App-intro">Make a selection below...</p>

        <SearchBar />
      </div>
    );
  }
}

export default App;
