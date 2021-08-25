import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

const Foo = lazy(() => import("./Foo"));
const Bar = lazy(() => import("./Bar"));
const Bridge = lazy(() => import("./Bridge"));

function App() {
  return (
    <Router>
      <ul>
        <li>
          <Link to="/">/</Link>
        </li>
        <li>
          <Link to="/foo">foo</Link>
        </li>
        <li>
          <Link to="/bar">bar</Link>
        </li>
        <li>
          <Link to="/bridge">bridge</Link>
        </li>
      </ul>
      <br />
      <Suspense fallback={<div>Page is Loading...</div>}>
        <Switch>
          <Route path="/foo">
            <Foo />
          </Route>
          <Route path="/bar">
            <Bar />
          </Route>
          <Route path="/bridge">
            <Bridge />
          </Route>
          <Route exact path="/">
            hello
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
