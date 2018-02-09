import React from 'react'
import { Icon } from 'antd'
// import styles from './index.less'
import { Page } from 'components'
import AddModal from './AddModal'
import Histiry from '../../../components/TaskModal/History'

const Index = () => (<Page inner>
  <div>
    <AddModal />
    <Histiry />
  </div>
</Page>)

export default Index
