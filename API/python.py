import yaml
import pymysql

def check_license():
    # Database settings
    db_host = 'host'
    db_user = 'username'
    db_password = 'password'
    db_name = 'yourdatabase'

    # Reading user license key and discord username
    with open('license.yml', 'r') as file:
        try:
            license_data = yaml.safe_load(file)
            license_code = license_data['license']
            discord_username = license_data['discord_username']
        except yaml.YAMLError:
            print("ERROR: Invalid YAML file.")
            return

    try:
        connection = pymysql.connect(host=db_host, user=db_user, password=db_password, db=db_name)
    except pymysql.Error:
        print("ERROR: Failed to connect to the database.")
        return

    # User discord username
    try:
        with connection.cursor() as cursor:
            query = "SELECT user_id FROM users WHERE discord_username = %s"
            cursor.execute(query, discord_username)
            result = cursor.fetchone()

            if result is None:
                print("ERROR: The user cannot be found in the database.")
                return

            user_id = result[0]
    except pymysql.Error as error:
        print("ERROR: Failed to execute the database query.")
        print("ERROR LOG: ", error)

    # User license key
    try:
        with connection.cursor() as cursor:
            query = "SELECT * FROM users WHERE license_key = %s AND user_id = %s"
            cursor.execute(query, (license_code, user_id))
            result = cursor.fetchone()

            if result is None:
                print("ERROR: Your license is not valid.")
            else:
                print("Your license is valid!")
                # Here is your def
    except pymysql.Error as error:
        print("ERROR: Failed to execute the database query.")
        print("ERROR LOG: ", error)

    # Close connection with database
    connection.close()

# Start license system
check_license()

def main():
    print("You are in the main window!")
    exit()