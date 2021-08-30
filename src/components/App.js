import {BrowserRouter, Switch, Route } from "react-router-dom";

import ProfileSection from "./home/ProfileSection";
import ProjectsSection from "./home/ProjectsSection";
import ConnectFourPage from "./connectFour/ConnectFourPage";

// Import base scss, making all defined scss classes available app wide
import "scss/base.scss";

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/connectFour">
          <ConnectFourPage />
        </Route>
        <Route path="/">
          <div className={"flex-1 justify-content-center"}>
            <div className={"flex-1 max-width flex-direction-col align-items-center"}>
              <ProfileSection />
              <ProjectsSection />
            </div>
          </div>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}