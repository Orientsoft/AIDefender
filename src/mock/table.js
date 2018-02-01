const { config } = require('./common')
const { api } = config

const total = 60;
let columns = [
    {
        key: 'timestamp',
        dataIndex: 'timestamp',
        title: '时间戳'
    },
    {
        key: 'index',
        dataIndex: 'index',
        title: '数据源'
    },
    {
        key: 'host',
        dataIndex: 'host',
        title: '主机'
    },
    {
        key: 'status',
        dataIndex: 'status',
        title: '状态'
    },
    {
        key: 'ServerName',
        dataIndex: 'ServerName',
        title: '主机名'
    }
]

const dataSource = [
    [
        { key: 1, timestamp: '2018-01-01', index: 'tploader', host: '192.168.0.1', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 2, timestamp: '2018-01-02', index: 'oracle', host: '192.168.0.20', status: 'SLEEP', ServerName: 'oracle' },
        { key: 3, timestamp: '2018-01-03', index: 'tploader', host: '192.168.0.3', status: 'STOP', ServerName: 'jvm' },
        { key: 4, timestamp: '2018-01-04', index: 'tploader', host: '192.168.0.4', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 5, timestamp: '2018-01-05', index: 'oracle', host: '192.168.0.21', status: 'SLEEP', ServerName: 'oracle' },
        { key: 6, timestamp: '2018-01-06', index: 'tploader', host: '192.168.0.33', status: 'STOP', ServerName: 'jvm' },
        { key: 7, timestamp: '2018-01-07', index: 'tploader', host: '192.168.0.13', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 8, timestamp: '2018-01-08', index: 'oracle', host: '192.168.0.28', status: 'SLEEP', ServerName: 'oracle' },
        { key: 9, timestamp: '2018-01-09', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm' },
        { key: 10, timestamp: '2018-01-10', index: 'tploader', host: '192.168.0.11', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 11, timestamp: '2018-01-11', index: 'oracle', host: '192.168.0.27', status: 'SLEEP', ServerName: 'oracle' },
        { key: 12, timestamp: '2018-01-12', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm' },
        { key: 13, timestamp: '2018-01-13', index: 'tploader', host: '192.168.0.1', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 14, timestamp: '2018-01-14', index: 'oracle', host: '192.168.0.20', status: 'SLEEP', ServerName: 'oracle' },
        { key: 15, timestamp: '2018-01-15', index: 'tploader', host: '192.168.0.3', status: 'STOP', ServerName: 'jvm' },
        { key: 16, timestamp: '2018-01-16', index: 'tploader', host: '192.168.0.4', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 17, timestamp: '2018-01-17', index: 'oracle', host: '192.168.0.21', status: 'SLEEP', ServerName: 'oracle' },
        { key: 18, timestamp: '2018-01-18', index: 'tploader', host: '192.168.0.33', status: 'STOP', ServerName: 'jvm' },
        { key: 19, timestamp: '2018-01-19', index: 'tploader', host: '192.168.0.13', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 20, timestamp: '2018-01-20', index: 'oracle', host: '192.168.0.28', status: 'SLEEP', ServerName: 'oracle' },
    ],
    [
        { key: 21, timestamp: '2018-01-21', index: 'oracle', host: '192.168.0.27', status: 'SLEEP', ServerName: 'oracle' },
        { key: 22, timestamp: '2018-01-22', index: 'tploader', host: '192.168.0.11', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 23, timestamp: '2018-01-23', index: 'oracle', host: '192.168.0.27', status: 'SLEEP', ServerName: 'oracle' },
        { key: 24, timestamp: '2018-01-24', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm' },
        { key: 25, timestamp: '2018-01-25', index: 'tploader', host: '192.168.0.1', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 26, timestamp: '2018-01-26', index: 'oracle', host: '192.168.0.20', status: 'SLEEP', ServerName: 'oracle' },
        { key: 27, timestamp: '2018-01-27', index: 'tploader', host: '192.168.0.3', status: 'STOP', ServerName: 'jvm' },
        { key: 28, timestamp: '2018-01-28', index: 'tploader', host: '192.168.0.4', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 29, timestamp: '2018-01-29', index: 'oracle', host: '192.168.0.21', status: 'SLEEP', ServerName: 'oracle' },
        { key: 30, timestamp: '2018-01-30', index: 'tploader', host: '192.168.0.33', status: 'STOP', ServerName: 'jvm' },
        { key: 31, timestamp: '2018-01-31', index: 'tploader', host: '192.168.0.13', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 32, timestamp: '2018-01-32', index: 'oracle', host: '192.168.0.28', status: 'SLEEP', ServerName: 'oracle' },
        { key: 33, timestamp: '2018-01-33', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm' },
        { key: 34, timestamp: '2018-01-34', index: 'tploader', host: '192.168.0.11', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 35, timestamp: '2018-01-35', index: 'tploader', host: '192.168.0.11', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 36, timestamp: '2018-01-36', index: 'oracle', host: '192.168.0.27', status: 'SLEEP', ServerName: 'oracle' },
        { key: 37, timestamp: '2018-01-37', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm' },
        { key: 38, timestamp: '2018-01-38', index: 'tploader', host: '192.168.0.1', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 39, timestamp: '2018-01-39', index: 'oracle', host: '192.168.0.20', status: 'SLEEP', ServerName: 'oracle' },
        { key: 40, timestamp: '2018-01-40', index: 'tploader', host: '192.168.0.3', status: 'STOP', ServerName: 'jvm' },

    ],
    [
        { key: 41, timestamp: '2018-01-41', index: 'oracle', host: '192.168.0.27', status: 'SLEEP', ServerName: 'oracle' },
        { key: 42, timestamp: '2018-01-42', index: 'tploader', host: '192.168.0.11', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 43, timestamp: '2018-01-43', index: 'oracle', host: '192.168.0.27', status: 'SLEEP', ServerName: 'oracle' },
        { key: 44, timestamp: '2018-01-44', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm' },
        { key: 45, timestamp: '2018-01-45', index: 'tploader', host: '192.168.0.1', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 46, timestamp: '2018-01-46', index: 'oracle', host: '192.168.0.20', status: 'SLEEP', ServerName: 'oracle' },
        { key: 47, timestamp: '2018-01-47', index: 'tploader', host: '192.168.0.3', status: 'STOP', ServerName: 'jvm' },
        { key: 48, timestamp: '2018-01-48', index: 'tploader', host: '192.168.0.4', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 49, timestamp: '2018-01-49', index: 'oracle', host: '192.168.0.21', status: 'SLEEP', ServerName: 'oracle' },
        { key: 50, timestamp: '2018-01-50', index: 'tploader', host: '192.168.0.33', status: 'STOP', ServerName: 'jvm' },
        { key: 51, timestamp: '2018-01-51', index: 'tploader', host: '192.168.0.13', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 52, timestamp: '2018-01-52', index: 'oracle', host: '192.168.0.28', status: 'SLEEP', ServerName: 'oracle' },
        { key: 53, timestamp: '2018-01-53', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm' },
        { key: 54, timestamp: '2018-01-54', index: 'tploader', host: '192.168.0.11', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 55, timestamp: '2018-01-55', index: 'tploader', host: '192.168.0.11', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 56, timestamp: '2018-01-56', index: 'oracle', host: '192.168.0.27', status: 'SLEEP', ServerName: 'oracle' },
        { key: 57, timestamp: '2018-01-57', index: 'tploader', host: '192.168.0.32', status: 'STOP', ServerName: 'jvm' },
        { key: 58, timestamp: '2018-01-58', index: 'tploader', host: '192.168.0.1', status: 'ACTIVE', ServerName: 'vayager' },
        { key: 59, timestamp: '2018-01-59', index: 'oracle', host: '192.168.0.20', status: 'SLEEP', ServerName: 'oracle' },
        { key: 60, timestamp: '2018-01-60', index: 'tploader', host: '192.168.0.3', status: 'STOP', ServerName: 'jvm' },

    ]


]


module.exports = {
    [`POST ${api.query}`](req, res) {
        let currentPage = Number(req.body.currentPage)

        let table = {
            total,
            columns,
            dataSource: dataSource[currentPage]
        }
        res.json(table)
    },
}