importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);
var blocks = context.remember();
var session = context.getSession();
var player = context.getPlayer();

// 深度优先算法获取路径 lines
var search_edge = function (origin, distance, isLeft, dir, corner) {
    var line_blc_type = String(blocks.getBlock(origin));
    var lines = [];
    var lines_string = [];
    var is_corner = 0;
    var is_online = function (o, dir) {
        var pos = o.add(dir);
        if (lines_string.indexOf(String(pos)) != -1) return false;
        return String(blocks.getBlock(pos)) == line_blc_type;
    }
    var dx = dir.getX(), dz = dir.getZ();
    var up = BlockVector3.at(0, 1, 0);
    var down = BlockVector3.at(0, -1, 0);
    var corner_remove = function (delay) {
        if (!corner) return;
        if (is_corner == 0) {
            if (!delay) {
                is_corner = 2;
            } else {
                is_corner = 1;
                lines.pop();
            }
        } else if (is_corner == 1) {
            is_corner = 0;
        } else {
            if (delay) lines.pop();
            is_corner = 0;
        }
    }
    for (var i = 0; i < distance; i++) {
        lines.push(origin);
        lines_string.push(String(origin));
        // player.print(dx + "," + dz);
        var left = BlockVector3.at(dz, 0, -dx);
        var right = BlockVector3.at(-dz, 0, dx);
        if (!isLeft) {
            var temp = left;
            left = right;
            right = temp;
        }
        var straight = BlockVector3.at(dx, 0, dz);
        if (is_online(origin, left.add(up))) {
            dir = left.add(up); corner_remove(true);
        } else if (is_online(origin, left)) {
            dir = left; corner_remove(true);
        } else if (is_online(origin, left.add(down))) {
            dir = left.add(down); corner_remove(true);
        } else if (is_online(origin, straight.add(up))) {
            dir = straight.add(up); is_corner = 0;
        } else if (is_online(origin, straight)) {
            dir = straight; is_corner = 0;
        } else if (is_online(origin, straight.add(down))) {
            dir = straight.add(down); is_corner = 0;
        } else if (is_online(origin, right.add(up))) {
            dir = right.add(up); corner_remove(false);
        } else if (is_online(origin, right)) {
            dir = right; corner_remove(false);
        } else if (is_online(origin, right.add(down))) {
            dir = right.add(down); corner_remove(false);
        } else {
            break;
        }
        dx = dir.getX();
        dz = dir.getZ();

        origin = origin.add(dir);
    }
    return lines;
}
var left = true;
var corner = false;
if (argv[2] == "lc" || argv[2] == "rc" || argv[2] == "c" || argv[2] == "corner") {
    corner = true;
}
if (argv[2] == "l" || argv[2] == "left" || argv[2] == "lc") {
    left = true;
} else if (argv[2] == "r" || argv[2] == "right" || argv[2] == "rc") {
    left = false;
}
var dir = player.getCardinalDirection().toVector();
if (dir.getY()) {
    player.printError("请水平方向看");
} else {
    var distance = (Math.min(argv[3], 400) || 400);
    var lines = search_edge(player.getBlockOn().toVector().toBlockPoint(), distance, left, dir, corner);
}
// context.checkArgs(1, 1, "<材料> [left/right/corner/lc/rc] [距离范围]");
player.print("线路方块数："+lines.length);
for (var i in lines)
    blocks.setBlock(lines[i], context.getBlock(argv[1]));