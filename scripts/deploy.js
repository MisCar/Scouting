const fs = require("fs")
const { exec } = require("child_process")

const rules = fs.readFileSync("firestore.rules")
fs.writeFileSync("firestore.rules", `rules_version = '2';
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
`)
exec("yarn run deploy:firebase --only firestore:rules", () => {
    exec("yarn run deploy:schema", () => {
        fs.writeFileSync("firestore.rules", rules)
        exec("yarn run deploy:firebase")
    })
})