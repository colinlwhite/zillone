import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import connection from '../helpers/data/connection';
import Auth from '../components/Auth/Auth';
import Listings from '../components/Listings/Listings';
import MyNavbar from '../components/MyNavbar/MyNavbar';
import listingRequests from '../helpers/data/listingRequests';
import './App.css';
import authRequests from '../helpers/data/authRequests';
import Building from '../components/Building/Building';
import ListingForm from '../components/ListingForm/ListingForm';

class App extends Component {
  state = {
    authed: false,
    listing: [],
  }

  componentDidMount() {
    connection();
    listingRequests.getRequest()
      .then((listings) => {
        this.setState({ listings });
      })
      .catch(err => console.error('error with listing GET', err));

    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
        });
      } else {
        this.setState({
          authed: false,
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  isAuthenticated = () => {
    this.setState({ authed: true });
  }


  deleteOne = (listingId) => {
    listingRequests.deleteListing(listingId)
      .then(() => {
        listingRequests.getRequest()
          .then((listings) => {
            this.setState({ listings });
      });
    })
    .catch(err => console.error('error with delete single', err));
  }

  render() {
    const logoutClickEvent = () => {
      authRequests.logoutUser();
      this.setState({ authed: false });
    };

    if (!this.state.authed) {
      return (
        <div className="App">
        <MyNavbar isAuthed={this.state.authed} logoutClickEvent={logoutClickEvent} />
        <div className="row">
       <Auth isAuthenticated={this.isAuthenticated}/>
       </div>
        </div>
      );
    }

    return (
      <div className="App">
      <MyNavbar isAuthed={this.state.authed} logoutClickEvent={logoutClickEvent} />
      <div className="row">
      <Listings
      listings={this.state.listings}
      deleteSingleListing={this.deleteOne}
       />
       <Building />
      </div>
      <div className="row">
      <ListingForm />
      </div>
      </div>
    );
  }
}

export default App;
