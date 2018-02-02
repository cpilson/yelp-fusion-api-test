import React, {Component} from "react";
import "./App.css";
import SearchBar from "./SearchBar";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1 className="App-title">React Yelp Fusion API Testbed</h1>
          {"Make sure to put your own Yelp API key in "}<code>.env</code>{" to use this application."}<br/> {"Your "}<code>.env</code>{" file should contain a single line: "}
          <code>REACT_APP_YELP_API_key="..."</code>
        </header>
        <p className="App-intro">Make a selection below...</p>

        <SearchBar/>
      </div>
    );
  }
}

export default App;
