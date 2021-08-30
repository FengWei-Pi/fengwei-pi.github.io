import ImageSection from "./ImageSection";

import profileImage from "assets/blurred-landscape.jpg";
import uwAerialImage from "assets/UW-aerial.jpg";
import passionfruitImage from "assets/passionfruit-icon.png";

export default function ProfileSection() {
  return (
    <div className={"flex-direction-col align-self-stretch"}>
      <ImageSection
        align="left"
        image={{src: profileImage, alt: "profile image"}}
        title="Hi! I'm "
        title2="FengWei Pi"
        text="A software developer, professional googler/copy-paster,
          obsessed with bug catching, passionate about clean code."
        backgroundColor={null}
        titleClasses="font-weight-thin font-size-4"
        title2Classes="font-weight-normal font-size-4"
      />
      <ImageSection 
        align="right"
        image={{src: uwAerialImage, alt: "UW aerial shot"}}
        title="Computer Science Graduate"
        text={[`I graduated from the University of Waterloo with a Bachelor's of Computer Science in 2020.`,`
          There I was introduced to the fundamentals of programming, studied the all-important data structures and algorithms,
          participated in a game jam, found a passion for AI, and developed a solid foundation for building high-quality, well
          documented projects.
        `]}
      />
      <ImageSection 
        align="left"
        image={{src: passionfruitImage, alt: "Passionfruit logo"}}
        title="Passionfruit - Programmer"
        text={[`My first professional position, Pasionfruit is a company with a goal of creating meaningful connections
        between people through their passions.`,
        `With no prior exprience, I taught myself the basics of technologies and software architecture concepts required
        of me in the first week, including React, React Native, React Navigation, the client server model, asynchronous
        Javascript, REST API, Node.js, Express.js, MongoDB, PostgreSQL, Git, JSDoc, Jest, and others.`,
        `This enabled me to quickly contribute to documentation, bug fixes, and feature implementations while refining
        best practices, helping successfully launch the mobile app at the end of my 4-month internship.`]}
      />
    </div>
  );
}