#############################################################################################
#                                                                                           #
#                       If you paid for this you got scammed!                               #
#        __   ____      ____    _           __             __                         __    #
# __ __ / /  |_  /___  / __/___( )___   ___/ /__ _  _____ / /__  ___  __ _  ___ ___  / /_   #
# \ \ // _ \_/_ </ _ \/ _ \/ -_)/(_-<  / _  / -_) |/ / -_) / _ \/ _ \/  ' \/ -_) _ \/ __/   #
#/_\_\/_.__/____/_//_/\___/\__/ /___/  \_,_/\__/|___/\__/_/\___/ .__/_/_/_/\__/_//_/\__/    #
#                                dc.xb3n6e.hu                 /_/                           #
#                     If you have any issues with my project,                               #
#                 please reach out to me on Discord or anywhere else!                       #
#                                                                                           #
#############################################################################################

import pymysql

def add_license_key(discord_username, license_key, user_id, expiration_date):
    # Database settings
    db_host = 'host'
    db_user = 'username'
    db_password = 'password'
    db_name = 'yourdatabase'

    # Database connection creating
    try:
        connection = pymysql.connect(host=db_host, user=db_user, password=db_password, db=db_name)
    except pymysql.Error:
        print("ERROR: Failed to connect to the database.")
        return

    # Adding license key, user_id, and expiration_date to the database.
    try:
        with connection.cursor() as cursor:
            query = "INSERT INTO users (discord_username, license_key, user_id, expiration_date) VALUES (%s, %s, %s, %s) " \
                    "ON DUPLICATE KEY UPDATE license_key = %s, user_id = %s, expiration_date = %s"
            cursor.execute(query, (discord_username, license_key, user_id, expiration_date,
                                   license_key, user_id, expiration_date))
            connection.commit()
            print("The license key, user_id, and expiration_date have been successfully added!")
    except pymysql.Error:
        print("ERROR: Failed to add the license key, user_id, and expiration_date.")

    # Close connection with database
    connection.close()

# Providing the username, license key, user_id, and expiration_date.
discord_username = input("Please provide the Discord username of the License key owner (For example: xb3n6e#1111):   ")
user_id = input("Please provide the Discord ID of the License key owner:   ")
license_key = input("Please provide the unique License key:   ")
expiration_date = input("Please provide the expiration date of the License key (For example: 2023-12-31):   ")

# Adding the license key, user_id, and expiration_date to the user.
add_license_key(discord_username, license_key, user_id, expiration_date)