#! /usr/bin/env python3
# -*- coding: utf-8 -*-
"""LEGO Universe News! Minifig Wizard.

Created 2013-2015 Triangle717 & rioforce
<http://Triangle717.WordPress.com/>
<http://rioforce.WordPress.com/>

Licensed under The MIT License
<http://opensource.org/licenses/MIT>

"""

from __future__ import print_function
import os
import sys
import json

# Support Python 2 and 3 input
# Default to Python 3's input()
get_input = input

# If this is Python 2, use raw_input()
if sys.version_info[:2] <= (2, 7):
    get_input = raw_input  # noqa

# Folder names images are stored in
imageFols = ["hats", "heads", "legs", "torsos", "shield", "sword"]

# Location of output JSON file
jsonFile = os.path.join("..", "..", "img", "images.json")

# Special images to remove optional items
noImageJSON = {
    "fullsize": "img/spark/empty.png",
    "thumbnail": "img/Clear-Selection.png"
}


def _convertFolderNameToJSONName(name):
    conversion = {
        "hats": "hat",
        "heads": "head",
        "legs": "leg",
        "torsos": "torso",
        "shield": "shield",
        "sword": "sword"
    }

    try:
        return conversion[name]

    # That conversion key does not exist
    except KeyError:
        print("Folder name {0} does not exist!".format(name))

        # Abort only on user input
        print("\nThe JSON file has not been generated.")
        get_input("\nPress Enter to close.")
        raise SystemExit(1)


def _getWizardVersion():
    try:
        with open("../../package.json", "rt") as f:
            package = json.load(f)
        return package["version"]
    except ValueError:
        return None


def _makeJSONBase():
    obj = {}
    version = _getWizardVersion()
    if version is not None:
        obj["version"] = version

    for folder in imageFols:  # noqa
        obj[_convertFolderNameToJSONName(folder)] = []
    return obj

# Make the core JSON file structure
newImages = _makeJSONBase()

for folder in imageFols:
    # Get the proper object name
    objectName = _convertFolderNameToJSONName(folder)

    # Add clear selection option to required items
    if objectName in ("hat", "sword", "shield"):
        newImages[objectName].append(noImageJSON)

    # Craw every full-size image folder
    for root, dirnames, filenames in os.walk(
            os.path.join("..", "..", "img", "{0}".format(folder), "full")):

        # Get each file in the list
        for image in filenames:
            bodyType = root.split(os.path.sep)
            imagePath = os.path.join(root, image)

            # The Web uses forward slashes
            if os.path.sep in imagePath:
                imagePath = imagePath.replace(os.path.sep, "/")

            # Remove the `../` generated by the script being
            # folder levels lower than the images
            imagePath = imagePath.strip("../")

            # Create and store an image object
            images = {
                "fullsize": imagePath,
                "thumbnail": imagePath.replace("full", "thumb")
            }
            newImages[objectName].append(images)

# Write the JSON
with open(jsonFile, "wt", encoding="utf_8") as f:
    json.dump(newImages, f, sort_keys=True)

# Delete now unneeded lists
del newImages
del imageFols

# Success!
print("""A new JSON file has been successfully saved to\n
{0}""".format(os.path.abspath(jsonFile)))
get_input("\nPress Enter to close.")
raise SystemExit(0)