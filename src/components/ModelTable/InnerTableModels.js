import React from "react";
import {message, Table} from "antd";
import ActionCell from "../Shared/ActionCell";


class InnerTableModels extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            models: this.props.models_list,
        }
    }

    componentDidMount() {
        // console.log(this.props.others)
    }

    onSelect = (key) =>{
        const model_name = 'ChemModel'
        const params = {
            'element_id': key.toString(),
            'model_name': model_name,
            'file': 'model',
        }
        axios.get(window.$API_address + 'frontend/API/getFile',
            {responseType: 'blob', params: params})
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                const file_name = model_name + '_' + this.state.models_association[key] + '.zip'
                link.setAttribute('download', file_name);
                document.body.appendChild(link);
                link.click();
                message.success('File downloaded')
            })
            .catch(error => {
                message.error("Error downloading the file. File could be missing, or you don't have the permissions.")
            })
    }

    handleDelete = (e_id) => {
        this.setState({models: this.state.models.filter(item => item.id !== e_id)});
    };

    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                width: '10%',
                sorter: (a, b) => {return a.id > b.id},
                defaultSortOrder: "ascend"
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => {
                    return a.name.localeCompare(b.name)
                },

            },
            {
                title: 'Action',
                dataIndex: 'actions',
                key: 'actions',
                width: '10%',
                render: (text, record) =>
                    <ActionCell
                        items={{
                            'ChemKIN Files': {'label': 'ChemKIN Files', 'extension': '.zip', 'file': 'model'}
                        }}
                        element_id={record.id}
                        file_name={record.name}
                        model_name={'ChemModel'}
                        handleDelete={this.handleDelete}
                    />
            },
        ];
        return (
            <Table
                // title={()=> this.props.header ? header : undefined}
                columns={columns}
                scroll={{y: '100%'}}
                // rowSelection={rowSelection}
                dataSource={this.state.models}
                rowKey="id"
                size='small'
                // loading={this.props.loading}
                bordered
                style={{minHeight: 100}}
                expandRowByClick={true}
                // expandedRowRender={record => {return <InnerTableModels models_list={record.others}/>}}
            />
        );
    }
}

export default InnerTableModels;