import React from "react";
import {Empty, Table, Tabs} from "antd";

class GenericTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabList: []
        }
    }

    componentDidMount() {
        let result = []
        Object.entries(this.props.response).map(([dg_id, content], index) => {
            const header = this.createColumnTable(content['header'])
            const data = content['data']
            const total_width = (content['header'].length * 200);
            const tab =
                <Tabs.TabPane tab={'Data Group (' + dg_id +') - ' + content['type']} key={'KeyTabRawData' + dg_id}>
                    <Table
                        dataSource={data}
                        columns={header}
                        scroll={{x: total_width}}
                        size='small'
                        pagination={false}
                        bordered
                    />
                </Tabs.TabPane>
            result.push(tab)
            this.setState({tabList: result})
        })
    }

    createColumnTable(columns){
        return(columns.map(function (name) {
            return {
                title: name,
                key: name,
                dataIndex: name,
                width: 200
            }}))
    }

    render() {
        //
        // console.log(this.props.response)
        //
        //
        // const data = this.props.data;
        // const names = this.props.names;

        // if (names == null || names.length === 0) {
        //     return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
        // }

        // const columns = names.map(function (name) {
        //     return {
        //         title: name,
        //         key: name,
        //         dataIndex: name,
        //         width: 200
        //     }
        // });



        return (
            <Tabs>
                {this.state.tabList}
            </Tabs>
            )

    }
}

export default GenericTable;