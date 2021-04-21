from os import system
from sys import platform

dependencies = ["requests", "selenium", "chromedriver-binary-auto"]
print("Installing python setup dependencies: " + " ".join(dependencies))
python = "py -3" if platform == "win32" else "python3"
for dependency in dependencies:
    system(python + " -m pip install " + dependency)

from subprocess import Popen, PIPE
from random import randint
from json import loads
from time import sleep
from requests import get
import chromedriver_binary
from selenium.webdriver import Chrome
from selenium.webdriver.support.ui import Select


print("Welcome to MisCar Scouting Automatic Setup!")


def confirm():
    i = input("Yes/No: ")
    if len(i) == 0:
        return True
    return i.lower().startswith("y")


print("Making sure yarn is available...")
if system("yarn --version") != 0:
    print("Yarn not found - checking for nodejs...")
    if system("node --version") != 0:
        if platform == "win32":
            print("Node not found. Would you like to install it?")
            if confirm():
                node = get(
                    "https://nodejs.org/dist/v14.16.1/node-v14.16.1-x86.msi",
                    allow_redirects=True,
                ).content
                open("node-installer.msi", "wb").write(node)
                system("start node-installer.msi")
    system("npm i -g yarn")

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
open("firestore.rules", "w").write(content)

driver = Chrome()
driver.get(f"https://console.firebase.google.com/project/{id}/firestore")

found = False
while not found:
    sleep(2)
    for button in driver.find_elements_by_tag_name("button"):
        try:
            if "Create database" in button.text:
                button.click()
                sleep(2)
                driver.find_element_by_class_name("next").click()
                sleep(2)
                driver.find_element_by_class_name("enable").click()
                sleep(40)
                found = True
                break
        except:
            continue

driver.get(f"https://console.firebase.google.com/project/{id}/authentication")

found = False
while not found:
    for button in driver.find_elements_by_tag_name("button"):
        try:
            if "Get started" in button.text:
                button.click()
                found = True
                break
        except:
            continue

sleep(5)

for row in driver.find_elements_by_tag_name("mat-row"):
    if "Google" in row.text:
        row.click()

sleep(2)

driver.find_element_by_tag_name("mat-slide-toggle").click()
sleep(2)
for select in driver.find_elements_by_tag_name("mat-select"):
    if "Not configured" in select.text:
        select.click()
        break
sleep(2)
driver.find_element_by_tag_name("mat-option").click()
sleep(2)
for button in driver.find_elements_by_tag_name("button"):
    if "Save" in button.text:
        button.click()
        break

sleep(10)

driver.quit()

print("Done! Running the final deployment.")
system("yarn deploy")
print("Deploying starter schema")
system("yarn deploy:schema")
