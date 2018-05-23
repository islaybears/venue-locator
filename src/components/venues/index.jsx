import React from "react";
import Axios from "axios";
import store from "../../store/index.jsx";

class Venues extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  displayVenues(){
    return this.props.venues.map((val, i) => {
      var image = val.image_url ? <img src={val.image_url} alt={val.name}></img> : <div className="bad-img-url">No Image available</div>;
      if(store.getState().user.username){
        if(val.people_going.indexOf(store.getState().user.username) !== -1)
          var inviteSelf = <div className="invite-self" onClick={() => this.toggleGoing.call(this, val)}>Unmark</div>
        else
          var inviteSelf = <div className="invite-self" onClick={() => this.toggleGoing.call(this, val)}>Mark as going</div>
      }
      else{
        var inviteSelf = <div></div>;
      }

      return (
        <div className="venue" key={i}>
          {image}
          <h4 className="title">{val.name}</h4>
          <div className="address">{val.address}</div>
          <div className="phone">{val.phone_number}</div>
          <div className="link"><a href={val.link}>View Details</a></div>
          <div className="people-going">{val.people_going.length} people going</div>
          {inviteSelf}
          <div className="clearfix"></div>
        </div>
      );
    })
  }
  toggleGoing(venue){
    // if person plans to go
    if(venue.people_going.indexOf(store.getState().user.username) === -1){
      Axios.post("/api/venues/add-to-venue", {
        venueId: venue.venueId,
        people_going: venue.people_going,
        username: store.getState().user.username
      })
      .then( result => {
        console.log(result);
        this.props.updateVenues();
      })
      .catch( err => {
        console.log(err)
      })
    }
    // if person changes mind
    else{
      Axios.post("/api/venues/remove-from-venue", {
        venueId: venue.venueId,
        people_going: venue.people_going,
        username: store.getState().user.username
      })
      .then( result => {
        console.log(result);
        this.props.updateVenues();
      })
      .catch( err => {
        console.log(err)
      })
    }
  }

  render(){
    if(this.props.loading){
      var results = (
        <div className="loading">
          <h2><i className="fa fa-life-ring fa-spin"></i></h2>
        </div>
      )
    }
    else if(!this.props.venues){
      var results = (
        <div className="no-results">
          <h2><i>Find theme parks in your area above</i></h2>
        </div>
      )
    }
    else{
      var list = this.displayVenues();

      var results = (
        <div className="some-results">
          <h3>parks near {this.props.location}</h3>
          {list}
        </div>
      )
    }

    return (
      <div id="venues">
        {results}
      </div>
    )
  }
}

export default Venues;
