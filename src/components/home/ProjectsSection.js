import { useHistory } from "react-router-dom";
import { GoMarkGithub } from "react-icons/go";

import ProjectItem from "components/common/ProjectItem";

import styles from "./ProjectsSection.module.scss";
import connectFourImage from "assets/connect-four.png";
import floodItImage from "assets/flood-it-grid.png";

export default function ProjectsSection() {
  const history = useHistory();

  const navigateToFloodIt = () => {
    window.location.href="https://fengwei-pi.github.io/flood-it-browser/";
  };

  const navigateToConnectFour = () => {
    history.push("/connectFour");
  };

  const openGithubFloodIt = () => {
    window.open("https://github.com/FengWei-Pi/flood-it-browser");
  };

  return (
    <div className="flex-direction-row">
      <div className="flex-basis-1 flex-basis-2-xl"></div>
      <div className={"flex-basis-10 flex-basis-8-xl flex-direction-col padding-bottom-5"}>
        <div className={`
          justify-content-center
          font-size-4
          margin-top-4
          margin-bottom-1
          font-weight-thin
          ${styles.title}
        `}>
          Projects
        </div>
        <ProjectItem
          containerClasses="margin-top-4"
          image={{src: floodItImage, alt: "flood it game"}}
          title="Flood it"
          text={[
            `Flood it is the first program I made while learning web technologies using pure HTML, CSS, and Javascript.`,
            `The goal of the game is to fill a grid with the same color. Clicking on a cell color will change the top left
          cell as well as any adjacent cells of the same color to the clicked color. After the grid is filled with one
          color, or the player runes out of moves, the game ends and a new game can be started with different grid and color
          options.`
          ]}
          buttons={[
            {text: "Play", onClick: navigateToFloodIt},
            {icon: <GoMarkGithub />, onClick: openGithubFloodIt}
          ]}
        />
        <ProjectItem
          containerClasses="margin-top-4"
          image={{src: connectFourImage, alt: "connect four board"}}
          title="Connect Four AI"
          text={[ // TODO: better implementation of inline hyperlinks
            <div style={{display: "inline"}}>
              A connect four playing agent based on{" "}
              <a href="https://deepmind.com/blog/article/alphago-zero-starting-scratch" target="_blank" rel="noreferrer">
                Alphago Zero
              </a>
              . Consisting of a monte-carlo tree search algorithm, a connect four game model, and a small neural network
              implemented in Javascript and{" "}
              <a href="https://www.tensorflow.org/js" target="_blank" rel="noreferrer">
                Tensorflow.js
              </a>
              , the agent trained itself through reinforcement learning on its
              self-play games to play connect four at a reasonable, human level.
            </div>
          ]}
          buttons={[
            {text: "Play", onClick: navigateToConnectFour}
          ]}
        />
      </div>
      <div className="flex-basis-1 flex-basis-2-xl"></div>
    </div>
  );
}