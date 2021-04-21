<h1 align="center">
    <img src="docs/logo.png" width="218.5">
    <br />
    Scouting
    <br />
    <img src="https://img.shields.io/badge/license-MIT-blue.svg">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg">
</h1>

<h4 align="center">
    A website and PWA for scouting teams at FRC competitions built with<a href="https://tailwindcss.com">Tailwind</a>, <a href="https://reactjs.org">React</a> and <a href="https://firebase.google.com">Firebase</a>
</h4>

<p align="center">
    <a href="#features">Features</a>
    &middot
    <a href="#getting-started">Getting Started</a>
    &middot
    <a href="#customizing">Customizing</a>
</p>

## Features

<h4 align="center">
    Create your own criteria and data to track    
</h4>
<h4 align="center">
    Retain values between phone or app restarts using local storage
</h4>
<h4 align="center">
    Update match scouts and prevent duplicates in Firestore
</h4>
<h4 align="center">
    Multiple languages
</h4>
<p align="center">
    <img src="docs/languages.gif" alt="Multi language" width="250" />
</p>

<h4 align="center">
    Fetch match teams from The Blue Alliance
</h4>

<p align="center">
    <img src="docs/tba.gif" alt="TBA teams" width="250" />
</p>

<h4 align="center">
    Minigames (with leaderboards!) in case of delays
</h4>

<p align="center">
    <img src="docs/games.gif" alt="Snake" width="250" />
</p>

## Getting Started

For automatic setup, run the `setup.py`. After running the setup you need to do the following:

-   [Create a schema](#creating-a-schema)

## Manual Setup

### Clone the Repository

-   Make sure you have Git installed.
-   Run `git clone https://github.com/miscar/scouting`.

### Install the Dependencies

-   Scouting requires [NodeJS](https://nodejs.org/en/download) and [Yarn](https://yarnpkg.com/lang/en/docs/install) installed. If you don't have them yet, please install them before continuing.
-   Run `yarn install` inside the scouting directory (if you've just cloned, you need to run `cd scouting`).
-   Create a `.env.local` file and paste the following inside:

```
REACT_APP_API_KEY="XYZ"
REACT_APP_AUTH_DOMAIN="XYZ"
REACT_APP_PROJECT_ID="XYZ"
REACT_APP_STORAGE_BUCKET="XYZ"
REACT_APP_MESSAGING_SENDER_ID="XYZ"
REACT_APP_APP_ID="XYZ"
REACT_APP_TBA_AUTH_KEY="XYZ"
```

### Create a Firebase Project

-   Go to the [Firebase Console](https://console.firebase.google.com) and click "Add Project".
-   Give it some proper name. You can enable or disable Google Analytics, it is not required for Scouting.
-   After your project is created, click the "Web" icon to register the web app.

![Create Web App in Firebase](docs/create_web_app_in_firebase.png)

-   Give it some proper name and **enable** Firebase Hosting for the app!
-   Copy the resulting API Key, Auth Domain, Project ID, Storage Bucket, Messaging Sender ID and App ID to the `.env.local` file instead of `XYZ`.
-   Open Firestore and click "Create database". You can select "Start out in production mode" because the correct Firestore Rules will be uploaded from the local project (Notice `firestore.rules`)

![Create Firestore](docs/create_firestore.png)

-   Click "Start collection" and give it the ID "admin". As the Document ID, enter "version" and add the field "version" of type string with the -value "1.0.0". You can update this value whenever a new update arrives for Scouting to send notifications to users so they update.
-   Follow the instructions on [Creating a schema](#creating-a-schema)

### Create a TBA Authentication Key

-   Inside your [Account Page](https://www.thebluealliance.com/account), under "Read API Keys", choose some description (e.g. "Scouting") and click "Add New Key".
-   Copy the value under "X-TBA-Auth-Key" into `.env.local` in the `REACT_APP_TBA_AUTH_KEY`.

## Creating A Schema

Inside the "admin" collection click "Add document" and give it the ID "schema". It will need fields similar to the following:

![Schema](docs/schema.png)

### Specifying Domain

Change the line `request.auth.token.email.matches(".*@miscar1574[.]org");` inside `firestore.rules` to match your team's address.
If you don't have an adress, you may remove the statement from the `if` block like so:
```
function isValidUser(request) {
    return request.auth.uid != null;
}
```
However, any user signed up to your Firebase project will be able to see the schema and scout for you.

### Final Deployment

-   Inside the `scouting` directory, run `yarn run firebase login` to sign in with Google and then `yarn run firebase use --add` to select the project you've just created.
-   Run `yarn deploy`.
-   You're done! You should see the live link of your very own Scouting instance.

## Customizing

-   If using this for your own team, you should probably change the following
    -   Inside the [manifest](./public/manifest.json) you can change the theme and background colors as well as the icon
    -   You can also swap the `favicon.ico` and `icon.png` files in the [public](./public) directory
    -   You can change the custom colors in [the tailwind configuration](./tailwind.config.js)
    -   You can change the font family by swapping the Google Fonts import in [the index](./public/index.html) and the [CSS](./src/index.css)
    -   You can set `REACT_APP_DEFAULT_LANGUAGE` in the `.env` files to one of the supported languages to set the initial user language. We currently support Hebrew ("he") and English ("en")

## License

MIT
