from os import system
from subprocess import Popen, PIPE
from random import randint
from json import loads

print("Welcome to MisCar Scouting Automatic Setup!")

print("Making sure yarn is available...")
if system("yarn --version") != 0:
    print("Invalid yarn installation")
    exit(-1)

print("Installing dependencies...")
system("yarn install")

print("Logging in to Firebase... Please sign in in your browser")
system("yarn run firebase login")

print("Creating a new Firebase project...")
id = f"scouting-{randint(1574, 157415741574)}"
system(f"yarn run firebase projects:create --display-name {id} {id}")
system(f"yarn run firebase use {id}")

output = str(
    Popen(
        "yarn run firebase apps:create WEB Scouting", shell=True, stdout=PIPE
    ).stdout.read()
)
output = output[output.index("firebase apps:sdkconfig WEB") :]
output = output[: output.index("\\n")]

output = str(Popen("yarn run " + output, shell=True, stdout=PIPE).stdout.read())
output = output[output.index("{") : output.index("}") + 1].replace("\\n", "")
output = loads(output)
tba = input("Please enter your TBA Authentication Key: ")
open(".env.local", "w").write(
    f"""
REACT_APP_API_KEY="{output['apiKey']}"
REACT_APP_AUTH_DOMAIN="{output['authDomain']}"
REACT_APP_PROJECT_ID="{output['projectId']}"
REACT_APP_STORAGE_BUCKET="{output['storageBucket']}"
REACT_APP_MESSAGING_SENDER_ID="{output['messagingSenderId']}"
REACT_APP_APP_ID="{output['appId']}"
REACT_APP_TBA_AUTH_KEY="{tba}"
""".strip()
)
email = input(
    "Please enter your team's domain (e.g. miscar1574.org if your team's emails look like programming@miscar1574.org): "
).replace(".", "[.]")
content = (
    open("firestore.rules", "r")
    .read()
    .replace(
        r'request.auth.token.email.matches(".*@miscar1574[.]org")',
        f'request.auth.token.email.matches(".*@{email}")',
    )
)


print(
    f"I did everything I could! Now you need to go to https://console.firebase.google.com/project/{id}/firestore and click 'Create database'"
)
print(
    f"Also, you need to go to https://console.firebase.google.com/project/{id}/authentication, click 'Get started' and enable Google sign-in"
)
