/*
 by wxyhly(hqak) 2020/1/30
 A icosidodecahedron based 6-ring pattern on sphere
*/
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);
var fy = (Math.sqrt(5)+1)/2;
var verticesList = [[0,1,fy],[1,fy,0],[fy,0,1],[0,-1,fy],[-1,fy,0],[fy,0,-1]];
function getRing(x,y,z,blc1,blc2,ringWidth){
	var count = 0;
	for(var i=0; i<verticesList.length; i++){
		var lx = verticesList[i][0], ly = verticesList[i][1], lz = verticesList[i][2];
		var dot = x*lx + y*ly + z*lz;
		if(Math.abs(dot)<ringWidth){
			count++;
		}
	}
	if(count == 1) return blc1;
	if(count == 2) return blc2;
	return false;
}

context.checkArgs(1, 4, " <edge material> <vertex material> <radius> <ring width>");

var sess = context.remember();

var blc1 = context.getBlock(argv[1]);
var blc2 = context.getBlock(argv[2]);
var origin = player.getBlockIn().toVector().toBlockPoint();
var radius = Number(argv[3]);
var ringWidth = Number(argv[4]);
var R2min = (radius-1)*(radius-1);
var R2max = radius*radius;
for (var x = -radius; x <= radius; x++) {
	var x2 = x*x;
	for (var y = -radius; y <= radius; y++) {
		var y2 = y*y;
		for (var z = -radius; z <= radius; z++) {
			var z2 = z*z;
			var r2 = x2+y2+z2;
			if(r2>R2min&&r2<R2max){
				var R = Math.sqrt(r2);
				var nx = x/R, ny = y/R, nz = z/R;
				var BLC = getRing(nx,ny,nz,blc1,blc2,ringWidth);
				if(BLC) sess.setBlock(origin.add(x,y,z), BLC);
			}
		}
	}
}