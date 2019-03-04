import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './components/App';
import HomePage from './components/home/HomePage';

export default (
  // Route path for production build must be a path to subfolder if project is not in root directory
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
  </Route>
);
