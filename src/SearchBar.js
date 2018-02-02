import axios from "axios";
import React, {Component} from "react";
import {ToastContainer, toast} from "react-toastify";
import * as YELP_URI from "./constants";
import SearchResults from "./SearchResults";

// Bring our Yelp API v3 (Fusion) key in from the .env file:
const YELP_API_key = process.env.YELP_API_key;
// Configure axios headers to use our Yelp API key:
axios.defaults.headers.common["Authorization"] = `Bearer ${YELP_API_key}`;
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

// Bring in our CORS-anywhere URL, default https://cors-anywhere.herokuapp.com/
const CORS_ANYWHERE_URL = "https://shrouded-basin-35216.herokuapp.com/";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: false,
      latitude: 0,
      longitude: 0,
      searchText: "",
      selectedYelpDataPullMethod: "rest",
      yelpResults: null
    };
    // This binding is necessary to make `this` work in the callback
    this.errorHandler = this
      .errorHandler
      .bind(this);
    this.getYelpData = this
      .getYelpData
      .bind(this);
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
    this.handleYelpDataPullMethodChange = this
      .handleYelpDataPullMethodChange
      .bind(this);
  }

  // toast setup:
  toastId = null;
  toastNotify = message => toast(message);

  toastUpdate = () => toast.update(this.toastId, {
    type: toast.TYPE.ERROR,
    autoClose: 5000
  });

  toastDismiss = () => {
    toast.dismiss(this.toastId);
    this.setState({isError: false});
  }

  dismissAll = () => toast.dismiss();

  errorHandler = (error, verbose = false) => {
    console.warn("We've got an error here...");
    this.setState({isLoading: false});
    this.toastUpdate(this.toastNotify(error.message));
    this.setState({isError: false});
    if (!verbose === false) {
      console.log(`error: ${error.message}; state: ${JSON.stringify(this.state)}`);
    }
  };

  getYelpData = (latitude, longitude) => {
    // get our Yelp data payload...
    if (this.state.latitude === 0 || this.state.longitude === 0) {
      console.log("ERROR: GPS/LOCATION ISSUE.");
      this.errorHandler({message: "GPS/Location issue."});
    } else {
      const yelpQueryString = `${YELP_URI.API_YELP_SEARCH}term=${this.state.searchText}&latitude=${latitude}&longitude=${longitude}&limit=${ 25}`;
      switch (this.state.selectedYelpDataPullMethod) {
        case "rest":
          // Fetch Yelp data via Axios/REST
          /*
          yelp_client
            .search({term: this.state.searchText, latitude: this.state.latitude, longitude: this.state.longitude, limit: 25})
            .then(response => {
              console.log(response.jsonBody.businesses[0].name);
            })
            .catch(e => {
              console.log(e);
            });
            */

          /*
          yelp
            .searchBusiness({term: this.state.searchText, latitude: this.state.latitude, longitude: this.state.longitude, limit: 25})
            .then((results) => console.log(results))
            .catch(e => {
              console.log(e);
            });
          */

          axios
          //.get(`${CORS_ANYWHERE_URL}${yelpQueryString}`)
            .get(yelpQueryString)
            .then(response => {
              this.setState({yelpResults: response.data});
              // We're done working; let's drop the isLoading flag:
              this.setState({isLoading: false});
            })
            .catch(error => {
              this.errorHandler(error, true);
            });

          /*
          Under Axios, I received this error:
            Failed to load https://api.yelp.com/v3/businesses/search?term=pizza&latitude=33.389757599999996&longitude=-111.9343636&limit=25: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access. The response had HTTP status code 403.

          See
            https://stackoverflow.com/questions/44444777/react-isomorphic-fetch-no-access-control-allow-origin-header-with-yelp-fusion
          or
            https://stackoverflow.com/questions/45424182/cant-seem-to-fetch-data-from-the-yelp-api-in-react-app
            */
          break;
        case "request":
          // Fetch Yelp data via request
          console.log("     In request");
          var request = require('request');
          var options = {
            url: `${CORS_ANYWHERE_URL}${yelpQueryString}`,
            headers: {
              "Authorization": "Bearer " + YELP_API_key,
              "Origin": "Chris"
            }
          };

          request(options, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
          });
          break;
        case "corsanywhere":
          // Fetch Yelp data via CORS anywhere See
          // https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-h
          // e ader-is-present-on-the-requested-resource-whe
          console.log("     In CORS anywhere.");
          let myHeaders = new Headers();
          myHeaders.append("Authorization", "Bearer " + YELP_API_key);
          myHeaders.append("Origin", "Chris");

          // fetch("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses
          // /search?ca" +     "tegories=bars&limit=50&location=New York", {headers:
          // myHeaders}).then((res) => {   return res.json(); }).then((json) => {
          // console.log(json); });

          fetch(`${CORS_ANYWHERE_URL}${yelpQueryString}`, {headers: myHeaders}).then((response) => {
            console.log(`RESPONSE:
          ${JSON.stringify(response.json)}`);
            return response.json();
          }).then((json) => {
            console.log(json);
          }).catch(error => {
            this.errorHandler(error, true);
          });

          break;
        default:
          console.log("  In default case.");
          this.setState({yelpResults: null});
      }
    }
  };

  handleSearchTextChange = event => {
    this.setState({searchText: event.target.value});
  };

  handleSubmit = event => {
    event.preventDefault();
    // requestLocationPermission();
    this.setState({isLoading: true});
    // Clear any errors we may have had from a previous attempt:
    this.setState({isError: false});
    navigator
      .geolocation
      .getCurrentPosition(position => {
        this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});
        console.log(`=======> FOUND POSITION: ${JSON.stringify(this.state.latitude)}, ${JSON.stringify(this.state.longitude)}`);
        console.log(`STATE: ${JSON.stringify(this.state)}`);
        //this.errorHandler({message: "Hi!"});
        this.getYelpData(this.state.latitude, this.state.longitude);
      }, error => {
        this.errorHandler({message: `${error.message}`});
        this.setState({latitude: 33.5547386, longitude: -111.8880115});
        this.getYelpData(this.state.latitude, this.state.longitude);
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      });
  };

  handleYelpDataPullMethodChange = event => {
    this.setState({selectedYelpDataPullMethod: event.target.value});
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
                    value={this.state.selectedYelpDataPullMethod}>
                    <option value="rest">Axios/REST</option>
                    <option value="request">Request</option>
                    <option value="corsanywhere">CORS-anywhere</option>
                  </select>
                </label>
                <input
                  type="text"
                  autoFocus
                  name="searchText"
                  onChange={this.handleSearchTextChange}
                  placeholder="Search Yelp for..."
                  value={this.state.searchText}/>
                <input
                  disabled={this.state.searchText.length === 0 || this.state.isLoading || this.state.error}
                  type="submit"
                  value="Submit"/>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12">
          <SearchResults
            isError={this.state.isError}
            isLoading={this.state.isLoading}
            yelpResults={this.state.yelpResults}/>
        </div>
        <ToastContainer/>
      </div>
    );
  }
}

export default SearchBar;
