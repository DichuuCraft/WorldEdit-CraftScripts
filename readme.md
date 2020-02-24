两个用于World Edit的craftscript脚本
two craftscripts for World Edit
## Earth.js
根据圆柱投影的世界地图图片生成地球图案。
用法：先创建一个任意材质的空心球体(如使用指令`//hsphere`)然后在球心处执行
`/cs earth <地球图片> <刚才创建的空心球的材质> <空心球半径>`
地球图片文件需要放在.minecraft/drawings/目录中
至于为什么先要创建空心球是因为怕我自己栅格化生成的球跟WE自己生成的算法比一样导致不匹配，我也懒得再写第二个版本，就拽回将就用吧。
如果要换其他图片，具体地球图片的颜色处理必须要自行修改源码中的调色板（clothColors与clothBlocks）。推荐先在PS里把图片颜色阈值化。
Inverse cylinderal projection(from a image file) onto sphere
Usage: first use //hsphere to create a hollow sphere, then stand at the center, execute /cs earth <projection image file> <material of hollow sphere you created> <radius of hollow sphere>
projection image file needs to be in the directory .minecraft/drawings/
## 6rings.js
生成一个基于截半二十面体结构的6个大环框架。
用法：在球心处直接执行
`/cs 6ring <棱材质> <顶点材质> <半径> <棱宽>`
其中棱材质就是环形材质，顶点材质是两个环相交部位的材质，棱宽一般无论半径大小都取0.2左右，它是棱宽球面距离角度的正弦值，不是绝对宽度。
Generate a icosidodecahedron based 6-ring pattern on sphere
Usage: stand at the center, execute /cs 6rings <edge material> <vertex material> <radius> <ring width>
Note: The suggest ring width is about 0.2, which is a relative value regardless of sphere radius
