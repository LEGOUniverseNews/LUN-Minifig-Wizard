# Developing #
If you would like to contribute to the **_LEGO Universe News!_ Minifig Wizard**, you will want to read this.

### Getting Started ###
* Fork the repository by clicking ![the Fork button.](http://i81.servimg.com/u/f81/16/33/06/11/forkme12.png)
* Clone the fork onto your computer by running [`git clone https://github.com/yourusername/LUN-Minifig-Wizard.git`](#) or from your GUI frontend.
* Install [node.js](http://nodejs.org/) and run `npm install` to install all dependencies.
* Read up on the documentation (see [Editing](#editing) below).
* Edit away! You are allowed to edit this project as much as you want, because it is Open Source! Be sure to read the Licenses before you start though.
* Once you finish your work, you can either leave your work on your fork, or if it is a good change that may improve the Minifig Wizard,
submit a [Pull Request](https://github.com/LEGOUniverseNews/LUN-Minifig-Wizard/pulls) by clicking ![the Pull Request button.](http://i81.servimg.com/u/f81/16/33/06/11/pullre10.png)
* If everything checks out, your changes will be merged into the **_LEGO Universe News!_ Minifig Wizard**!
* Don't forget to ![Star!](http://i81.servimg.com/u/f81/16/33/06/11/star11.png)

# Editing #

## Code ##
* The HTML5 spec should be followed at all times, though heavy use of CSS3 is currently not suggested. Follow the formatting already in the scripts.
* Make sure your code is valid! Run `grunt lint` to ensure your code is valid. Also use the [W3C HTML5 Validator](http://validator.w3.org) and the [W3C CSS Validator](http://jigsaw.w3.org/css-validator/) as a final test. (**Hint:** a full list of all tasks, including minifying the code, run `grunt default`).
* `Developer/Scripts/makejson.py` is used to generate a new `img/images.json` file, which lists all the available images for use. This should be run every time images are added/updated.
It is written in [Python](http://python.org) and requires a Python interpreter to run. While Python 2.7 backward-compatibility is present, support for that version is limited. It is recommended to use a Python 3.3+ interpreter.

## Images ##

###Textures###

* All textures in the **_LEGO Universe News!_ Minifig Wizard**, were created by [**@rioforce**](https://github.com/rioforce) and are initially available in his [LEGO Textures repository](https://github.com/rioforce/LEGO-Textures#readme).
The textures need to fit a the Minifigure model's UV Map, which you can find in the [`Developer/Models/Minifigs`](#) folder. When creating textures, you should use a LEGO color pallet (such as the one from [Bricklink](http://www.bricklink.com/catalogColors.asp)) to ensure all colors match.
If you are planning on submitting a texture Pull Request, please submit a project (`.PSD,` `.PDN`, etc.) along with a usable `.png` file.

### Rendering ###

* The Minifigure was also created by rioforce using [Blender](http://www.blender.org) (free and open source software).
* The Blender file (.blend file) for the Minifigure and Accessories is located in [`Developer/Models/Minifigs/LUN Minifig Wizard - Minifigure.blend`](#). This file contains the minifigure (Head on Layer 11, Torso on Layer 12, Legs on Layer 13, Hat on Layer 14, Right-Hand Item on Layer 15, Left-Hand Item on Layer 16, and already-rendered items on Layer 10).
* The Blender Internal render engine is used to render the images of the minifigure.
* The materials of the models are all equipped with a reflection map (found in [`Developer/Textures/Reflection Map.png`](#)). The minifigure model has two more texture slots: One for the decals (found in [`Developer/Textures`](#)), and another for a bump map (found in [`Developer/Models/Minifigs/Spec Map.png`](#)).
* The render process is automated. A script located in [`Developer/Scripts/Render-Script.py`](#). This script controls the rendering of the minifig (and accessory) thumbnails and full images (the images displayed in the Minifig Wizard).
The desired full size image and accompanying thumbnail is rendered by changing the value of `partNumber` to the appropriate index on `imgTypes` (be sure to start counting from zero!).
For example, if a new right-hand item (Sword) is to be rendering, change the value of `partNumber` to `5`. The line would then look like `partNumber = 5`. All masking to create seamless placement with other images, image size, and output location is automatically handled for you.
* Full size and thumbnail images are rendered at the same time.
* Rendering images are saved to [`/tmp\\Minifig-Wizard\\img\\{0}\\PART\\`](#), where `FOLDER` is the name of the part you rendered, and `PART` is either the `thumb` and `full` subfolder. This matches the folder structure used by the Minifig Wizard directly, allowing for the folders to be merged directly into the already existent folders.
* If there is a folder merge conflict, the new image is _never_ to overwrite the old one unless it is a better re-render of the same image. Rather, new images are to renamed to the next available number (e.g. if `Head024.png` is the last image, the new one is to be named `Head025.png`).
