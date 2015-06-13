import React from 'react';
import Home from './components/home';

//console.log(require('modernizr'));
console.log(require('easeljs'));

window.React = React;
const mountNode = document.getElementById('app');

React.render(<Home/>, mountNode);
