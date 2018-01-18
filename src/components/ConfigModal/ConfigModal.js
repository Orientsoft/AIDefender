import React, { Component } from 'react';
import { Modal, Tabs, Card, Checkbox } from 'antd';
import styles from './ConfigModal.less'

const TabPane = Tabs.TabPane;

class ConfigModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.hideModal = this.hideModal.bind(this);
        this.submitConfig = this.submitConfig.bind(this);
    }
    render() {
        const { isVisiable, nodeName } = this.props
        return (
            <Card>
                <Modal 
                    title={nodeName}
                    visible={isVisiable}
                    onCancel={this.hideModal}
                    onOk={this.submitConfig}
                >
                    <Tabs defaultActiveKey="1" 
                          style={{ height: 220 }}
                          type="card"
                    >
                        <TabPane tab={<div><span className={styles.pdr20}>KPI</span><Checkbox></Checkbox></div>} key="1">
                            测试数据1
                        </TabPane>
                        <TabPane tab={<div><span className={styles.pdr20}>Alert</span><Checkbox></Checkbox></div>} key="2">
                            测试数据2
                        </TabPane>
                        <TabPane tab={<div><span className={styles.pdr20}>异常</span><Checkbox></Checkbox></div>} key="3">
                            测试数据3
                        </TabPane>
                    </Tabs>    
                </Modal>
            </Card>
        );
    }

    // 调用父组件的方法改变isVisable隐藏
    hideModal() {
        
    }
    //提交配置
    submitConfig() {

    }
}

export default ConfigModal;