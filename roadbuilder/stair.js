importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);
var blocks = context.remember();
var session = context.getSession();
var player = context.getPlayer();

var search_line = function (origin, distance) {
    var line_blc_type = String(blocks.getBlock(origin)).split("[")[0];
    var lines = [];
    var lines_string = [];
    var shape = "straight";
    var is_online = function (o, dir) {
        var pos = o.add(dir);
        if (lines_string.indexOf(String(pos)) != -1) return false;
        return String(blocks.getBlock(pos)).split("[")[0] == line_blc_type;
    }
    var dir = BlockVector3.at(1, 0, 0);
    if (String(blocks.getBlock(origin.subtract(dir))).split("[")[0] == line_blc_type) {
        dir = BlockVector3.at(-1, 0, 0);
    }
    var dx = dir.getX(), dz = dir.getZ();
    var up = BlockVector3.at(0, 1, 0);
    var down = BlockVector3.at(0, -1, 0);
    for (var i = 0; i < distance; i++) {
        lines.push(origin);
        lines_string.push(String(origin));
        player.print(dx + "," + dz);
        var left = BlockVector3.at(dz, 0, -dx);
        var right = BlockVector3.at(-dz, 0, dx);
        var straight = BlockVector3.at(dx, 0, dz);
        if (is_online(origin, left.add(up))) {
            dir = left.add(up);
            shape = "inner_right";
        } else if (is_online(origin, left)) {
            dir = left;
            shape = "inner_right";
        } else if (is_online(origin, left.add(down))) {
            dir = left.add(down);
            shape = "inner_right";
        } else if (is_online(origin, straight.add(up))) {
            dir = straight.add(up);
            shape = "straight";
        } else if (is_online(origin, straight)) {
            dir = straight;
            shape = "straight";
        } else if (is_online(origin, straight.add(down))) {
            dir = straight.add(down);
            shape = "straight";
        } else if (is_online(origin, right.add(up))) {
            dir = right.add(up);
            shape = "outer_left";
        } else if (is_online(origin, right)) {
            dir = right;
            shape = "outer_left";
        } else if (is_online(origin, right.add(down))) {
            dir = right.add(down);
            shape = "outer_left";
        } else {
            break;
        }
        dx = dir.getX();
        dz = dir.getZ();

        origin = origin.add(dir);
        var facing = dx == -1 ? "north" : dx == 1 ? "south" : dz == 1 ? "west" : dz == -1 ? "east" : "";
        var blc_str = String(blocks.getBlock(lines[i])).split("[");
        var half = /half=(bottom|top)(,|\])/.exec(blc_str[1])[1];
        blocks.setBlock(lines[i], context.getBlock(blc_str[0] + "[facing=" + facing + ",shape=" + shape + ",half=" + half + "]"));
    }
    return lines;
}
var distance = (Math.min(argv[3], 400) || 400);
var lines = search_line(player.getBlockOn().toVector().toBlockPoint(), distance);
// for (var i in lines)
//     blocks.setBlock(lines[i], context.getBlock(String(blocks.getBlock(lines[i])).split("[")[0] + "[facing=west]"));