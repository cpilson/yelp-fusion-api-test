import * as _ from "lodash";
import React from "react";
import Dots from "react-activity/lib/Dots";

const SearchResults = props => {
  const { isError, isLoading, yelpResults } = props;
  if (!isLoading && !isError && !yelpResults) {
    return (
      <div>
        <p>Results will be displayed here.</p>
      </div>
    );
  } else if (isLoading) {
    return (
      <div
        style={{
          marginTop: 20
        }}
      >
        <Dots color="red" size={60} />
      </div>
    );
  } else {
    const myResultByDistance = _.orderBy(
      yelpResults.businesses,
      ["distance"],
      ["asc"]
    );
    let distObject = {};
    distObject.businesses = myResultByDistance;

    // return yelpResults;
    return (
      <div>
        <h3>
          Displaying {yelpResults.businesses.length} results out of{" "}
          {yelpResults.total} on Yelp.
        </h3>
        <ul className="business">
          {distObject.businesses.map(b => (
            <li
              className="business"
              key={b.id}
              onClick={() =>
                console.log(`${b.name} is at ${b.location.display_address}`)
              }
            >
              <div className="text">
                {b.name}
                <span className="badge">
                  <div className="text">
                    {b.distance > 1320
                      ? `${(b.distance / 5280).toFixed(2)} miles`
                      : `${b.distance.toFixed(2)} feet`}
                  </div>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default SearchResults;
