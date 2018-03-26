$(function () {
	/**
	 * 1.地图
	 */
	var map = new AMap.Map('container', {
		resizeEnable: true,
		zoom: 3,// 级别
		center: [108.928214, 34.539385]// 中心点(国家大地原点)
	});

	/*/!**
	 * 点标注
	 *!/
	var marker = new AMap.Marker({
		position: [116.362974, 39.951111],//marker所在的位置
	});
	marker.setMap(map);
	marker.on('click', function (e) {
		infowindow.open(map, e.target.getPosition());
	})

	/!**
	 * 插件
	 *!/
	// 工具条&比例尺
	AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
		var toolBar = new AMap.ToolBar();
		var scale = new AMap.Scale();
		map.addControl(toolBar);
		map.addControl(scale);
	})
	// 高级信息窗体，整合了周边搜索、路线规划功能
	AMap.plugin('AMap.AdvancedInfoWindow', function () {
		infowindow = new AMap.AdvancedInfoWindow({
			content: '<div class="info-title">中国健康传媒集团</div><div class="info-content">' +
			'<img src="https://webapi.amap.com/images/amap.jpg">' +
			'中国健康传媒集团是由国务院出资设立、财政部代为履行出资人职责的中央文化企业，隶属国家食品药品监督管理总局。<br/>' +
			'<a target="_blank" href = "http://www.health-china.com/">中国健康传媒集团</a></div>',
			offset: new AMap.Pixel(0, -30)
		});
		infowindow.open(map, [116.362974, 39.951111]);
	})*/


	/**
	 * 2.每日数据量统计(表格)
	 */
	var tableObj = JSON.parse(tableData);
	var categories = tableObj.categories;
	var series = tableObj.series;

	// thead
	var theadStr = "<tr><th></th>";
	for (var k = 0; k < series.length; k++) {
		theadStr += "<th>" + series[k].name + "</th>";
	}
	theadStr += "</tr>";
	$(".smallTab thead").append(theadStr);

	// tbody
	for (var i = 0; i < categories.length; i++) {
		var str = "<tr>";
		str += "<td>" + categories[i] + "</td>";
		for (var j = 0; j < series.length; j++) {
			str += "<td>" + series[j].data[i] + "</td>";
		}
		str += "</tr>";
		$(".smallTab tbody").append(str);
	}

	/**
	 * 3.每日数据量统计(饼图)
	 */
	var trCount = $(".smallTab").find("tbody").find("tr").length;
	var peiDataArray = new Array();
	for (var i = 0; i < trCount - 1; i++) {
		var obj = new Object();
		obj.name = $(".smallTab").find("tbody").find("tr:eq(" + i + ")").find("td:eq(0)").text();
		obj.value = $(".smallTab").find("tbody").find("tr:eq(" + i + ")").find("td:eq(1)").text();
		peiDataArray.push(obj);
	}
	// 动态设置系列列表数据
	pieOption.series[0]['data'] = peiDataArray;
	// 动态设置图例组件数据
	var peilegendArray = new Array();
	for (var i = 0; i < peiDataArray.length; i++) {
		peilegendArray.push(peiDataArray[i].name);
	}
	pieOption.legend['data'] = peilegendArray;
	// 为echarts对象加载数据
	pieChart.setOption(pieOption);


	/**
	 * "当月趋势图"(折线图)
	 */
	var syaqObj = JSON.parse(syaqData);
	var dataTrend = syaqObj.dataTrend;


	var lineLegendArray = new Array();// 图例数据集合
	var lineXArray = new Array();// x轴数据集合
	var lineDataArray = new Array();// 折线图各项数据集合

	for (var key in dataTrend) {
		var itemName = dataTrend[key].name;// 每个类别的名称(新闻,微博,微信,app,电子报......)
		lineLegendArray.push(itemName);
		var itemData = dataTrend[key].data;// 每个类别的数据

		var tempArr = new Array();
		for (var m = 0; m < itemData.length; m++) {// 31天的数据
			var dailyData = itemData[m];
			var x = new Date(dailyData.x).pattern("yyyy-MM-dd");// 时间
			var y = dailyData.y;// 数据
			tempArr.push(y);
		}

		var itemObj = new Object();
		itemObj.name = itemName;
		itemObj.type = 'line';
		itemObj.stack = '总量';
		itemObj.areaStyle = {normal: {}};
		itemObj.data = tempArr;
		lineDataArray.push(itemObj);
	}

	for (var n = 0; n < dataTrend[0].data.length; n++) {
		lineXArray.push(new Date(dataTrend[0].data[n].x).pattern("yyyy-MM-dd"));
	}

	// console.log(lineLegendArray);
	// console.log(lineXArray);
	// console.log(lineDataArray);


	lineOption.legend['data'] = lineLegendArray;
	lineOption.xAxis[0]['data'] = lineXArray;
	lineOption.series = lineDataArray;

	// 为echarts对象加载数据
	lineChart.setOption(lineOption);

})

