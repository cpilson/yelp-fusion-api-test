import axios from "axios";
import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as YELP_URI from "./constants";
import SearchResults from "./SearchResults";
// Check for development vs. production process:
if (!process.env.NODE_ENV === "production") {
  require("dotenv").config();
}

// Limit our Yelp results returned:
const YELP_RESULT_LIMIT = 50;

//Bring our Yelp API v3 (Fusion) key in from the .env file:
const YELP_API_key = process.env.REACT_APP_YELP_API_key;
// Configure axios headers to use our Yelp API key:
axios.defaults.headers.common["Authorization"] = `Bearer ${YELP_API_key}`;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

// Bring in our CORS-anywhere URL, default https://cors-anywhere.herokuapp.com/
// I would encourage you to deploy your own build of CORS-anywhere to Heroku
// for testing. See README.MD for details.
const CORS_ANYWHERE_URL = process.env.REACT_APP_CORS_ANYWHERE_URL;

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: false,
      latitude: 0,
      longitude: 0,
      searchText: "",
      selectedYelpDataPullMethod: "raw-axios",
      yelpResults: null
    };
    // This binding is necessary to make `this` work in the callback under React.
    this.errorHandler = this.errorHandler.bind(this);
    this.getYelpData = this.getYelpData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleYelpDataPullMethodChange = this.handleYelpDataPullMethodChange.bind(
      this
    );
  }

  // toast setup:
  toastId = null;
  toastNotify = message => toast(message);

  toastUpdate = () =>
    toast.update(this.toastId, {
      type: toast.TYPE.ERROR,
      autoClose: 3000 // Close after 3 seconds.
    });

  toastDismiss = () => {
    toast.dismiss(this.toastId);
    this.setState({ isError: false });
  };

  dismissAll = () => toast.dismiss();

  errorHandler = (error, verbose = false) => {
    this.setState({ isLoading: false });
    this.toastUpdate(this.toastNotify(error.message));
    this.setState({ isError: false });
    if (!verbose === false) {
      console.log(
        `error: ${error.message}; state: ${JSON.stringify(this.state)}`
      );
    }
  };

  getYelpData = (latitude, longitude) => {
    // get our Yelp data payload...
    if (this.state.latitude === 0 || this.state.longitude === 0) {
      console.log("ERROR: GPS/LOCATION ISSUE.");
      this.errorHandler({ message: "GPS/Location issue." });
    } else {
      const yelpQueryString = `${YELP_URI.API_YELP_SEARCH}term=${
        this.state.searchText
      }&latitude=${latitude}&longitude=${longitude}&limit=${YELP_RESULT_LIMIT}`;
      /*
      Example to search for "music" as a Yelp term, presenting the user with a location to fill in. If you use location, you should do away with the lat/long and GPS calls, above.
      */

      // const yelpQueryString = `${YELP_URI.API_YELP_SEARCH}term=${"music"}&location=${encodeURI(this.state.searchText)}&limit=${YELP_RESULT_LIMIT}`;

      switch (this.state.selectedYelpDataPullMethod) {
        case "raw-axios":
          // Fetch Yelp data via a raw Axios call
          console.warn("     In raw-axios");

          // This will throw an error in the browser console log, and "just not work" on
          // the rendered side of the client:
          axios
            .get(`${yelpQueryString}`)
            .then(response => {
              this.setState({ yelpResults: response.data });
              // We're done working; let's drop the isLoading flag:
              this.setState({ isLoading: false });
            })
            .catch(error => {
              this.errorHandler(error, true);
              console.warn(`     ERROR: ${JSON.stringify(error)}`);
            });
          break;

        case "corsanywhere":
          // Fetch Yelp data via CORS-Anywhere
          console.log("     In CORS-Anywhere.");

          this.errorHandler({
            message: `Using CORS-Anywhere URL of ${CORS_ANYWHERE_URL}`
          });

          // We're passing the yelpQueryString as an argument to our CORS_ANYWHERE_URL,
          // thus using CORS-Anywhere as a proxy.
          axios
            .get(`${CORS_ANYWHERE_URL}${yelpQueryString}`)
            .then(response => {
              this.setState({ yelpResults: response.data });
              // We're done working; let's drop the isLoading flag:
              this.setState({ isLoading: false });
            })
            .catch(error => {
              this.errorHandler(error, true);
              console.warn(`     ERROR: ${JSON.stringify(error)}`);
            });
          break;

        default:
          console.log("  In default case.");
          this.setState({ yelpResults: null });
      }
    }
  };

  handleSearchTextChange = event => {
    this.setState({ searchText: event.target.value });
    if (event.target.value.length === 0) {
      this.setState({ yelpResults: null });
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    // Clear our Yelp Results:
    this.setState({ yelpResults: null });

    // Drop flags from previous attempts:
    this.setState({ isLoading: true });
    this.setState({ isError: false });

    // Get our GPS coords:
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        console.log(
          `=======> FOUND POSITION: ${JSON.stringify(
            this.state.latitude
          )}, ${JSON.stringify(this.state.longitude)}`
        );
        console.log(`STATE: ${JSON.stringify(this.state)}`);
        this.getYelpData(this.state.latitude, this.state.longitude);
      },
      error => {
        this.errorHandler({ message: `${error.message} Using defaults.` });
        // Give this a default value for lat/long and search using these values. This is
        // test code, remember.
        this.setState({ latitude: 33.5547386, longitude: -111.8880115 });
        this.getYelpData(this.state.latitude, this.state.longitude);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000
      }
    );
  };

  handleYelpDataPullMethodChange = event => {
    this.setState({ selectedYelpDataPullMethod: event.target.value });
  };

  render() {
    return (
      <div>
        <div className="container">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <label>
                  <select
                    onChange={this.handleYelpDataPullMethodChange}
                    value={this.state.selectedYelpDataPullMethod}
                  >
                    <option value="raw-axios">Axios</option>
                    <option value="corsanywhere">Axios/CORS-anywhere</option>
                  </select>
                </label>
                <input
                  type="text"
                  autoFocus
                  name="searchText"
                  onChange={this.handleSearchTextChange}
                  placeholder="Search Yelp near you for..."
                  value={this.state.searchText}
                />
                <input
                  disabled={
                    this.state.searchText.length === 0 ||
                    this.state.isLoading ||
                    this.state.error
                  }
                  type="submit"
                  value="Submit"
                />
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12">
          <SearchResults
            isError={this.state.isError}
            isLoading={this.state.isLoading}
            yelpResults={this.state.yelpResults}
          />
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default SearchBar;
