import { routerRedux } from 'dva/router'
import { service } from 'services/singlequery'

export default {
  namespace: 'singleSource',

  state: {
    data: [{
      type: 'singleSource',
      structure: [],
      name: 'a',
      category:'sss',
      index: 'a',
      fields: [{name:'host',value:'主机'},{name:'length',value:'长度'}],
      time: ['@timeStamp'],
      field: ['host','ip'],
  }]
  },
  reducers: {
    
  },
  effects: {
    
  },

}
