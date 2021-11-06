const { execSync } = require("child_process")
const { readFileSync, writeFileSync } = require("fs")
const { join } = require("path")
const { exit } = require("process")
const { createInterface } = require("readline")

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve))

const main = async () => {
  const teamNumber = await prompt("Enter your team's number (e.g. 1574): ")

  const environment = join("src", "environments", "environment.ts")
  const productionEnvironment = join(
    "src",
    "environments",
    "environment.prod.ts"
  )

  writeFileSync(
    environment,
    readFileSync(environment)
      .toString()
      .replace("team: 1574", `team: ${teamNumber}`)
  )
  writeFileSync(
    productionEnvironment,
    readFileSync(productionEnvironment)
      .toString()
      .replace("team: 1574", `team: ${teamNumber}`)
  )

  execSync("npm exec firebase login", { stdio: "inherit" })

  const id = "scouting-" + Math.floor(Math.random() * 157415741574 + 1574)
  execSync(`npm exec -- firebase projects:create --display-name ${id} ${id}`, {
    stdio: "inherit",
  })

  execSync(`npm exec firebase use ${id}`, {
    stdio: "inherit",
  })

  execSync("npm exec firebase apps:create WEB Scouting", {
    stdio: "inherit",
  })

  writeFileSync(
    ".firebaserc",
    `{
    "projects": {
      "scouting": "${id}",
      "default": "${id}"
    },
    "targets": {
      "${id}": {
        "hosting": {
          "scouting": [
            "${id}"
          ]
        }
      }
    }
  }`
  )

  console.log(
    `Almost done! Please enable Google Authentication in the Firebase Console:
https://console.firebase.google.com/u/0/project/${id}/authentication`
  )
  exit(0)
}

main()
