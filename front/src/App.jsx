import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'reactstrap';
import { Products } from './products/Products';
import { Sales } from './sales/Sales';
import { Sell } from './sell/Sell';

export const App = () => <Router>
  <Navbar className="navbar mb-4" color="light" light expand="md">
    <Nav navbar>
      <NavItem><Link className="nav-link" to="/">Products</Link></NavItem>
      <NavItem><Link className="nav-link" to="/sales-history">Sales history</Link></NavItem>
      <NavItem><Link className="nav-link" to="/sell">Sell</Link></NavItem>
    </Nav>
  </Navbar>
  <Switch>
    <Route exact path="/"><Products /></Route>
    <Route exact path="/sales-history"><Sales /></Route>
    <Route exact path="/sell"><Sell /></Route>
  </Switch>
</Router>;
