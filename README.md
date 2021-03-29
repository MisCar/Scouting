# MisCar Scouting

Scouting is a React website and PWA for scouting teams at FRC competitions.

## Getting Started

-   Create a new Firebase project
-   In the Project Overview, add an app for the web and copy the Firebase SDK configuration
-   Paste it inside the `.env` files
    -   Note: you can use different Firebase projects for production, development and testing, by using the `.env.production.local`, the `.env.development.local`, and the `.env.test.local`. Otherwise you can just use `.env.local`
-   Create a Firestore database and set the following rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  	match /admin/schema {
    	allow read: if request.auth.uid != null;
    	allow write: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

-   Create a TBA Read API Authentication Key and put it as `REACT_APP_TBA_AUTH_KEY` in the `.env` file

Your `.env` file should look like so:

```shell
REACT_APP_API_KEY="XYZ"
REACT_APP_AUTH_DOMAIN="XYZ"
REACT_APP_PROJECT_ID="XYZ"
REACT_APP_STORAGE_BUCKET="XYZ"
REACT_APP_MESSAGING_SENDER_ID="XYZ"
REACT_APP_APP_ID="XYZ"
REACT_APP_TBA_AUTH_KEY="XYZ"
```

## Customizing

-   If using this for your own team, you should probably change the following
    -   Inside the [manifest](./public/manifest.json) you can change the theme and background colors as well as the icon
    -   You can also swap the `favicon.ico` and `icon.png` files in the [public](./public) directory
    -   You can change the custom colors in [the tailwind configuration](./tailwind.config.js)
    -   You can change the font family by swapping the Google Fonts import in [the index](./public/index.html) and the [CSS](./src/index.css)
