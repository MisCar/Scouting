const { execSync } = require("child_process")
const { writeFileSync } = require("fs")
const { join } = require("path")

const output = execSync("npm exec firebase apps:sdkconfig WEB", {
  stdio: "pipe",
}).toString()
const configuration = output.substring(
  output.indexOf("{"),
  output.indexOf("}") + 1
)

writeFileSync(join("src", "environments", "firebase.json"), configuration)

// https://console.firebase.google.com/u/0/project/scouting-76930636711/authentication
