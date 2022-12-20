import { BrowserRouter, Switch, Route } from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import { ValuesPage } from "./pages/ValuesPage";
import ConnectFourPage from "./connectFour/ConnectFourPage";

// Import base scss, making all defined scss classes available app wide
import "scss/main.scss";

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/connectFour">
          <ConnectFourPage />
        </Route>
        <Route exact path="/values">
          <ValuesPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
