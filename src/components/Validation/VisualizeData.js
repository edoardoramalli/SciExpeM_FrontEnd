import React from "react";

import {Table} from "antd";


class VisualizeData extends React.Component {

    render() {
        let columns_list = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            render: (props, record) => <div style={{fontWeight: 800}}>{props}</div>
        }, {
            title: 'Mean',
            dataIndex: 'mean',
            key: 'mean',
            // render: (props, record) => {
            //     return this.renderValue('mean', props, record)
            // },
            sorter: (a, b) => a > b,
        }, {
            title: 'Median',
            dataIndex: 'median',
            key: 'median',
            // render: (props, record) => {
            //     return this.renderValue('median', props, record)
            // },
            sorter: (a, b) => a > b,
        }, {
            title: 'Min',
            dataIndex: 'min',
            key: 'min',
            // render: (props, record) => {
            //     return this.renderValue('min', props, record)
            // },
            sorter: (a, b) => a > b,
        }, {
            title: 'Max',
            dataIndex: 'max',
            key: 'max',
            // render: (props, record) => {
            //     return this.renderValue('max', props, record)
            // },
            sorter: (a, b) => a > b,
        }, {
            title: 'Stdev',
            dataIndex: 'stdev',
            key: 'stdev',
            sorter: (a, b) => a > b,
        }, {
            title: 'Variance',
            dataIndex: 'variance',
            key: 'variance',
            sorter: (a, b) => a > b,
        }, {
            title: 'Count',
            dataIndex: 'len',
            key: 'len',
            sorter: (a, b) => a > b,
            render: (props, record) => <>{props} ({record['total']})</>
        },]


        return (
            <Table
                columns={columns_list}
                dataSource={this.props.results}
                bordered
                size="small"
                pagination={false}
                loading={this.props.loading}

                // scroll={{x: 'calc(700px + 50%)'}}
            />
        )
    }

}

export default VisualizeData;