import React from "react";
import {Button, Col, Input, Row, Statistic, Table, Tag} from "antd";
import TabExperiment from "./InfoExperimentFolder/TabExperiment";
import ActionCell from "../../components/Shared/ActionCell"
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";


function StatusTag(props) {
    const status = props.status;
    const experiment_interpreter = props.record.experiment_interpreter;
    let color_status;
    if (status === 'unverified'){
        color_status = 'orange';
    }
    else if (status === 'verified'){
        color_status = 'green';
    }
    else if (status === 'invalid'){
        color_status = 'red';
    }
    let type;
    let color_type;
    if (experiment_interpreter){
        type = "managed"
        color_type = "blue"
    }
    else {
        type = "unmanaged"
        color_type = "purple"
    }
    const listTags = [
        <Tag color={color_status} key={status}>
            {status.toUpperCase()}
        </Tag>,
        <Tag color={color_type} key={type}>
            {type.toUpperCase()}
        </Tag>]

    return (
        <>
            {listTags}
        </>
    )
}



class BaseTable extends React.Component{
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined type="search"/>}
                    size="small"
                    style={{width: 90}}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : 'black'}}/>
            ,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    constructor(props) {
        super(props);
        this.state = {
            experiments: [],
            loading: true,
            number_managed: 0,
            selectedRowKeys: []
        }
        this.listRef = React.createRef();
    }



    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({searchText: ''});
    };
    handleDelete = (e_id) => {

        this.setState({experiments: this.state.experiments.filter(item => item.id !== e_id)});

    };

    onSelectChange = selectedRowKeys => {
        this.props.selectHook(selectedRowKeys)
        this.setState({ selectedRowKeys });
    };

    prova(event){
        window.preventDefault()
        console.log('ciaoooo', event)
    }

    render() {

        const filter_exp_type = [
            {
                text: 'Ignition delay measurement',
                value: 'ignition delay measurement',
            }, {
                text: 'Laminar burning velocity measurement',
                value: 'laminar burning velocity measurement',
            }, {
                text: 'Outlet concentration measurement',
                value: 'outlet concentration measurement',
            }, {
                text: 'Concentration time profile measurement',
                value: 'concentration time profile measurement',
            }, {
                text: 'Jet stirred reactor measurement',
                value: 'jet stirred reactor measurement',
            }, {
                text: 'Burner stabilized flame speciation measurement',
                value: 'burner stabilized flame speciation measurement',
            }, {
                text: 'Direct rate coefficient measurement',
                value: 'direct rate coefficient measurement',
            }]

        const filter_reactor_type = [
            {
                text: 'Shock tube',
                value: 'shock',
            }, {
                text: 'Perfectly Stirred Reactor',
                value: 'stirred',
            }, {
                text: 'Plug Flow Reactor',
                value: 'flow',
            }, {
                text: 'Flame',
                value: 'flame',
            },
            {
                text: 'Rapid Compression Machine',
                value: 'rapid compression machine',
            }]

        const filter_status = [
            {
                text: 'INVALID',
                value: 'invalid'
            },
            {
                text: 'UNVERIFIED',
                value: 'unverified'
            },
            {
                text: 'VERIFIED',
                value: 'verified'
            },
            {
                text: 'MANAGED',
                value: 'managed'
            },
            {
                text: 'UNMANAGED',
                value: 'unmanaged'
            }
        ]

        const columns = [
            {
                title: 'File DOI',
                dataIndex: 'fileDOI',
                key: 'fileDOI',
                ...this.getColumnSearchProps('fileDOI'),
                sorter: (a, b) => {
                    return a.fileDOI.localeCompare(b.fileDOI)
                },

            },
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id',
                sorter: (a, b) => {
                    return a.id > b.id
                },
                width: '10%',
                defaultSortOrder: 'descend'
            },
            //     {
            //     title: 'Paper',
            //     dataIndex: 'file_paper.title',
            //     key: 'file_paper.title',
            // },
            {
                title: 'Reactor',
                dataIndex: 'reactor',
                key: 'reactor',
                filters: filter_reactor_type,
                onFilter: (value, record) => record.reactor.toLowerCase().includes(value),

                sorter: (a, b) => {
                    return a.reactor.localeCompare(b.reactor)
                },
                width: '15%',
            },
            {
                title: 'Experiment type',
                dataIndex: 'experiment_type',
                key: 'experiment_type',
                filters: filter_exp_type,
                onFilter: (value, record) => record.experiment_type.toLowerCase().includes(value),
                sorter: (a, b) => {
                    return a.experiment_type.localeCompare(b.experiment_type)
                },
            },
            // {
            //     title: 'Properties',
            //     dataIndex: 'common_properties',
            //     key: 'common_properties',
            //     width: '15%',
            //     filters: filter_properties,
            //     onFilter: (value, record) => {
            //         let i;
            //         for (i = 0; i < record.common_properties.length; i++) {
            //             if (record.common_properties[i].name.includes(value)) {
            //                 return true;
            //             }
            //         }
            //         return false;
            //     },
            //     render: props => <CommonPropertiesList common_properties={props}/>
            // },
            // {
            //     title: 'Initial species',
            //     dataIndex: 'initial_species',
            //     key: 'initial_species',
            //     width: '10%',
            //     filters: this.state.filter_type_exp,
            //     onFilter: (value, record) => {
            //         let i;
            //         for (i = 0; i < record.initial_species.length; i++) {
            //             if (record.initial_species[i].name.includes(value)) {
            //                 return true;
            //             }
            //         }
            //         return false;
            //     },
            //     render: props => <InitialSpeciesList initial_species={props}/>,
            // },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                filters: filter_status,
                width: '10%',
                onFilter: (value, record) => {
                    if (record.status === value){
                        return true
                    }
                    let exp_type;
                    if (record.experiment_interpreter === null){
                        exp_type = "unmanaged"
                    }
                    else{
                        exp_type = "managed"
                    }
                    if (value === exp_type){
                        return true
                    }
                    return false
                },
                render: (props, record) => <StatusTag status={props} record={record}/>

            },
            {
                title: 'Action',
                dataIndex: 'actions',
                key: 'actions',
                width: '10%',
                render: (text, record) =>
                    <ActionCell
                        items={{
                            'OpenSMOKEpp': {'label': 'Input File OpenSMOKE++', 'extension': '.dic', 'file': 'OpenSMOKEpp'},
                            'ReSpecTh': {'label': 'ReSpecTh File', 'extension': '.xml', 'file': 'ReSpecTh'},
                            'excel': {'label': 'Excel Raw Data', 'extension': '.xlsx', 'file': 'excel'}
                        }}
                        element_id={record.id}
                        file_name={record.fileDOI ? record.fileDOI : record.name}
                        model_name={'Experiment'}
                        handleDelete={this.handleDelete}
                    />
            },
        ];

        const header =
            <>
                <Row>
                    <Col span={3} offset={1}>
                        <Statistic title="N° Experiment" value={this.props.experiments.length} />
                    </Col>
                    <Col span={3}>
                        <Statistic title="N° Managed" value={this.props.experiments_managed} />
                    </Col>
                    <Col span={3}>
                        <Statistic title="N° Verified" value={this.props.experiments_valid} />
                    </Col>
                </Row>
            </>

        const rowSelection = this.props.selectHook ? {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [Table.SELECTION_ALL],
            columnWidth: '55px'
        } : undefined

        return(
            <div ref={this.listRef}>
            <Table
                title={()=> this.props.header ? header : undefined}
                columns={columns}
                scroll={{y: '100%'}}
                rowSelection={rowSelection}
                dataSource={this.props.experiments}
                rowKey="id"
                size='small'
                loading={this.props.loading}
                bordered
                style={{minHeight: 100}}
                expandRowByClick={true}
                expandedRowRender={record => {
                    return <TabExperiment exp_id={record.id} experiment={record}/>
                }}

            />
            </div>
        )
    }
}

export default BaseTable;