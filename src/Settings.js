import React, { Component } from 'react';
import { Button } from 'primereact/button';
import firebase from 'firebase';
import ReactRoundedImage from 'react-rounded-image';
import { DB_CONFIG } from './Config';
import { profilePicture } from './constants';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.app = !firebase.apps.length ? firebase.initializeApp(DB_CONFIG) : firebase.app();
    this.database = this.app.database().ref('entries/');
  }



  signOutCurrentUser() {
    firebase.auth().signOut().then(function () {
      console.log('User signed out');
    }, function (error) {
      console.error('Error signing out', error);
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }}>
        <Button
          label="Back"
          className="p-button-rounded p-button-text"
          icon="pi pi-chevron-left"
          iconPos='left'
          style={{ paddingLeft: '20px', paddingTop: '5vh' }}
          onClick={() => {
            window.open('/', '_self');
          }}
        />
        <div style={{ position: 'absolute', right: '5vmin', top: '2vmin' }}>
          <ReactRoundedImage image={profilePicture} imageWidth="80" imageHeight="80" roundedSize='5' />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
          <div style={{ position: 'relative', top: '20vmin' }} >
            <span style={{ fontWeight: 'bold', fontSize: '2rem' }}>
              Name
            </span>
            <br />
            <span>
              {firebase.auth().currentUser.displayName}
            </span>
            <br /><br />
            <span style={{ fontWeight: 'bold', fontSize: '2rem' }}>
              Email
            </span>
            <br />
            <span>
              {firebase.auth().currentUser.email}
            </span>
            {/* <Button
              className='p-button-rounded'
              label="Sign Out"
              style={{ fontSize: '7vw' }}
            /> */}
          </div>
          <div style={{ position: 'absolute', bottom: '50px', display: 'flex', width: '100vw', justifyContent: 'center' }}>
            <Button
              label="Sign Out"
              style={{ fontSize: '1.2rem' }}
              className="p-button-rounded"
              onClick={() => {
                this.signOutCurrentUser();
                window.open('/', '_self');
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;