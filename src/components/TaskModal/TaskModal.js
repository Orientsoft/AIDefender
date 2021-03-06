/* eslint-disable */
import React, { Component } from 'react'
import { Modal, Form, Icon, Input, Button, Select, Message } from 'antd'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import trim from 'lodash/trim'
import styles from './TaskModal.less'
import config from '../../../app.json'
import { connect } from 'dva'
const FormItem = Form.Item
const { Option } = Select

class TaskModal extends Component {
  constructor(props, context) {
    super(props, context)
    this.initTaskItem = {
      name: '',
      input: {
        type: 3,
      },
      output: {
        type: 3,
      },
      script: '',
      params: [],
      type: 0,
      cron: '',
      running: false,
      metric: '',
      description: '',
    }
    const taskItem = cloneDeep(props.data)  || cloneDeep(props.cloneData) || cloneDeep(this.initTaskItem)
    const cornExpressRegxPt = "^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\/|\\,)(?:|\\d{4}))?)*))$"
    this.cornReg = new RegExp(cornExpressRegxPt)
    this.isUpdate = props.data ? true : false
    let title = ''
    if (this.props.data) {
      title = '修改任务'
    } else if (this.props.cloneData) {
      title = '克隆任务'
    } else {
      title = '添加任务'
    }
    this.state = {
      param: '',
      inputs: [taskItem.input] || [],
      outputs: [taskItem.output] || [],
      taskItem,
      title,
    }
  }

  render() {
    const { taskItem, param, isAlertVisible, title } = this.state
    const inputs = this.props.ports.inputs.length > 0 ? this.props.ports.inputs : this.state.inputs
    const outputs = this.props.ports.outputs.length > 0 ? this.props.ports.outputs : this.state.outputs
    taskItem.input = taskItem.input || {}
    taskItem.output = taskItem.output || {}
   
    return (
      <Modal
        visible
        width="50%"
        style={{ minHeight: 400, top: 5 }}
        onCancel={this._onCancel.bind(this)}
        onOk={this._onOk.bind(this)}
        maskClosable={false}
        // title="create task"
        title = {title}
        okText="保存"
        cancelText="取消"
      >
        <div>
          <div className={`${styles.basic} ${styles.line}`}>
            <div className={styles.text}>常规</div>
            <Input placeholder="名字" className={styles.name} value={taskItem.name} onChange={this.onNameChange.bind(this)} />
            <Input placeholder="指标名" className={styles.metric} value={taskItem.metric} onChange={this.onMetricChange.bind(this)}/>
            <Input placeholder="描述" className={styles.des} value={taskItem.description} onChange={this.onDesChange.bind(this)}/>
            <Select className={styles.type} value={taskItem.type} placeholder="类型" onChange={this.onTypeChange.bind(this)} >
              <Option value={0}>NORMAL</Option>
              <Option value={1}>CRON</Option>
            </Select>
            <Input placeholder="Cron" value={taskItem.cron} className={styles.cron} onChange={this.onCronChange.bind(this)} value={taskItem.cron} disabled={taskItem.type ? false : true} />
          </div>

          <div className={`${styles.port} ${styles.line}`}>
            <div className={styles.text}>I/O通道</div>
            <Select className={styles.typeOdd} value={taskItem.input.type} placeholder="输入端口类型" onSelect={this.inputTypeChange.bind(this)} >
              <Option value={0}>REDIS_CHANNEL</Option>
              <Option value={1}>NSQ_QUEUE</Option>
              <Option value={2}>MONGODB_COLLECTION</Option>
              <Option value={3}>ES_INDEX</Option>
            </Select>
            <Select showSearch optionFilterProp="children" className={styles.typeEven} value={taskItem.input._id} placeholder="输入端口" onChange={this.inputChange.bind(this)} >
              {
                inputs && inputs.map((item, key) => {
                  return <Option value={item._id} key={key}>{item.name}</Option>
                })
              }
            </Select>
            <Select className={styles.typeOdd} placeholder="输出端口类型" value={taskItem.output.type} onSelect={this.outputTypeChange.bind(this)}>
              <Option value={0}>REDIS_CHANNEL</Option>
              <Option value={1}>NSQ_QUEUE</Option>
              <Option value={2}>MONGODB_COLLECTION</Option>
              <Option value={3}>ES_INDEX</Option>
            </Select>
            <Select showSearch optionFilterProp="children" className={styles.typeEven} placeholder="输出端口" value={taskItem.output._id} onChange={this.outputChange.bind(this)}>
              {
                outputs.map((item, key) => {
                  return <Option value={item._id} key={key}>{item.name}</Option>
                })
              }
            </Select>
          </div>

          <div className={`${styles.command} ${styles.line}`}>
            <div className={styles.text}>命令</div>
            <Input placeholder="脚本路径" className={styles.path} value={taskItem.script} onChange={this.onScriptChange.bind(this)} />
            <Button type="primary" className={styles.btn}>验证</Button>
            <Input placeholder="参数" className={styles.path} value={param} onChange={this.onParamChange.bind(this)} onPressEnter={this.onParamAdd.bind(this)} />
            <Button type="primary" onClick={this.onParamAdd.bind(this)} className={styles.btn}>添加</Button>
            <Select
              mode="tags"
              style={{ overflow: 'scroll', height: '100px', width: '80%', marginRight: '5%', marginBottom: '10px' }}
              dropdownStyle={{ display: 'none' }}
              placeholder="所有参数"
              onDeselect={this.onParamDel.bind(this)}
              value={taskItem.params && taskItem.params.map((item) => {
                return item
              })}
            />
            <Button type="primary" style={{ position: 'relative', top: '-90px' }} onClick={e => this.onCopyParam(e)} >复制</Button>
          </div>
        </div>

      </Modal>
    )
  }

