import axios from "axios";
import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import SearchResults from "./SearchResults";

// Bring our Yelp API v3 (Fusion) key in from the .env file:
const YELP_API_key = process.env.YELP_API_key;

// Configure axios headers to use our Yelp API key:
axios.defaults.headers.common["Authorization"] = `Bearer ${YELP_API_key}`;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { isError: false, isLoading: false };
    // This binding is necessary to make `this` work in the callback
    this.errorHandler = this.errorHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // toast setup:
  toastId = null;
  toastNotify = message => toast(message);
  toastUpdate = () =>
    toast.update(this.toastId, { type: toast.TYPE.INFO, autoClose: 5000 });
  toastDismiss = () => toast.dismiss(this.toastId);
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

  handleSubmit = event => {
    event.preventDefault();
    // requestLocationPermission();
    this.setState({ isLoading: true });
    // Clear any errors we may have had from a previous attempt:
    // this.props.errorCleared();
    // And now pull data:
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log(
          `=======> FOUND POSITION: ${position.coords.latitude}, ${
            position.coords.longitude
          }`
        );
        this.props.pushGPS(position.coords.latitude, position.coords.longitude);
        this.pullData(this.props.latitude, this.props.longitude);
      },
      error => {
        this.errorHandler({
          message: `${error.message}; GPS ${this.state.permissionGPS}`
        });
        this.props.pushGPS(33.5547386, -111.8880115);
        this.pullData(this.props.latitude, this.props.longitude);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
    );
  };

  render() {
    return (
      <div>
        <div className="container">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <form>
              <div className="row">
                <div className="radio  col-lg-4 col-md-4 col-sm-12">
                  <label>
                    <input type="radio" value="option1" checked={true} />
                    Option 1
                  </label>
                </div>
                <div className="radio col-lg-4 col-md-4 col-sm-12">
                  <label>
                    <input type="radio" value="option2" />
                    Option 2
                  </label>
                </div>
                <div className="radio col-lg-4 col-md-4 col-sm-12">
                  <label>
                    <input type="radio" value="option3" />
                    Option 3
                  </label>
                </div>
              </div>
              <div className="row">
                <input
                  autoFocus
                  onSubmit={this.handleSubmit}
                  type="submit"
                  value="Submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBar;