/**
 * 饼状图
 */
var pieChart = echarts.init($("#chart-pie")[0]);
var pieOption = {
	tooltip: {
		trigger: 'item',
		formatter: "{b} <br/>{a} : {c} ({d}%)"// {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
	},
	legend: {
		type: 'plain',// 不可滚动图例(scroll,plain)
		orient: 'horizontal',// 水平朝向
		bottom: 0,
		itemHeight: 9,
		itemWidth: 18,
		/*data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']*/
	},
	series: [
		{
			type: 'pie',
			name: '今日数据量',
			radius: [0, '55%'],// [内半径,外半径]
			center: ['50%', '45%'],
			/*data: [
				{value: 335, name: '直接访问'},
				{value: 310, name: '邮件营销'},
				{value: 234, name: '联盟广告'},
				{value: 135, name: '视频广告'},
				{value: 1548, name: '搜索引擎'}
			],*/
			itemStyle: {
				normal: {// 常规状态下样式

				},
				emphasis: {// 高亮样式
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}
	]
};
/**
 * 折线图
 */
var lineChart = echarts.init($("#chart-line")[0]);
var lineOption = {
	tooltip: {// 提示框组件
		trigger: 'axis',// 触发类型:坐标轴触发
		axisPointer: {// 坐标轴指示器
			type: 'cross',
			label: {
				backgroundColor: '#6a7985'
			}
		}
	},
	legend: {// 图例组件
		type: 'plain',// 不可滚动图例(scroll,plain)
		orient: 'horizontal',// 水平朝向
		/*data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']*/
	},
	toolbox: {// 工具栏
		feature: {// 各工具配置项
			saveAsImage: {},// 导出图片
			dataView: {},// 数据视图
			restore: {}// 重置
		}
	},
	grid: {// 在直角坐标系中绘制网格
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true// grid 区域是否包含坐标轴的刻度标签
	},
	xAxis: [// 直角坐标系 grid 中的 x 轴
		{
			type: 'category',// 坐标轴类型:类目轴
			boundaryGap: false,// 坐标轴两边留白策略
			/*data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']*/
		}
	],
	yAxis: [// 直角坐标系 grid 中的 y 轴
		{
			type: 'value'// 坐标轴类型:数值轴
		}
	],
	series: [
		/*{
			name: '邮件营销',
			type: 'line',
			stack: '总量',
			areaStyle: {normal: {}},// 区域填充样式
			data: [120, 132, 101, 134, 90, 230, 210]
		},
		{
			name: '联盟广告',
			type: 'line',
			stack: '总量',
			areaStyle: {normal: {}},
			data: [220, 182, 191, 234, 290, 330, 310]
		},
		{
			name: '视频广告',
			type: 'line',
			stack: '总量',
			areaStyle: {normal: {}},
			data: [150, 232, 201, 154, 190, 330, 410]
		},
		{
			name: '直接访问',
			type: 'line',
			stack: '总量',
			areaStyle: {normal: {}},
			data: [320, 332, 301, 334, 390, 330, 320]
		},
		{
			name: '搜索引擎',
			type: 'line',
			stack: '总量',
			label: {
				normal: {
					show: true,
					position: 'top'
				}
			},
			areaStyle: {normal: {}},
			data: [820, 932, 901, 934, 1290, 1330, 1320]
		}*/
	]
};

/**
 * 时间格式化(年月日-时分秒)
 * @param fmt
 * @returns {*}
 */
Date.prototype.pattern = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
		"H+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds() //毫秒
	};
	var week = {
		"0": "/u65e5",
		"1": "/u4e00",
		"2": "/u4e8c",
		"3": "/u4e09",
		"4": "/u56db",
		"5": "/u4e94",
		"6": "/u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

