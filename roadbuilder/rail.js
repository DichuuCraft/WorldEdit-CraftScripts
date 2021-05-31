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
    var nopower = argv[1].indexOf("n") != -1;
    var shape = "straight";
    var shapes = [];
    var is_online = function (o, dir) {
        var pos = o.add(dir);
        if (lines_string.indexOf(String(pos)) != -1) return false;
        return String(blocks.getBlock(pos)).split("[")[0] == line_blc_type;
    }
    var getShape = function (dir1, dir2) {
        if ((dir1.getX() == 1 && dir2.getX() == 1) || (dir1.getX() == -1 && dir2.getX() == -1)) {
            return true;
        }
        if ((dir1.getZ() == 1 && dir2.getZ() == 1) || (dir1.getZ() == -1 && dir2.getZ() == -1)) {
            return true;
        }
        return false;
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
        var left = BlockVector3.at(dz, 0, -dx);
        var right = BlockVector3.at(-dz, 0, dx);
        var straight = BlockVector3.at(dx, 0, dz);
        if (is_online(origin, left.add(up))) {
            shape = getShape(dir, left.add(up));
            dir = left.add(up);
        } else if (is_online(origin, left)) {
            shape = getShape(dir, left);
            dir = left;
        } else if (is_online(origin, left.add(down))) {
            shape = getShape(dir, left.add(down));
            dir = left.add(down);
        } else if (is_online(origin, straight.add(up))) {
            shape = getShape(dir, straight.add(up));
            dir = straight.add(up);
        } else if (is_online(origin, straight)) {
            shape = getShape(dir, straight);
            dir = straight;
        } else if (is_online(origin, straight.add(down))) {
            shape = getShape(dir, straight.add(down));
            dir = straight.add(down);
        } else if (is_online(origin, right.add(up))) {
            shape = getShape(dir, right.add(up));
            dir = right.add(up);
        } else if (is_online(origin, right)) {
            shape = getShape(dir, right);
            dir = right;
        } else if (is_online(origin, right.add(down))) {
            shape = getShape(dir, right.add(down));
            dir = right.add(down);
        } else {
            break;
        }
        dx = dir.getX();
        dz = dir.getZ();
        shapes.push(shape);
        origin = origin.add(dir);
        blocks.setBlock(lines[i].add(BlockVector3.at(0, 1, 0)), context.getBlock(shape && !nopower ? "powered_rail" : "rail"));
    }
    player.print("线路总共长" + lines.length + "个方块")
    if (nopower) return;
    var shapeCount = -1;
    var isdetector = [];
    //正向探测
    if (argv[1] && argv[1].indexOf("f") != -1) {
        for (var i = 0; i < lines.length; i++) {
            isdetector[i] = false;
            if (shapes[i] === false) {
                shapeCount = -1;
            } else if (shapeCount == -1) {
                if (shapes[i] === true) {
                    blocks.setBlock(lines[i].add(BlockVector3.at(0, 1, 0)), context.getBlock("detector_rail"));
                    isdetector[i] = true;
                }
                shapeCount++;
            } else {
                shapeCount++;
            }
        }
    }
    //逆向探测
    shapeCount = -1;
    if (argv[1] && argv[1].indexOf("b") != -1) {
        for (var i = lines.length - 1; i >= 0; i--) {
            if (shapes[i] === false) {
                shapeCount = -1;
            } else if (shapeCount == -1) {
                if (shapes[i] === true) {
                    blocks.setBlock(lines[i].add(BlockVector3.at(0, 1, 0)), context.getBlock("detector_rail"));
                    isdetector[i] = true;
                }
                shapeCount++;
            } else {
                shapeCount++;
            }
        }
    }
    //探测铁轨优化
    shapeCount = -1;
    if (argv[1]) {
        for (var i = 0; i < lines.length; i++) {
            if (shapes[i] === false) {
                shapeCount = -1;
            } else {
                shapeCount++;
                if (shapeCount > 6) {
                    blocks.setBlock(lines[i - 2].add(BlockVector3.at(0, 1, 0)), context.getBlock("detector_rail"));
                    shapeCount = 0;
                }
            }
            if (i < lines.length - 1 && isdetector[i] && isdetector[i + 1]) {
                blocks.setBlock(lines[i].add(BlockVector3.at(0, 1, 0)), context.getBlock("powered_rail"));
                blocks.setBlock(lines[i + 1].add(BlockVector3.at(0, 1, 0)), context.getBlock("powered_rail"));
            }
            if (i > 0 && i < lines.length - 1 && isdetector[i] && shapes[i + 1] === false && shapes[i - 1] === false) {
                blocks.setBlock(lines[i].add(BlockVector3.at(0, 1, 0)), context.getBlock("powered_rail"));
            }
        }
    }
    return lines;
}
var distance = (Math.min(argv[3], 400) || 400);
var lines = search_line(player.getBlockOn().toVector().toBlockPoint(), distance);