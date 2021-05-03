import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import "./App.css";

import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";

import Home from "./Components/Layout/Home";
import Newspapper from "./Components/Gallary/Newspapper";
import Magazines from "./Components/Gallary/Magazines";
import Books from "./Components/Gallary/Books";

const useStyle = makeStyles({
  container: {
    display: "flex",
  },
  drawerPapper: {
    width: "20%",
    backgroundColor: "black",
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
  content: {
    width: "100%",
    zIndex: "0",
  },
});

function App() {
  const classes = useStyle();
  return (
    <Router>
      <Home />
      <div className={classes.container}>
        <Drawer
          variant="permanent"
          anchor="left"
          open={true}
          classes={{ paper: classes.drawerPapper }}
        >
          <List className={classes.list}>
            <Link to="/" className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <HomeIcon style={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItem>
            </Link>
            <Link to="/newspapper" className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <LibraryBooksIcon style={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary={"Newspapper"} />
              </ListItem>
            </Link>
            <Link to="/magazines" className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <ImportContactsIcon style={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary={"Magazines"} />
              </ListItem>
            </Link>
            <Link to="/books" className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <LocalLibraryIcon style={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary={"Books"} />
              </ListItem>
            </Link>
          </List>
        </Drawer>
        <main className={classes.content}>
          {" "}
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
}

export default App;
