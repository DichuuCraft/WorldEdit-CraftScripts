Some craftscripts for World Edit
## Folder roadbuilder
A scripts collection of curvy road generator and auxiliary scripts. 
todo!();
## Folder spheres
A scripts collection of spherical shape generator. 
### Earth.js
Inverse cylinderal projection(from a image file) onto sphere
Usage: First use `//hsphere` to create a hollow sphere, then stand at the center, execute `/cs earth <projection image file> <material of hollow sphere you created> <radius of hollow sphere>`
projection image file needs to be in the ".minecraft/drawings/" directory.
If you want to change the projection image, you need to edit the palette in the source code(clothColors and clothBlocks). It is recommended to use pre-thresholded image.
### 6rings.js
Generate a icosidodecahedron based 6-ring pattern on sphere
Usage: stand at the center, execute `/cs 6rings <edge material> <vertex material> <radius> <ring width>`
Note: The suggest ring width is around 0.2, which is a relative value regardless of sphere radius.