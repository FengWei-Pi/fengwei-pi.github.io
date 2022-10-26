import { BrowserRouter, Switch, Route } from "react-router-dom";

import ProfileSection from "./home/ProfileSection";
import ProjectsSection from "./home/ProjectsSection";
import ConnectFourPage from "./connectFour/ConnectFourPage";

// Import base scss, making all defined scss classes available app wide
import "scss/main.scss";

// TODO debug remove
import { Button, ButtonType } from "./common/Button";
import { DropdownButton } from "./common/DropdownButton";
import React from "react";

export default function App() {
  /*
  // TODO debug remove
  const [, refresh] = React.useState(0);

  return (
    <div style={{ margin: 20 }}>
      <Button type={ButtonType.Filled} onClick={() => console.log("button clicked")}>patterns Êg</Button>
      <Button type={ButtonType.Filled} onClick={() => console.log("button clicked")}>overview</Button>
      <Button type={ButtonType.Outline} onClick={() => console.log("button clicked")}>patterns Êg</Button>
      <Button type={ButtonType.Outline} onClick={() => console.log("button clicked")}>overview</Button>
      <Button type={ButtonType.Text} onClick={() => console.log("button clicked")}>patterns Êg</Button>
      <Button type={ButtonType.Text} onClick={() => console.log("button clicked")}>overview</Button>
      <Button type={ButtonType.Text} onClick={() => refresh(prev => prev+1)}>refresh</Button>
      <DropdownButton selectedIndex={2}>
        <div>Option 1</div>
        <div>Option 12345678910</div>
        <div>Option 76</div>
      </DropdownButton>
      <DropdownButton>
        <>Option 1</>
        <img src="https://picsum.photos/200" alt="random"/>
        <>Option 76</>
      </DropdownButton>
      <p>Body Text The Material Design type scale includes a range of contrasting styles that support the needs of your product and its content.

The type scale is a combination of thirteen styles that are supported by the type system. It contains reusable categories of text, each with an intended application and meaning.</p>
    </div>
  );
  */

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
