<h1 align="center">
    <img src="src/assets/icons/icon.png" width="256">
    <br />
    Scouting
    <br />
      <img src="https://img.shields.io/badge/version-2-purple.svg">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg">
</h1>

<h4 align="center">
    A website and PWA for scouting teams at FRC competitions built with <a href="https://angular.io">Angular</a>, <a href="https://material.angular.io">Material</a> and <a href="https://firebase.google.com">Firebase</a>
</h4>

<p align="center">
    💡 <a href="#features">Features</a>
    &nbsp;&middot&nbsp;
    🏃 <a href="#getting-started">Getting Started</a>
    &nbsp;&middot&nbsp;
    🚗 <a href="#roadmap">Roadmap</a>
</p>

## Features

- Customizable Schema
  - Sections and widgets can be customized to fit your team's analysis criteria.
<p align="center">
  <img alt="schema" src="https://user-images.githubusercontent.com/88707580/141786924-28b0a64e-bfef-40bd-9ef2-c137e6f9397b.png" height="600"> 
</p>

- Offline Work
- Simple Cross-Platform Installation
- Completions and Verification using The Blue Alliance
- Quick Overview of Missing and Invalid Scouts

<p align="center">
  <img alt="schema" src="https://user-images.githubusercontent.com/88707580/141787195-a28a8a48-31a7-419a-972a-c95d0ea9d646.png" height="600"> 
</p>

- In-App Schema Editor
- Minigames

<p align="center">
  <img alt="schema" src="https://user-images.githubusercontent.com/88707580/141787255-bd9559ad-20c9-48cf-b5b8-cbb0ea44a2a0.png" height="600"> 
</p>

- Security

## Getting Started

- Download the repository, either with `git clone https://github.com/miscar/Scouting` or by downloading the zip archive from GitHub.
- Install [NodeJS](https://nodejs.org/en/download/) and the Node Package Manager.
- Install Scouting's dependencies by running `npm install` in the command-line inside the repository.
- Create a new project by running `npm run create`.
- Enable Cloud Firestore and Google Sign-In inside the Firebase Console.
- Deploy the app to Firebase Hosting and the firestore rules by running `npm run deploy`.
- That's it! You now have a fully usable Scouting instance.

## Roadmap

The following things can greatly improve the quality of the application:

- [ ] Add unit tests.
- [ ] Reduce bundle size.
- [ ] Simplify the Getting Started process.
- [ ] Add more games.

## License

MIT
