import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Components/Layout/Home";
import Newspapper from "./Components/Viewer";
import Magazines from "./pages/Magazines";
import Books from "./pages/Books";

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/newspapper" component={Newspapper} />
        <Route path="/magazines" component={Magazines} />
        <Route path="/books" component={Books} />
      </Switch>
    </Router>
  );
};