  componentDidMount() {
    let typeIn = this.state.taskItem.input.type
    let typeOut = this.state.taskItem.output.type
    this.props.dispatch({ type: 'ports/queryInputs', payload: { type: typeIn, pageSize: config.maxSize } })
    this.props.dispatch({ type: 'ports/queryOutputs', payload: { type: typeOut, pageSize: config.maxSize } })
  }

  onNameChange(e) {
    let name = e.target.value
    this.state.taskItem.name = name
    this.setState({
      taskItem: this.state.taskItem
    })
  }
  onMetricChange (e) {
    let metric = e.target.value
    this.state.taskItem.metric = metric
    this.setState({
      taskItem: this.state.taskItem
    })
  }
  onDesChange (e) {
    let des = e.target.value
    this.state.taskItem.description = des
    this.setState({
      taskItem: this.state.taskItem
    })
  }
  onTypeChange(value) {
    let type = value
    if (type == 0) {
      this.state.taskItem.cron = ''
    }
    this.state.taskItem.type = type
    this.setState({
      taskItem: this.state.taskItem
    })
  }
  onCronChange(e) {
    let cron = e.target.value
    this.state.taskItem.cron = cron
    this.setState({
      taskItem: this.state.taskItem
    })
  }
  inputTypeChange(value) {
    const { taskItem } = this.state
    let inputType = value
    this.props.dispatch({ type: 'ports/queryInputs', payload: { type: inputType, pageSize: config.maxSize } })
    taskItem.input.type = inputType
    taskItem.input._id = ''
    this.setState({
      taskItem: taskItem
    })
  }
  inputChange(value) {
    const { taskItem } = this.state
    const { inputs } = this.props.ports
    taskItem.input = inputs.find(input => input._id === value)
    this.setState({
      taskItem
    })
  }
  outputTypeChange(value) {
    const { taskItem } = this.state
    let outputType = value
    this.props.dispatch({ type: 'ports/queryOutputs', payload: { type: outputType, pageSize: config.maxSize } })
    taskItem.output.type = outputType
    taskItem.output._id = ''
    this.setState({
      taskItem: taskItem
    })
  }
  outputChange(value) {
    const { taskItem } = this.state
    const { outputs } = this.props.ports
    taskItem.output = outputs.find(output => output._id === value)
    this.setState({
      taskItem: taskItem
    })
  }
  onScriptChange(e) {
    let script = e.target.value
    this.state.taskItem.script = script
    this.setState({
      taskItem: this.state.taskItem
    })
  }
  onParamChange(e) {
    let param = e.target.value
    this.setState({
      param: param
    })
  }
  // onParamAdd () {
  //   // let param = this.splitParam(this.state.param)
  //   let param = trim(this.state.param)
  //   const { taskItem } = this.state
  //   const params = taskItem.params
  //   if (params.indexOf(param) !== -1) {
  //     Modal.warning({
  //       title: '警告提示',
  //       content: '请勿重复添加',
  //     })
  //     return
  //   } else {
  //     if (param !== '') {
  //       taskItem.params.push(param)
  //       this.setState({
  //         param: '',
  //         taskItem: taskItem
  //       })
  //     }
  //   }
  // }
  onParamAdd() {
    let param = this.splitParam(this.state.param)
    const { taskItem } = this.state
    const params = taskItem.params
    if (param.length > 0) {
      taskItem.params = taskItem.params.concat(param)
      this.setState({
        param: '',
        taskItem: taskItem
      })
    } else {
      Message.error('请添加正确的参数')
      // Modal.warning({
      //   title: '警告提示',
      //   content: '请添加正确的参数',
      // })
      return
    }
  }
  splitParam(param) {
    let split = param.split(' ')
    let all = []
    for (let i = split.length - 1, arg = ''; i >= 0; i--) {
      arg = split[i] + ' ' + arg
      if (/^[-]{1,2}/.test(split[i])) {
        all.push(arg.trim())
        arg = ''
      }
    }
    return all
  }

