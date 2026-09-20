# 杭州建筑模型审计

- 模型记录数：49。原始37条补A1–A5、北区未标注实验附楼、北门内侧建筑、南北宿舍联廊及中心组团3段连接体。R1–R3外突附属体使用parts，不虚增为独立命名楼。
- 范围：2023官方校园图可辨建筑。C1–C9、R1–R3、L1–L6、D1–D14、A1–A5、南北食堂、S2/S3/S4均覆盖。S1及S5–S8露天体育场地不拉成楼。
- 坐标：1401×1792；原1920×2454图按两个轴分别比例换算。现有主体轮廓保留并修正C1/C2/C6/C7/C8/C9。R楼凹形平面保留庭院，未以外包矩形填平。
- 官方图中的圆角灰块不等于建筑：经HENN总图交叉对照，宿舍之间为景观/庭院；没有将这些灰块全部拉高。科研楼周边带实线的矩形灰色外突体分别建模。
- 中央C组团地图的灰色大平台也不作为实心整楼，避免填满室外通道。
- 体育三馆在2023图中为连续屋面区域。其内部馆间界线依功能标注近似划分；HENN设计总图与2023功能图体育区有图面差异，因此不把设计总图当竣工测绘。
- 所有高度(18–34场景单位)都是示意；不是楼层或米。屋面65/40同样非实测。

## 飞檐核验

设计方明确395米长、168米跨，主轴南北。总平图的北箭头指向页面右侧，转到北向上后，屋顶长边应沿地图y方向。实景轮廓为两端高、中部低连续悬垂屋面；并非南北两片独立悬挑屋顶。中心景观交叉处可见条带透光格栅，建模不可用一块不透明板把中庭全部封死。可按porousBand生成窄格栅条带，外围屋面用axis:y的下凹曲面。

未取得可确定支撑柱坐标/锚点的结构施工资料；不编造精确支撑点。模型bounds是地图配准近似，不等于建筑施工尺寸。

## 公开来源

- 官方校园图：https://zfaien.buaa.edu.cn/Campus/Campus_Map.htm
- HENN文字/实景/设计总图：https://www.henn.com/en/project/hangzhou-international-innovation-institute
- 总图：https://www.henn.com/sites/default/files/styles/xl_scaled/public/images/2025-11/henn_hiii_masterplan.jpg?itok=wNGVD_pR
- 实景：https://www.henn.com/sites/default/files/styles/xl_16_9/public/images/2025-11/1548_img_tf_251013_n6_website.jpg?itok=PZi_sSCF
- 轴线图：https://www.henn.com/sites/default/files/styles/xl_scaled/public/images/2025-11/henn_hiii_diagram_layers_en.jpg?itok=docuemZZ

本轮联网读取设计方页面并视觉核对上述图像。
