import discord
from discord.ext import tasks
import requests
import yaml
import time

discordlink = "discord.gg/xb3n6e"  # Change your discord support server
name = "FadedLicense-Test"  # Change name of your product
URL = "http://localhost:8080/api/checklicense?licenseKey="  # Paste here your bot domain name and bot API port (always 8080)

class Main:
    def __init__(self, license_key):
        self.license_key = license_key

    def on_enable(self):
        print(f"Enabling {name}..")
        print("")  # You can remove these lines
        print(f"FadedLicense is responsible for the security of the plugin!")
        print(f"https://builtbybit.com/resources/fade-license-system.29041/")
        print("")

        try:
            json_data = requests.get(URL + self.license_key).json()
            status = json_data['status']
            buyer = json_data['buyer']

            if status == "VALID":
                print("")
                if not buyer:
                    print(f"Dear, N/A!")
                    print(f"Your license is VALID")
                    print(f"For support join our discord server {discordlink}")
                else:
                    print(f"Dear, {buyer}!")
                    print(f"Your license is VALID")
                    print(f"For support join our discord server {discordlink}")
                print("")
            elif status == "INVALID":
                print("")
                print(f"Dear, N/A!")
                print(f"Your license is INVALID ({self.license_key})")
                print(f"For support join our discord server {discordlink}")
                print("")
        except Exception as e:
            print(e)

    def on_disable(self):
        print(f"Disabling {name}..")

# Read license key from config.yml file
def read_config():
    with open('config.yml', 'r') as file:
        config = yaml.safe_load(file)
    return config

config = read_config()
license_key = config['license']['key']

main = Main(license_key)
main.on_enable()
