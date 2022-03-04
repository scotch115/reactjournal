import React, { Component } from 'react';
import { Button } from 'primereact/button';
import firebase from 'firebase';
import ReactRoundedImage from 'react-rounded-image';
import { DB_CONFIG } from '../Models/Config';
import { profilePicture } from '../data/constants';
import { Skeleton } from 'primereact/skeleton';

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
       {
         (firebase.auth().currentUser !== null)
          ? <>
            <Button
              label="Back"
              className="p-button-rounded p-button-text"
              icon="pi pi-chevron-left"
              iconPos='left'
              style={{ marginLeft: '20px', marginTop: '5vh' }}
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
                <div style={{width: "300px", position: 'relative', top: '200px'}}>
                  <a href="https://apps.apple.com/us/app/quill-journal/id1552008916?itsct=apps_box&amp;itscg=30200" style={{display: "inlineBlock", overflow: "hidden", borderTopLeftRadius: "13px", borderTopRightRadius: '13px', borderBottomRightRadius: '13px', borderBottomRightRadius: '13px', width: "250px", height: "83px"}} >
                    <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/white/en-US?size=250x83&amp;releaseDate=1612569600&h=b1704f64bbcc8e35d2f6e07d3d35cada" alt="Download on the App Store" style={{borderTopLeftRadius: "13px", borderTopRightRadius: '13px', borderBottomRightRadius: '13px', borderBottomRadius: '13px', width: "250px", height: "83px"}} />
                  </a>
                </div>
                {/* Need to check device type here to make sure phones cant download it */}
                <Button
                  label='Download for Mac'
                  icon='pi pi-download'
                  iconPos='left'
                  className='p-button-raised'
                  style={{ marginTop: '20px' }}
                  onClick={() => window.open('files/Quill_Journal_macOS.dmg', 'download')}
                />
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
            </>
          : <>
              <Button
              label="Back"
              className="p-button-rounded p-button-text"
              icon="pi pi-chevron-left"
              iconPos='left'
              style={{ marginLeft: '20px', marginTop: '5vh' }}
              onClick={() => {
                window.open('/', '_self');
              }}
            />
            <div style={{ position: 'absolute', right: '5vmin', top: '2vmin' }}>
              {/* <ReactRoundedImage image={profilePicture} imageWidth="80" imageHeight="80" roundedSize='5' /> */}
              <Skeleton
                shape='circle'
                width='80px'
                height='80px'
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
              <div style={{ position: 'relative', top: '20vmin' }} >
                <span style={{ fontWeight: 'bold', fontSize: '2rem' }}>
                  Name
                </span>
                <br />
                <span>
                  <Skeleton
                  />
                </span>
                <br /><br />
                <span style={{ fontWeight: 'bold', fontSize: '2rem' }}>
                  Email
                </span>
                <br />
                <span>
                  <Skeleton
                  />
                </span>
                <div style={{width: "300px", position: 'relative', top: '200px'}}>
                  <a href="https://apps.apple.com/us/app/quill-journal/id1552008916?itsct=apps_box&amp;itscg=30200" style={{display: "inlineBlock", overflow: "hidden", borderTopLeftRadius: "13px", borderTopRightRadius: '13px', borderBottomRightRadius: '13px', borderBottomRightRadius: '13px', width: "250px", height: "83px"}} >
                    <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/white/en-US?size=250x83&amp;releaseDate=1612569600&h=b1704f64bbcc8e35d2f6e07d3d35cada" alt="Download on the App Store" style={{borderTopLeftRadius: "13px", borderTopRightRadius: '13px', borderBottomRightRadius: '13px', borderBottomRadius: '13px', width: "250px", height: "83px"}} />
                  </a>
                </div>
                {/* Need to check device type here to make sure phones cant download it */}
                <Button
                  label='Download for Mac'
                  icon='pi pi-download'
                  iconPos='left'
                  className='p-button-raised'
                  style={{ marginTop: '20px' }}
                  onClick={() => window.open('files/Quill_Journal_macOS.dmg', 'download')}
                />
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
            </>
        }
      </div>
    );
  }
}

export default Settings;