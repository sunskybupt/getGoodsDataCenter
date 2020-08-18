import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { HashRouter, Route, Link } from 'react-router-dom'
import Login from './page/Login/Login'
import Home from './page/Home/Home'

ReactDOM.render(
  (<Home />),
  document.getElementById('root')
);