  onParamDel(value) {
    let param = value
    let index = this.state.taskItem.params.indexOf(value)
    this.state.taskItem.params.splice(index, 1)
    this.setState({
      taskItem: this.state.taskItem
    })
  }
  _onCancel() {
    const { onCancel = noop } = this.props

    onCancel()
  }

  _onOk() {
    const { onOk = noop } = this.props
    let taskItem = cloneDeep(this.state.taskItem)
    taskItem.input = taskItem.input._id
    taskItem.output = taskItem.output._id
    taskItem.name = trim(taskItem.name)
    taskItem.script = trim(taskItem.script)
    taskItem.cron = trim(taskItem.cron)
    //验证name
    if (!taskItem.name) {
      Message.error('必须填写task name')
      // Modal.warning({
      //   title: '警告提示',
      //   content: '必须填写task name',
      // })
      return
    }
    if (!taskItem.metric) {
      Message.error('必须填写metric name')
      // Modal.warning({
      //   title: '警告提示',
      //   content: '必须填写metric name',
      // })
      return
    }
    if (!taskItem.description) {
      Message.error('必须填写description')
      // Modal.warning({
      //   title: '警告提示',
      //   content: '必须填写description',
      // })
      return
    }


    //验证cron
    if (taskItem.type == 0) {
      taskItem.cron = ''
    } else if (taskItem.type == 1) {
      //cron表达式验证
      if (!taskItem.cron) {
        Message.error('task是cron类型，必须指定cron')
        // Modal.warning({
        //   title: '警告提示',
        //   content: 'task是cron类型，必须指定cron',
        // })

        return
      } else {
        if (!this.cornReg.test(taskItem.cron)) {
          Message.error('cron 表达式错误，请输入正确的 cron job 表达式')
          // Modal.warning({
          //   title: '警告提示',
          //   content: 'cron 表达式错误，请输入正确的 cron job 表达式',
          // });

          return
        }
      }
    }

    //验证input和output
    if (!taskItem.input || !taskItem.output) {
      Message.error('须指定input port 和 output port')
      // Modal.warning({
      //   title: '警告提示',
      //   content: '须指定input port 和 output port',
      // })
      return
    } else if (taskItem.input == taskItem.output) {
      Message.error('input port 和 output port 不能指定为同一个')
      // Modal.warning({
      //   title: '警告提示',
      //   content: 'input port 和 output port 不能指定为同一个',
      // })
      return
    }

    //验证script
    if (!taskItem.script) {
      Message.error('必须填写task script')
      // Modal.warning({
      //   title: '警告提示',
      //   content: '必须填写task script',
      // })
      return
    }
    // else if (!this.isScriptValid(taskItem.script)) {
    //   Modal.warning({
    //     title: '警告提示',
    //     content: '输入的路径格式不正确，请重新输入',
    //   })
    //   return
    // }
    if (taskItem.script.indexOf('/') !== -1) {
      if (!this.isScriptValid(taskItem.script)) {
        Message.error('输入的路径格式不正确，请重新输入')
        // Modal.warning({
        //   title: '警告提示',
        //   content: '输入的路径格式不正确，请重新输入',
        // })
        return
      }
    }

    onOk(taskItem)
  }
  isScriptValid(path) {
    // let g = /^\/\w*(\/\w+)*\.\w+$/
    let g = /[a-zA-Z]:(\\([0-9a-zA-Z]+))+|(\/([0-9a-zA-Z]+))+/
    return g.test(path)
  }
  componentWillUnmount() {
    this.props.dispatch({ type: 'ports/resetPorts' })
  }

  onCopyParam (e) {
    let msg = this.state.taskItem.params.join(' ')
    let event = new Event('copy')
    let copy = (e) => {
      if (msg === '') {
        Message.error('参数列表为空')
        // Modal.warning({
        //   title: '复制',
        //   content: '参数列表为空',
        // })
      } else {
        Message.success('复制参数成功')
        // Modal.warning({
        //   title: '复制',
        //   content: '复制参数成功',
        // })
        e.clipboardData.setData('text/plain', msg)
      }
      e.preventDefault()
    }

    document.addEventListener('copy', copy, false)
    document.execCommand('copy')
    setTimeout(()=>document.removeEventListener('copy', copy, false),0)
  }
}

export default connect((state) => { return ({ tasks: state.tasks, ports: state.ports }) })(TaskModal)