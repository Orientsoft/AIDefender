import React from 'react'
import { connect } from 'dva'
import { Modal, Table, Divider } from 'antd'
import styles from './Log.less'


class Log extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.msg = [
      '{"took":0,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":889,"max_score":1.0,"hits":[{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYQ","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:10:00.000Z","timespan":60000,"info":{"value":176.28,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYT","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:13:00.000Z","timespan":60000,"info":{"value":169.33,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYu","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:40:00.000Z","timespan":60000,"info":{"value":230.69,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYv","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:41:00.000Z","timespan":60000,"info":{"value":244.17,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYy","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:44:00.000Z","timespan":60000,"info":{"value":243.26,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZE","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:02:00.000Z","timespan":60000,"info":{"value":240.27,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZI","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:06:00.000Z","timespan":60000,"info":{"value":239.23,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZP","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:13:00.000Z","timespan":60000,"info":{"value":240.43,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZV","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:19:00.000Z","timespan":60000,"info":{"value":237.57,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZW","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:20:00.000Z","timespan":60000,"info":{"value":238.41,"anom_index":1.0},"updatedAt":"2018-05-03"}}]}}',
      '{"took":1,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":889,"max_score":1.0,"hits":[{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYQ","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:10:00.000Z","timespan":60000,"info":{"value":176.28,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYT","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:13:00.000Z","timespan":60000,"info":{"value":169.33,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYu","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:40:00.000Z","timespan":60000,"info":{"value":230.69,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYv","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:41:00.000Z","timespan":60000,"info":{"value":244.17,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYy","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:44:00.000Z","timespan":60000,"info":{"value":243.26,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZE","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:02:00.000Z","timespan":60000,"info":{"value":240.27,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZI","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:06:00.000Z","timespan":60000,"info":{"value":239.23,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZP","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:13:00.000Z","timespan":60000,"info":{"value":240.43,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZV","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:19:00.000Z","timespan":60000,"info":{"value":237.57,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZW","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:20:00.000Z","timespan":60000,"info":{"value":238.41,"anom_index":1.0},"updatedAt":"2018-05-03"}}]}}',
      '{"took":2,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":889,"max_score":1.0,"hits":[{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYQ","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:10:00.000Z","timespan":60000,"info":{"value":176.28,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYT","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:13:00.000Z","timespan":60000,"info":{"value":169.33,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYu","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:40:00.000Z","timespan":60000,"info":{"value":230.69,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYv","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:41:00.000Z","timespan":60000,"info":{"value":244.17,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYy","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:44:00.000Z","timespan":60000,"info":{"value":243.26,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZE","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:02:00.000Z","timespan":60000,"info":{"value":240.27,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZI","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:06:00.000Z","timespan":60000,"info":{"value":239.23,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZP","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:13:00.000Z","timespan":60000,"info":{"value":240.43,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZV","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:19:00.000Z","timespan":60000,"info":{"value":237.57,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZW","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:20:00.000Z","timespan":60000,"info":{"value":238.41,"anom_index":1.0},"updatedAt":"2018-05-03"}}]}}',
      '{"took":3,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":889,"max_score":1.0,"hits":[{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYQ","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:10:00.000Z","timespan":60000,"info":{"value":176.28,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYT","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:13:00.000Z","timespan":60000,"info":{"value":169.33,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYu","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:40:00.000Z","timespan":60000,"info":{"value":230.69,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYv","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:41:00.000Z","timespan":60000,"info":{"value":244.17,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYy","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:44:00.000Z","timespan":60000,"info":{"value":243.26,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZE","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:02:00.000Z","timespan":60000,"info":{"value":240.27,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZI","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:06:00.000Z","timespan":60000,"info":{"value":239.23,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZP","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:13:00.000Z","timespan":60000,"info":{"value":240.43,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZV","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:19:00.000Z","timespan":60000,"info":{"value":237.57,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZW","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:20:00.000Z","timespan":60000,"info":{"value":238.41,"anom_index":1.0},"updatedAt":"2018-05-03"}}]}}',
      '{"took":4,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":889,"max_score":1.0,"hits":[{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYQ","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:10:00.000Z","timespan":60000,"info":{"value":176.28,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYT","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:13:00.000Z","timespan":60000,"info":{"value":169.33,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYu","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:40:00.000Z","timespan":60000,"info":{"value":230.69,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYv","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:41:00.000Z","timespan":60000,"info":{"value":244.17,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYy","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:44:00.000Z","timespan":60000,"info":{"value":243.26,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZE","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:02:00.000Z","timespan":60000,"info":{"value":240.27,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZI","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:06:00.000Z","timespan":60000,"info":{"value":239.23,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZP","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:13:00.000Z","timespan":60000,"info":{"value":240.43,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZV","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:19:00.000Z","timespan":60000,"info":{"value":237.57,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZW","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:20:00.000Z","timespan":60000,"info":{"value":238.41,"anom_index":1.0},"updatedAt":"2018-05-03"}}]}}',
      '{"took":5,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":889,"max_score":1.0,"hits":[{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYQ","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:10:00.000Z","timespan":60000,"info":{"value":176.28,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYT","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:13:00.000Z","timespan":60000,"info":{"value":169.33,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYu","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:40:00.000Z","timespan":60000,"info":{"value":230.69,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYv","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:41:00.000Z","timespan":60000,"info":{"value":244.17,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYy","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:44:00.000Z","timespan":60000,"info":{"value":243.26,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZE","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:02:00.000Z","timespan":60000,"info":{"value":240.27,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZI","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:06:00.000Z","timespan":60000,"info":{"value":239.23,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZP","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:13:00.000Z","timespan":60000,"info":{"value":240.43,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZV","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:19:00.000Z","timespan":60000,"info":{"value":237.57,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZW","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:20:00.000Z","timespan":60000,"info":{"value":238.41,"anom_index":1.0},"updatedAt":"2018-05-03"}}]}}',
      '{"took":6,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":889,"max_score":1.0,"hits":[{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYQ","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:10:00.000Z","timespan":60000,"info":{"value":176.28,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYT","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:13:00.000Z","timespan":60000,"info":{"value":169.33,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYu","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:40:00.000Z","timespan":60000,"info":{"value":230.69,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYv","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:41:00.000Z","timespan":60000,"info":{"value":244.17,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYy","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:44:00.000Z","timespan":60000,"info":{"value":243.26,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZE","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:02:00.000Z","timespan":60000,"info":{"value":240.27,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZI","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:06:00.000Z","timespan":60000,"info":{"value":239.23,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZP","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:13:00.000Z","timespan":60000,"info":{"value":240.43,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZV","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:19:00.000Z","timespan":60000,"info":{"value":237.57,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZW","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:20:00.000Z","timespan":60000,"info":{"value":238.41,"anom_index":1.0},"updatedAt":"2018-05-03"}}]}}',
      '{"took":7,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":889,"max_score":1.0,"hits":[{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYQ","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:10:00.000Z","timespan":60000,"info":{"value":176.28,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYT","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:13:00.000Z","timespan":60000,"info":{"value":169.33,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYu","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:40:00.000Z","timespan":60000,"info":{"value":230.69,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYv","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:41:00.000Z","timespan":60000,"info":{"value":244.17,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AYy","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T01:44:00.000Z","timespan":60000,"info":{"value":243.26,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZE","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:02:00.000Z","timespan":60000,"info":{"value":240.27,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZI","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:06:00.000Z","timespan":60000,"info":{"value":239.23,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZP","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:13:00.000Z","timespan":60000,"info":{"value":240.43,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZV","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:19:00.000Z","timespan":60000,"info":{"value":237.57,"anom_index":1.0},"updatedAt":"2018-05-03"}},{"_index":"output","_type":"data","_id":"AWMj-jaekor8buEN-AZW","_score":1.0,"_source":{"name":"test","serverity":0.0,"level":"NORMAL","createdAt":"2018-03-08T02:20:00.000Z","timespan":60000,"info":{"value":238.41,"anom_index":1.0},"updatedAt":"2018-05-03"}}]}}',
    ]
  }
  componentDidMount() {
    let query = {
      source: this.props.id,
    }
    this.loop = setInterval(() => this.props.dispatch({ type: 'logs/queryLogs', payload: query }), 3000)
  }
  componentWillUnmount() {
    clearInterval(this.loop)
  }
  _onCancel() {
    const { onCancel } = this.props
    onCancel()
  }
  render() {
    let { logs = [] } = this.props.logs
    // this.msg.reverse()
    var msgModal
    if (logs.length > 0) {
      msgModal = (
        <Modal
          visible
          width="80%"
          title="日志"
          footer={null}
          onCancel={this._onCancel.bind(this)}
          className={`${styles.log}`}
        >
          <div style={{ height: 400, overflow: 'scroll' }}>
            {logs && logs.map((item) => {
              return (<div>{item}<Divider /></div>)
            })}
          </div>
        </Modal>
      )
    } else {
      msgModal = (
        <Modal
          visible
          width="40%"
          title="日志"
          footer={null}
          onCancel={this._onCancel.bind(this)}
        >
          <div>暂无日志！</div>
        </Modal>
      )
    }

    // let antdTableColumns = [
    //   {
    //     title: 'Content',
    //     key: 'content',
    //     dataIndex: 'content',
    //   },
    // ]
    // let historyTable = (<Table rowKey={line => line.id}
    //   columns={antdTableColumns}
    //   dataSource={this.msg}
    //   scroll={{ y: 500 }}
    // />)
    return (
      <div>
        {msgModal}
        {/* <Modal
          visible
          width="60%"
          title="日志"
          footer={null}
          onCancel={this._onCancel.bind(this)}
          className={`${styles.log}`}
        >
          {/* {historyTable} */}
        {/* <div style={{ height: 400, overflow: 'scroll' }}>
            {logs && logs.map((item) => {
              return (<div>{item}<Divider /></div>)
            })}
          </div>
        </Modal> */}
      </div>
    )
  }
}

export default connect((state) => { return ({ logs: state.logs }) })(Log)
