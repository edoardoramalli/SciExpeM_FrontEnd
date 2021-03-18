import React from "react";
import {Empty, Table} from "antd";

class GenericTable extends React.Component {

    render() {
        const data = this.props.data;
        const names = this.props.names;

        if (names == null || names.length === 0) {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
        }

        const columns = names.map(function (name) {
            return {
                title: name,
                key: name,
                dataIndex: name,
                width: 200
            }
        });


        const total_width = (names.length * 200);
        return (
            <div>
                <Table
                    dataSource={data}
                    columns={columns}
                    scroll={{x: total_width}}
                    size='small'
                    pagination={false}
                    bordered
                />
            </div>)

    }
}

export default GenericTable;