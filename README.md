# Yelp Fusion API Test

## What This Repository Demonstrates

This repository is a quick test of CORS and CORS-anywhere methods to access the `Yelp Fusion (v3) API` under React 16. [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) fails in the client-side browser (due to `Yelp` failing to return an `Access-Control-Allow-Origin` header), hence the required use of `CORS-Anywhere`.

If you're getting feedback from e.g. Chrome showing the following error when trying to contact the Yelp API, then you'll need the information this repository provides.

```text
Failed to load https://api.yelp.com/v3/businesses/search?term=pizza&latitude=33.389757599999996&longitude=-111.9343636&limit=25:
Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
Origin 'http://localhost:3000' is therefore not allowed access. The response had HTTP status code 403.
```

## How to Use This Repository

To use this repo to demonstrate the Yelp API issue, and demonstrate a work-around:

* [Build the local client](#buildtheclientlocally)
* [Build the CORS-Anywhere helper](#buildandpushacors-anywherehelperservicetoheroku)
* [Configure your `.env` file to point at your CORS-Anywhere helper instance](#configurelocalinstancewithyourcors-anywhereherokuinstance)
* Run locally with `yarn start`. This should open your default web browser to `http://localhost:3000`.

### Build the Client Locally

* Clone this repo into a local folder
* Type `yarn install` to add all the dependencies.
* Rename `.env-sample` to `.env`, and replace the `REACT_APP_YELP_API_key` value with your own. Also replace the `REACT_APP_CORS_ANYWHERE_URL` value with your own Heroku build of the CORS-Anywhere package.

### Build and Push a CORS-Anywhere Helper Service to Heroku

This app requires use of [Rob--W's](https://github.com/Rob--W/cors-anywhere/) [CORS-Anywhere Helper Service](https://cors-anywhere.herokuapp.com/) to proxy Yelp API calls made from client code running in a web browser.

Definitely look at [Rob--W's GitHub repository](https://github.com/Rob--W/cors-anywhere/), but you can deploy your own Heroku build of CORS-Anywhere by doing the following:

* Change to a local directory that holds your GitHub repos. For example, my own GitHub repos all live under `~/Documents/GitHub` (or `C:\Users\Chris\Documents\GitHub` if I'm on Windows)
* `git clone https://github.com/Rob--W/cors-anywhere.git`
* `cd cors-anywhere/`
* `npm install` or `yarn install`, depending on which package manager you're using. I tend towards `yarn` these days.
* `heroku create` (Assuming you already have the Heroku CLI tools installed)
* `git push heroku master`

These steps will give you a site running the CORS-Anywhere code out on Heroku. It's randomized and slugified, so your site name may be something like `https://shrouded-basin-35126.herokuapp.com/`

### Configure Local Instance with Your CORS-Anywhere Heroku Instance

In your `.env` file, replace the default value for `REACT_APP_CORS_ANYWHERE_URL` with your Heroku server instance of CORS-Anywhere.

## Optional: Build a Heroku-Based Client

* See https://github.com/mars/create-react-app-buildpack for information on Heroku deployment if you want to deploy this client-side code to Heroku.

  * NOTE: Heroku won't work with `dotenv`, which I'm using here for local testing.
  * Instead, set up the Heroku environment variables thusly:

    ```text
    heroku config:set REACT_APP_YELP_API_key="<value from your .env file>" REACT_APP_CORS_ANYWHERE_URL="<value from your .env file>"
    ```

    * You can also edit config vars on your app’s settings tab on your Heroku Dashboard, at `https://dashboard.heroku.com/apps/YOUR-APP-NAME/settings`.

* Visit https://dashboard.heroku.com/apps to see a list of _your_ applications deployed on Heroku.

* Make sure your GIT repo is up-to-date, then `git push heroku master` should push the `master` branch of the `yelp-fusion-api-test` repo out to Heroku for production use.
