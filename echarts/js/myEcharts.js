$(function () {
    // 为echarts对象加载数据
    myChart.setOption(option);
});

/**
 * echarts.init(dom容器):基于dom容器,实例化echarts对象
 * dom容器必须是html的节点，如果是使用jQuery获取的则必须指定集合中的一个元素节点，比如(“#main”)则表示jQuery对象。$(“#main”)[0]则表示一个id为main的节点
 */
// var myChart = echarts.init(document.getElementById("myChartArea"));
var myChart = echarts.init($("#myChartArea")[0]);

var option = {
    title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        x: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 234, name: '联盟广告'},
                {value: 135, name: '视频广告'},
                {value: 1548, name: '搜索引擎'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

