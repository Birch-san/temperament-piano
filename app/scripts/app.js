import React from 'react';
import Home from './components/home';

require('modernizr');

window.React = React;
const mountNode = document.getElementById('app');

React.render(<Home/>, mountNode);
