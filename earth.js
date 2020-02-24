/*
 by wxyhly(hqak) 2020/1/30
 inverse cylinderal projection(from a image file) onto sphere
 modified on the example draw.js
 usage: first: use //hsphere to create a hollow sphere, then stand at the center, execute /cs earth <image> <material to be replaced> <radius>
*/
importPackage(Packages.java.io);
importPackage(Packages.java.awt);
importPackage(Packages.javax.imageio);
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);

function makeColor(r, g, b) {
    return new Color(r / 255, g / 255, b / 255);
}
//You can change the color mappings below:
var clothColors = [
    makeColor(255, 255, 255), // hqer
    makeColor(255, 255, 0), // mo
    makeColor(0, 0, 0), // hqo(hqee)
    makeColor(0, 0, 255), // be
    makeColor(0, 255, 0) //vu
];
var clothBlocks = [
	context.getBlock("white_concrete"),
	context.getBlock("yellow_terracotta"),
	context.getBlock("brown_concrete"),
	context.getBlock("glass"),
	context.getBlock("lime_terracotta")
];

// http://stackoverflow.com/questions/2103368/color-logic-algorithm/2103608#2103608
function colorDistance(c1, c2) {
    var rmean = (c1.getRed() + c2.getRed()) / 2;
    var r = c1.getRed() - c2.getRed();
    var g = c1.getGreen() - c2.getGreen();
    var b = c1.getBlue() - c2.getBlue();
    var weightR = 2 + rmean/256;
    var weightG = 4.0;
    var weightB = 2 + (255-rmean)/256;
    return Math.sqrt(weightR*r*r + weightG*g*g + weightB*b*b);
}

function findClosestWoolColor(col, clothColors) {
	var closestId = 0;
	var closestDistance = colorDistance(col, clothColors[0]);
	
	for(var i = 1; i < clothColors.length; i++) {
		var dist = colorDistance(col, clothColors[i]);
		
		if(dist < closestDistance) {
			closestId = i;
			closestDistance = dist;
		}
	}
	
	return closestId;
}


context.checkArgs(1, 3, "<image> <material to be replaced> <radius>");

var f = context.getSafeOpenFile("drawings", argv[1], "png", ["png", "jpg", "jpeg", "bmp"]);
var sess = context.remember();
var colors = clothColors;
if (!f.exists()) {
    player.printError("Specified file doesn't exist.");
} else {
    var img = ImageIO.read(f);
	var blc = context.getBlock(argv[2]);
    var width = img.getWidth();
    var height = img.getHeight();

    var origin = player.getBlockIn().toVector().toBlockPoint();
	var radius = Number(argv[3])+1;
	player.print(radius);
	var R2min = (radius-3)*(radius-3);
    for (var x = -radius; x <= radius; x++) {
		var x2 = x*x;
        for (var y = -radius; y <= radius; y++) {
			var y2 = y*y;
			for (var z = -radius; z <= radius; z++) {
				var z2 = z*z;
				if(x2+y2+z2 < R2min)continue;
				if(String(sess.getBlock(origin.add(x,y,z)))==String(blc)){
					var a = Math.atan2(z,x);
					var r = Math.sqrt(x*x+y*y+z*z);
					var b = -Math.asin(y/r);
					var xx = Math.round((a/Math.PI/2+0.5)*width);
					var yy = Math.round(((b/Math.PI+0.5)*height));
					xx = xx < 0? 0: xx >= width? width-1:xx;
					yy = yy < 0? 0: yy >= height? height-1:yy;
					var c = new Color(img.getRGB(xx, yy));
					var data = findClosestWoolColor(c,colors);
					sess.setBlock(origin.add(x,y,z), clothBlocks[data]);
					
				}
			}
        }
    }
}