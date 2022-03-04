import React from 'react';
import ReactDOM from 'react-dom';
import App from './Login';
import New from './New';
import Settings from './Settings';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

const routing = (
  <BrowserRouter>
    <div>
      <Switch>
        <Route exact path="/" component={App}/> 
        <Route path="/new-entry" component={New} />
        <Route path="/settings" component={Settings} />
      </Switch>
    </div>
  </BrowserRouter>
);


ReactDOM.render(
  routing,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
