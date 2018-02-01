import React, { Component } from 'react';
import echarts from 'echarts'
import { Card } from 'antd'
import styles from './KPIChart.less'

class KPIChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chartConfigs: props.chartConfigs || [],
            dataSource: props.dataSource || {},
        }
        this.charts = []
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
            if (nextProps.chartConfigs) {
                this.state.chartConfigs = nextProps.chartConfigs
            }
            if (nextProps.dataSource) {
                this.state.dataSource = nextProps.dataSource
            }
            this.setState(this.state)
        
    }

    render() {
        console.log('render');
        const { chartConfigs, dataSource } = this.state

        return (
            <Card>
                {chartConfigs.length > 0 && chartConfigs.map((chartConfig, key) => (
                    <div key={key} >
                        <div key={key} className={styles.chart} ref={el => this.initChart(el, key, dataSource, chartConfig)}></div>
                    </div>
                ))}
            </Card>
        );
    }
    initChart(el, key, data, chartConfig) {
        let chart = this.charts[key]
        let option = null
        if (!el) {
            this.charts.forEach((chart, i, charts) => {
                if (chart) {
                    chart.dispose()
                }
            })
            this.charts = []
            return
        }
        if (!chart) {
            this.charts[key] = echarts.init(el)
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
                itemStyle: {
                    normal: {
                        color: '#2ec7c9',
                        opacity: 0.6
                    }
                },
            }]
        };
        this.charts[key].setOption(option)
        if (this.charts.length > 0 && this.charts.length == this.state.chartConfigs.length) {
            echarts.connect(this.charts);
        }
    }

    componentDidMount() {
    }
}

export default KPIChart;