const firebase = require("firebase")
const fs = require("fs")
const dotenv = require("dotenv")
const { exec } = require("child_process")

const rules = fs.readFileSync("firestore.rules", "utf8")
fs.writeFileSync(
    "firestore.rules",
    `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  	match /admin/schema {
    	allow read, write: if true;
    }

  	match /{document=**} {
      allow read, write: if false;
    }
  }
}
`
)
exec("yarn run deploy:firebase --only firestore:rules", () => {
    for (dot of [
        ".env.local",
        ".env.development.local",
        ".env.test.local",
        ".env.production.local",
    ]) {
        dotenv.config({ path: dot })
    }

    if (!firebase.apps.length) {
        firebase.initializeApp({
            apiKey: process.env.REACT_APP_API_KEY,
            authDomain: process.env.REACT_APP_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_PROJECT_ID,
            storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_APP_ID,
        })
    } else firebase.app()

    firebase
        .firestore()
        .doc("/admin/schema")
        .set(JSON.parse(fs.readFileSync("schema.json", "utf8")))
        .then(() => console.log("Success"))
        .catch(() => console.log("Failed"))
    fs.writeFileSync("firestore.rules", rules)
    exec("yarn run deploy:firebase --only firestore:rules")
})
