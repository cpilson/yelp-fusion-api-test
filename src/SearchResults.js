import * as _ from "lodash";
import React from "react";
import Dots from "react-activity/lib/Dots";

const SearchResults = props => {
  const {isError, isLoading, yelpResults} = props;
  if (!isLoading && !isError && !yelpResults) {
    return (
      <div>
        <p>Results will be displayed here.</p>
      </div>
    );
  } else if (isLoading) {
    return (
      <div style={{
        marginTop: 20
      }}>
        <Dots color={"red"} size={60}/>
      </div>
    );
  } else {
    return yelpResults;
  }
};

export default SearchResults;
