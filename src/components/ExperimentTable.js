import React from "react";
import axios from "axios";
import {CommonPropertiesList, InitialSpeciesList} from "./Search";
import {Table, Input, Button, Icon,} from "antd";
import Highlighter from 'react-highlight-words';

// Local Import
import ActionCell from "./ActionCell";
import TabExperiment from "./InfoExperimentFolder/TabExperiment";


class ExperimentTable extends React.Component {
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
                    icon={<Icon type="search"/>}
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
        filterIcon: filtered => <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>,
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

    constructor(props) {
        super(props);
        this.state = {
            experiments: [],
            loading: true,
            number_managed: 0
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        axios.get(window.$API_address + 'frontend/api/experiments/')
            .then(res => {
                const experiments = res.data;
                const experiments_managed = res.data.filter((exp) => exp.run_type_str != null);
                this.setState({experiments: experiments, loading: false, number_managed: experiments_managed.length});
            })
        axios.get(window.$API_address + 'frontend/api/opensmoke/species_names')
            .then(res => {
                const names = res.data.names
                let list = []
                let i;
                for (i = 0; i < names.length; i++) {
                    list.push({text: names[i], value: names[i]})
                }
                this.setState({filter_type_exp: list.sort(function(a, b) {
                    return a.value > b.value;})});
            })
    }

    // handle local delete
    handleDelete = (e_id) => {

        this.setState({experiments: this.state.experiments.filter(item => item.id !== e_id)});

    };

    render() {
        // const speciesOptions = this.state.species.map((specie) =>
        //     <Select.Option value={specie} key={specie}>{specie}</Select.Option>
        // );

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

        const filter_properties = [
            {
                text: 'Temperature',
                value: 'temperature',
            }, {
                text: 'Pressure',
                value: 'pressure',
            }, {
                text: 'Residence Time',
                value: 'residence time',
            }, {
                text: 'Volume',
                value: 'volume',
            }, {
                text: 'Laminar Burning Velocity',
                value: 'laminar burning velocity',
            }]

        const columns = [
            {
                title: 'File DOI',
                dataIndex: 'fileDOI',
                key: 'fileDOI',
                width: '20%',
                ...this.getColumnSearchProps('fileDOI'),
                sorter: (a, b) => {
                    return a.fileDOI.localeCompare(b.fileDOI)
                },

            },
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id',
                width: '7%',
                sorter: (a, b) => {
                    return a.id > b.id
                },
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
                width: '15%',
                filters: filter_reactor_type,
                onFilter: (value, record) => record.reactor.toLowerCase().includes(value),

                sorter: (a, b) => {
                    return a.reactor.localeCompare(b.reactor)
                },
            },
            {
                title: 'Experiment type',
                dataIndex: 'experiment_type',
                key: 'experiment_type',
                width: '20%',
                filters: filter_exp_type,
                onFilter: (value, record) => record.experiment_type.toLowerCase().includes(value),
                sorter: (a, b) => {
                    return a.experiment_type.localeCompare(b.experiment_type)
                },
            },
            {
                title: 'Properties',
                dataIndex: 'common_properties',
                key: 'common_properties',
                width: '15%',
                filters: filter_properties,
                onFilter: (value, record) => {
                    let i;
                    for (i = 0; i < record.common_properties.length; i++) {
                        if (record.common_properties[i].name.includes(value)) {
                            return true;
                        }
                    }
                    return false;
                },
                render: props => <CommonPropertiesList common_properties={props}/>
            },
            {
                title: 'Initial species',
                dataIndex: 'initial_species',
                key: 'initial_species',
                width: '10%',
                filters: this.state.filter_type_exp,
                onFilter: (value, record) => {
                    let i;
                    for (i = 0; i < record.initial_species.length; i++) {
                        if (record.initial_species[i].name.includes(value)) {
                            return true;
                        }
                    }
                    return false;
                },
                render: props => <InitialSpeciesList initial_species={props}/>,
            },
            {
                title: 'Action',
                dataIndex: 'actions',
                key: 'actions',
                width: '10%',
                render: (text, record) => <ActionCell e_id={record.id} file_doi={record.fileDOI}
                                                      handleDelete={this.handleDelete}/>
            },];

        return (
            <div>
                {/*<span>*/}
                {/*    Stored: {this.state.experiments.length} experiments - Managed: {this.state.number_managed} experiments*/}
                {/*</span>*/}
                <Table
                    scroll={{y: '100%'}}
                    columns={columns}
                    dataSource={this.state.experiments}
                    rowKey="id"
                    loading={this.state.loading}
                    bordered
                    //expandedRowRender={record => {return <ExperimentDetail experiment={record}/>}}
                    // expandedRowRender={record => {return <ExperimentDraw experiment={record}/>}}
                    expandedRowRender={record => {
                        return <TabExperiment experiment={record}/>
                    }}

                />

            </div>
        )
    }
}

export default ExperimentTable;