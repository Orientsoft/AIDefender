import React from 'react';
import { Row, Col, Select, Input, Button, Modal, Form } from 'antd';
import { connect } from 'dva';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep'
import values from 'lodash/values'
import styles from './index.less'

const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;

class DataSourceItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible,
            visibleEdit: false,
            showSource: [],
            originSource: [],
            data: {
                type: '',
                structure: [],
                name: '',
                category:'',
                index: '',
                fields: [],
                time: [],
                field: [],
            }
        }
    }

    componentWillMount() {
        
        let data = this.props.singleSource.data
       
        for(let key in data){
            let source = data[key]
            let final = []
            let fields = source.fields
            for(let j in fields){
                let name = fields[j].name
                let value = fields[j].value
                let all = name + ":" + value
                final.push(all)
            }
            data[key].fields =  final
        }
        this.state.showSource = data
        console.log('kkk', this.state.showSource)
    }

    getAllKeys(index) {

    }

    onTypeChange(type) {

    }

    onIndexChange(index) {

    }

    onTimeChange(value) {

    }

    onKeyChange(value) {

    }

    onNameChange(value) {

    }

    onfieldNameChange(e) {

    }

    onEditType(type) {

    }

    onEditIndex(index) {

    }

    onEditTime(value) {

    }

    onEditKey(value) {


    }

    onEditFieldName(e) {

    }

    onSave() {

        this.props.setVisible(false)
    }

    onCancel() {

        this.props.setVisible(false)
    }

    onCancelEdit() {
        this.setState({
            visibleEdit: false
        })
    }

    onSaveChange(key, name) {

        this.setState({
            visibleEdit: false
        })


    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
            className: styles.formItem
        }
        const formItemLayoutSelect = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 },
            className: styles.formItem
        }
        //添加数据源
        let antdFormAdd = <Form horizonal='true'>
            <FormItem {...formItemLayout} label='名称:'>
                <Input onChange={(e) => this.onNameChange(e.target.value)} />
            </FormItem>
            <FormItem {...formItemLayout} label='类型:'>
                <Select style={{ width: '100%' }} onChange={(value) => this.onTypeChange(value)}>
                    {/* {
                        this.types && this.types.map((type, key) => {
                            return <Option value={type} key={key}>{type}</Option>
                        })
                    } */}
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='数据源:'>
                <Select style={{ width: '100%' }} onChange={(value) => this.onIndexChange(value)}>
                    {/* {
                        this.indices && this.indices.map((index, key) => {
                            return <Option value={index} key={key}>{index}</Option>
                        })
                    } */}
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='时间:'>
                <Select style={{ width: '100%' }} onChange={(value) => this.onTimeChange(value)}>
                    {/* {
                        this.time && this.time.map((index, key) => {
                            return <Option value={index} key={key}>{index}</Option>
                        })
                    } */}
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='字段选择'>
                <Select
                    mode="tags"
                    placeholder="Please select"
                    style={{ width: '100%' }}
                    onChange={(value) => this.onKeyChange(value)}
                >
                    {/* {
                        this.fields && this.fields.map((field, key) => {
                            return <Option value={field} key={key}>{field}</Option>
                        })
                    } */}
                </Select>
            </FormItem>
            {/* {this.data.field && this.data.field.map((field, key) => (
                <Row key={key}>
                    <Col span="11" offset="2" >
                        <FormItem {...formItemLayoutSelect} label='字段'  >
                            <Input value={field} disabled />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem {...formItemLayoutSelect} label='名称' >
                            <Input data-field={field} onChange={(e) => this.onfieldNameChange(e)} />
                        </FormItem>
                    </Col>
                </Row>
            ))} */}
        </Form>
        //修改数据源
        let editForm = <Form horizonal='true' >
            <FormItem {...formItemLayout} label='名称:'>
                <p></p>
            </FormItem>
            <FormItem {...formItemLayout} label='类型:'>
                <Select style={{ width: '100%' }} onChange={(value) => this.onEditType(value)}>
                    {/* {
                        this.types && this.types.map((type, key) => {
                            return <Option value={type} key={key}>{type}</Option>
                        })
                    } */}
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='数据源:'>
                <Select style={{ width: '100%' }} onChange={(value) => this.onEditIndex(value)}>
                    {/* {
                        this.indices && this.indices.map((index, key) => {
                            return <Option value={index} key={key}>{index}</Option>
                        })
                    } */}
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='时间:'>
                <Select style={{ width: '100%' }} onChange={(value) => this.onEditTime(value)}>
                    {/* {
                        this.time && this.time.map((index, key) => {
                            return <Option value={index} key={key}>{index}</Option>
                        })
                    } */}
                </Select>
            </FormItem>
            <FormItem {...formItemLayout} label='字段选择'>
                <Select
                    mode="tags"
                    placeholder="Please select"

                    style={{ width: '100%' }}
                    onChange={(value) => this.onEditKey(value)}
                >
                    {/* {
                        this.fields && this.fields.map((field, key) => {
                            return <Option value={field} key={key}>{field}</Option>
                        })
                    } */}
                </Select>
            </FormItem>
            {/* {(this.data.fields ? this.data.fields.slice() : this.data.fields) && this.data.fields.slice().map((item, key) => (
                <Row key={key}>
                    <Col span="11" offset="2" >
                        <FormItem {...formItemLayoutSelect} label='字段'  >
                            <Input value={item.field} disabled />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem {...formItemLayoutSelect} label='名称' >
                            <Input data-field={item.field} value={item.label} onChange={(e) => this.onEditFieldName(e)} />
                        </FormItem>
                    </Col>
                </Row>
            ))} */}
        </Form>

        return (
            <div>
                <Modal
                    title="添加"
                    visible={this.state.visible}
                    onOk={this.onSave.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                >
                    {antdFormAdd}
                </Modal>
                <Modal
                    title="修改"
                    visible={this.state.visibleEdit}
                    onOk={this.onSaveChange.bind(this)}
                    onCancel={this.onCancelEdit.bind(this)}
                >
                    {editForm}
                </Modal>
                <Row gutter={5} className={styles.sourceContent}>
                    <Col span={2} className="gutter-row">类型:</Col>
                    <Col span={5} className="gutter-row">数据源:</Col>
                    <Col span={3} className="gutter-row">时间:</Col>
                    <Col span={8} className="gutter-row">字段:</Col>
                    <Col span={2} className="gutter-row">名称:</Col>
                </Row>

                <div>
                    { this.state.showSource.map((item, key) => {
                        return (<Row gutter={5} key={key}>
                            <Col span={2} className="gutter-row">
                                <Input value={item.category} disabled key={key} ></Input>
                            </Col>
                            <Col span={5} className="gutter-row">
                                <Input value={item.index} disabled key={key} ></Input>
                            </Col>
                            <Col span={3} className="gutter-row">
                                <Input value={item.time} disabled key={key} ></Input>
                            </Col>
                            <Col span={8} className="gutter-row">
                                <Select
                                    mode="tags"
                                    value = {item.fields}
                                    style={{ width: '100%' }}
                                    disabled
                                    key={key}
                                >
                                </Select>
                            </Col>
                            <Col span={2} className="gutter-row">
                                <Input value={item.name} disabled key={key} />
                            </Col>
                            <Col span={4} className="gutter-row">
                                <Button onClick={() => this.onEditSource(key, item.name)} >编辑</Button>
                                <Button onClick={() => this.onDeleteSource(key)}>删除</Button>
                            </Col>
                        </Row>)
                    })}
                </div>
            </div>
        );
    }

    //  onDeleteSource(key) {
    //     const source = this.dataSource.splice(key, 1)[0];
    //     this.appStore.config.sources.slice().splice(key, 1)[0];
    //     this.appStore.singleDatas = this.dataSource
    //     this.enableEdit[key] = false;
    //     this.elastic.deleteSingleDataSource(source.name);
    // }

    onEditSource(key, name) {
        // this.name = name;
        // for (var i = 0; i < this.dataSource.length; i++) {
        //     if (name == this.dataSource[i].name) {
        //         //let aaa= cloneDeep(toJS(this.dataSource[i]))
        //         this.data = this.dataSource[i]
        //         if(typeof(this.data.fields) == 'string'){
        //             this.data.fields = JSON.parse(this.data.fields)
        //         }
        //     }
        // }
        this.setState({
            visibleEdit: true
        })
    }
}


export default connect((state) => { return ({ singleSource: state.singleSource }) }, (dispatch) => ({

}))(DataSourceItem)



