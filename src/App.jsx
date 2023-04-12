import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { Home as HomeIcon, LocalLibrary, LibraryBooks, Contacts } from "@material-ui/icons";

import Home from "./Components/Layout/Home";
import Newspapper from "./Components/Viewer";
import Magazines from "./pages/Magazines";
import Books from "./pages/Books";
import "./app.scss";

const App = () => {
  const menuItems = [
    {
      title: "Home",
      path: "/",
      icon: "home-icon",
      exact: true,
    },
    {
      title: "Newspapper",
      path: "/newspapper",
      icon: "local-library",
      exact: false,
    },
    {
      title: "Magazines",
      path: "/magazines",
      icon: "contacts",
      exact: false,
    },
    {
      title: "Books",
      path: "/books",
      icon: "library-books",
      exact: false,
    },
  ];

  return (
    <Router>
      <div>
        <Home />
        <Drawer
          variant="permanent"
          anchor="left"
          open={true}
          className="container__drawer-paper"
        >
          <List className="container__list">
            {menuItems.map((item) => (
              <ListItem
                component={Link}
                to={item.path}
                button
                className={`container__list-item ${item.exact && "container__list-item--exact"
                  }`}
                key={item.path}
              >
                <ListItemIcon className={`container__list-item-icon container__${item.icon}`}>
                  {item.icon === "home-icon" && <HomeIcon />}
                  {item.icon === "local-library" && <LocalLibrary />}
                  {item.icon === "contacts" && <Contacts />}
                  {item.icon === "library-books" && <LibraryBooks />}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  className="container__list-item-text container__list-item-text--primary"
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className="container__content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/newspapper" component={Newspapper} />
            <Route path="/magazines" component={Magazines} />
            <Route path="/books" component={Books} />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;
