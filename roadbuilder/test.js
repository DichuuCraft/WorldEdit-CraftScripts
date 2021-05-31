importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.math);
importPackage(Packages.com.sk89q.worldedit.blocks);
var blocks = context.remember();
var session = context.getSession();
var player = context.getPlayer();
var k = context.getBlock("oak_fence[west=true]");
try {
    player.print(k.getState(k.getBlockType().getProperty("weest")));
} catch (e) {
    player.print("hq");
}finally{
    player.print("oma");
}
blocks.setBlock(player.getBlockOn().toVector().toBlockPoint(), k["with"](k.getBlockType().getProperty("east"), true));