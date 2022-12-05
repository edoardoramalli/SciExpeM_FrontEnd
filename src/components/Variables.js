import React from "react";
import {Row, Space} from "antd";

const reactors = ['shock tube', 'stirred reactor', 'flow reactor', 'flame', 'rapid compression machine']
const experimentTypeToReactor = {
    'ignition delay measurement': ['shock tube', 'rapid compression machine'],
    'laminar burning velocity measurement': ['flame'],
    'outlet concentration measurement': ['shock tube', 'stirred reactor', 'flow reactor'],
    'concentration time profile measurement': ['shock tube', 'stirred reactor', 'flow reactor'],
    'jet stirred reactor measurement': ['shock tube', 'stirred reactor', 'flow reactor'],
    'burner stabilized flame speciation measurement': ['flame'],
    'direct rate coefficient measurement': ['shock tube', 'stirred reactor', 'flow reactor'],
}
const reactor_modes = ['counterflow', 'premixed', 'coflow', 'burner stabilized stagnation']

const ignition_type = ['max', 'd/dt max', 'baseline max intercept from d/dt', 'baseline min intercept from d/dt', 'concentration', 'relative concentration']
const ignition_quantity = ['T', 'p', 'OH', 'CH', 'CO2']

const property_list = {
    'temperature': ['K'],
    'pressure': ['Pa', 'kPa', 'MPa', 'Torr', 'torr', 'bar', 'mbar', 'atm'],
    'ignition delay': ['s', 'ms', 'us', 'ns', 'min'],
    'composition': ['mole fraction'],
    'laminar burning velocity': ['m/s', 'dm/s', 'cm/s', 'mm/s', 'm s-1', 'dm s-1', 'cm s-1', 'mm s-1'],
    'volume': ['m3', 'dm3', 'cm3', 'mm3', 'L'],
    'time': ['s', 'ms', 'us', 'ns', 'min'],
    'residence time': ['s', 'ms', 'us', 'ns', 'min'],
    'distance': ['m', 'dm', 'cm', 'mm'],
    'rate coefficient': ['s-1', 'm3 mol-1 s-1', 'dm3 mol-1 s-1', 'cm3 mol-1 s-1', 'm3 molecule-1 s-1',
        'dm3 molecule-1 s-1', 'cm3 molecule-1 s-1', 'm6 mol-3 s-1', 'dm6 mol-2 s-1',
        'cm6 mol-2 s-1', 'm6 molecule-2 s-1', 'dm6 molecule-2 s-1', 'cm6 molecule-2 s-1'],
    'equivalence ratio': ['unitless'],
    'length': ['m', 'dm', 'cm', 'mm'],
    'density': ['g m-3', 'g dm-3', 'g cm-3', 'g mm-3', 'kg m-3', 'kg dm-3', 'kg cm-3', 'kg mm-3'],
    'flow rate': ['g m-2x s-1', 'g dm-2 s-1', 'g cm-2 s-1', 'g mm-2 s-1', 'kg m-2 s-1', 'kg dm-2 s-1', 'kg cm-2 s-1', 'kg mm-2 s-1'],
    'concentration': ['mol/m3', 'mol/dm3', 'mol/cm3', 'mol m-3', 'mol dm-3', 'mol cm-3', 'molecule/m3', 'molecule/dm3', 'molecule/cm3', 'molecule m-3', 'molecule dm-3', 'molecule cm-3'],
    'soot volume fraction': ['unitless'],
    'H/C ratio': ['unitless'],
    'number density': ['cm-3'],
    'particle diameter': ['nm'],
    'primary particle diameter': ['nm'],
    'particle size distribution': ['cm-3'],
    'primary particle size distribution': ['cm-3'],
}

export const colorScale = [
    [0, "rgb(165,0,38)"],
    [0.1, "rgb(215,48,39)"],
    [0.2, "rgb(244,109,67)"],
    [0.3, "rgb(253,174,97)"],
    [0.4, "rgb(254,224,139)"],
    [0.5, "rgb(255,255,191)"],
    [0.6, "rgb(217,239,139)"],
    [0.7, "rgb(166,217,106)"],
    [0.8, "rgb(102,189,99)"],
    [0.9, "rgb(26,152,80)"],
    [1, "rgb(0,104,55)"]]


function create_ignition() {
    let tmp = []
    ignition_quantity.map((item) => {
        ignition_type.map((item2) => {
            tmp.push(item + '-' + item2)
        })
    })
    tmp = [undefined, ...tmp]
    return tmp
}

const ignition = create_ignition()

export function parseTime(timeString) {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hc:'h24'};
    return timeString ? <>{new Date(timeString).toLocaleDateString('en-GB', options)}</> : <></>
}

function humanFileSize(size) {
    let i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

export function string_compare(a, b) {
    const aa = a !== null ? a : ''
    const bb = b !== null ? b : ''
    return aa.localeCompare(bb)
}

export const table_columns = {
    execution__execution_created: {
        title: 'Creation Time',
        dataIndex: 'execution_created',
        key: 'execution_created',
        sorter: (a, b) => new Date(a.execution_created) - new Date(b.execution_created),
        render: (props, record) => <>{parseTime(record.execution_created)}</>,
    },
    execution__execution_start: {
        title: 'Start Time',
        dataIndex: 'execution_start',
        key: 'execution_start',
        sorter: (a, b) => new Date(a.execution_start) - new Date(b.execution_start),
        render: (props, record) => <>{parseTime(record.execution_start)}</>,
    },
    execution__execution_end: {
        title: 'End Time',
        dataIndex: 'execution_end',
        key: 'execution_end',
        sorter: (a, b) => new Date(a.execution_end) - new Date(b.execution_end),
        render: (props, record) => <>{parseTime(record.execution_end)}</>,
    },
    execution__username: {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
        sorter: (a, b) => string_compare(a.username, b.username),
        width: '15%'
    },
    execution__num_files: {
        title: 'Info',
        dataIndex: 'num_files',
        key: 'num_files',
        render: (props, record) => {
            let tmp = [];
            if (record.num_files > 0) {
                tmp.push(<div style={{'color': 'green'}}>R</div>)
            }
            if (record.has_error){
                tmp.push(<div style={{'color': 'red'}}>E</div>)
            }
            return <Row><Space>{tmp}</Space></Row>
        },
        sorter: (a, b) => {
            return a.num_files > b.num_files
        },
    },
    execution__folder_size: {
        title: 'Size',
        dataIndex: 'folder_size',
        key: 'folder_size',
        render: (props, record) => {
            if (record.folder_size !== null) {
                return humanFileSize(record.folder_size)
            } else {
                return <></>
            }
        },
        sorter: (a, b) => {
            return a.folder_size > b.folder_size
        }
    },
    execution__computer: {
        title: 'Computer Name',
        dataIndex: 'computer',
        sorter: (a, b) => string_compare(a.computer, b.computer)
    },
}

export default {reactors, experimentTypeToReactor, ignition_type, ignition_quantity, ignition, reactor_modes, property_list}