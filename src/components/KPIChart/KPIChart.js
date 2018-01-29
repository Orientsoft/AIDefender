import React, { Component } from 'react';
import echarts from 'echarts'
import { Card } from 'antd'
import styles from './KPIChart.less'

class KPIChart extends Component {
    constructor (props) {
        super(props)
        this.chartConfig = []
        this.dataSource = {}
        this.charts = []
    }

    render() {
        this.chartConfigs = this.props.data.chartConfig
        this.dataSource = this.props.data.dataSource
        return (
            <Card>
                {this.chartConfigs.length > 0 && this.chartConfigs.map((chartConfig, key) => (
                    <div key={key} >
                        <div key={key} className={styles.chart} ref={el => this.initChart(el, key, this.dataSource, chartConfig)}></div>
                    </div>
                ))}
            </Card>
        );
    }
    componentDidUpdate() {
        if (this.charts.length > 0 && this.charts.length == this.chartConfigs.length) {
            echarts.connect(this.charts);
        }
    }
    initChart(el, key, data, chartConfig) {
        let chart = this.charts[key]
        let option = null 
        // console.log('xAxis=',  data[0]);
        if (!chart){
            this.charts[key] = echarts.init(el);
        }else {
            //chart update data
            // echarts.dispose(this.charts[key])
        }
        option = {
            title: {
                text: chartConfig.title
            },
            xAxis: {
                type: 'category',
                // boundaryGap: false,
                data: data.xAxis, 
                name: chartConfig.x.label, 
                nameLocation: 'center', 
                nameGap: 35, 
                nameTextStyle: {
                    fontWeight: 'bold', 
                    fontSize: 16
                }
            },
            yAxis: {
                type: 'value', 
                nameGap: 30
            },
            tooltip: {
                trigger: 'axis'
            },
            series: [{
                data: data.yAxis,
                type: chartConfig.type,
                areaStyle: {
                    normal: {
                        color: '#2ec7c9',
                        opacity: 0.3,
                    },
                },
                lineStyle: {
                    normal: {
                        color: '#2ec7c9',
                    },
                },
                itemStyle:{
                    normal:{
                        color: '#2ec7c9',
                        opacity: 0.6
                    }
                },
            }]
        };
        this.charts[key].setOption(option)
    }

    componentDidMount() {
        if (this.charts.length > 0 && this.charts.length == this.chartConfigs.length) {
            echarts.connect(this.charts);
        }
    }
}

export default KPIChart;