import os
import bpy

bpy.context.scene.render.use_overwrite = False
bpy.context.scene.render.use_file_extension = False
#bpy.context.scene.color_depth = '8'

# All folders images are stored in
image_fols = ["Overall", "heads", "torsos", "legs", "hats",
              "sword", "shield"]

# Sets Render Layer
img_types = ["RenderLayer", "Head", "Torso", "Legs", "Hat", "Sword", "Shield"]
cam_names = ["Camera", "head.thumb", "torso.thumb", "legs.thumb",
             "hat.thumb", "sword.thumb", "shield.thumb"]

# CHANGE THIS TO THE INDEX OF THE PART YOU WANT TO RENDER #
partNumber = 1

# The layer we are currently rendering
render = img_types[partNumber]

thumb_file_path = "/tmp\\Minifig-Wizard\\img\\{0}\\thumb\\".format(
    image_fols[partNumber])
image_file_path = "/tmp\\Minifig-Wizard\\img\\{0}\\full\\".format(
    image_fols[partNumber])


def savePath(image_type):
    """Set the proper filename and path"""
    i = 1

    # Set the output path
    # True == image, False == thumbnail
    if image_type:
        file_path = image_file_path
    else:
        file_path = thumb_file_path

    # Set the (mostly) final name
    file_name = "{0}\{1}00{2}.png".format(file_path, render, i)

    #FIXME: Does not work at all
    #try:
        #temp_name = os.path.basename(file_name).strip("Head").split(".")
        #if temp_name[0][3] == "0":
            #if int(temp_name[0][2]) <= 1:
                #file_name = "{0}\Head0{1}.png".format(file_path, i)
        #print(file_name)

        #del temp_name[:]
    #except IndexError:
        #pass

    # An image with that name already exists
    if os.path.exists("{0}\{1}00{2}.png".format(file_path, render, i)):
        i = 2
        # Update with the next number accordingly
        while os.path.exists("{0}\{1}00{2}.png".format(file_path, render, i)):
            i += 1

        # The final file name and file
        file_name = "{0}\{1}00{2}.png".format(file_path, render, i)

    # Send it back
    return file_name

bpy.context.area.type = 'PROPERTIES'
bpy.context.scene.render.use_single_layer = False
bpy.context.space_data.context = 'RENDER_LAYER'

# Set all but the layer we want to be hidden from the render
for name in img_types:
    if name != render:
        bpy.context.scene.render.layers[name].use = False
    bpy.context.scene.render.layers[render].use = True

# Renders Image
bpy.context.area.type = 'VIEW_3D'
bpy.context.scene.objects.active = bpy.data.objects[cam_names[0]]
bpy.ops.view3d.object_as_camera()
bpy.context.area.type = 'PROPERTIES'

# Get the proper file name and path
file_name = savePath(True)

bpy.context.scene.render.filepath = file_name
bpy.context.scene.render.resolution_x = 600
bpy.context.scene.render.resolution_y = 600
bpy.ops.render.render(write_still=True)

# Renders Thumbnail
image_type = False
bpy.context.area.type = 'VIEW_3D'
bpy.context.scene.objects.active = bpy.data.objects[cam_names[partNumber]]
bpy.ops.view3d.object_as_camera()

bpy.context.area.type = 'PROPERTIES'

## Sets Thumbnail Mask ##
#Torso
if render == img_types[2]:
    bpy.context.space_data.context = 'RENDER_LAYER'
    bpy.context.scene.render.layers[img_types[2]].layers_zmask[10] = False
    bpy.context.scene.render.layers[img_types[2]].layers_zmask[13] = False

#Hat
if render == img_types[4]:
    bpy.context.space_data.context = 'RENDER_LAYER'
    bpy.context.scene.render.layers[img_types[4]].layers_zmask[10] = False
    
bpy.context.scene.render.layers[img_types[4]].layers_zmask[11] = False

#Sword
if render == img_types[5]:
    bpy.context.space_data.context = 'RENDER_LAYER'
    bpy.context.scene.render.layers[img_types[5]].layers_zmask[11] = False

#Shield
if render == img_types[6]:
    bpy.context.space_data.context = 'RENDER_LAYER'

bpy.context.scene.render.layers[img_types[6]].layers_zmask[11] = False

# Get the proper file name and path
file_name = savePath(False)

bpy.context.scene.render.filepath = file_name
bpy.context.scene.render.resolution_x = 64
bpy.context.scene.render.resolution_y = 64
bpy.ops.render.render(write_still=True)

# Resets Camera
bpy.context.area.type = 'VIEW_3D'
bpy.context.scene.objects.active = bpy.data.objects[cam_names[0]]
bpy.ops.view3d.object_as_camera()

# Reset RenderLayers
bpy.context.area.type = 'PROPERTIES'

## Reset Thumbnail Masks ##
#Torso
if render == img_types[2]:
    bpy.context.space_data.context = 'RENDER_LAYER'
    bpy.context.scene.render.layers[img_types[2]].layers_zmask[10] = True
    bpy.context.scene.render.layers[img_types[2]].layers_zmask[13] = True
    
#Hat
if render == img_types[4]:
    bpy.context.space_data.context = 'RENDER_LAYER'
    bpy.context.scene.render.layers[img_types[4]].layers_zmask[10] = True
    
bpy.context.scene.render.layers[img_types[4]].layers_zmask[11] = True
    
#Sword
if render == img_types[5]:
    bpy.context.space_data.context = 'RENDER_LAYER'
    bpy.context.scene.render.layers[img_types[5]].layers_zmask[11] = True
    
#Shield
if render == img_types[6]:
    bpy.context.space_data.context = 'RENDER_LAYER'
    bpy.context.scene.render.layers[img_types[6]].layers_zmask[11] = True

# Select some part of the minifigure
bpy.context.scene.objects.active = bpy.data.objects['Minifig.002']

# Resets UI to Text Editor, reenable file extentions
bpy.context.area.type = 'TEXT_EDITOR'
bpy.context.scene.render.use_file_extension = True