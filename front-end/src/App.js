
import './App.css';
import {BrowserRouter as Router,Route, Switch} from "react-router-dom";
import Movies from "./components/Movies";
import Crewmembers from "./components/Crewmembers";

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/crewmembers/:id">
            <Crewmembers/>
          </Route>
          <Route path="/">
            <Movies />
          </Route>

        </Switch>
      </Router>
  );
}

export default App;
