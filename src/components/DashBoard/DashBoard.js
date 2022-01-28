import React from "react";
import {checkError} from "../Tool";
import {Tabs} from "antd";
import ActionCell from "../Shared/ActionCell";

const axios = require('axios');
import Cookies from "js-cookie";
import TableReport from "./TableReport";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class DashBoard extends React.Component {

    render() {
        return (
            <Tabs defaultActiveKey="1" centered>
                <Tabs.TabPane tab="Waiting" key="1">
                    <TableReport api={'OpenSmoke/API/Report/getReportWaitingExecution'} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Running" key="2">
                    <TableReport api={'OpenSmoke/API/Report/getReportRunningExecution'} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Ended with errors" key="3">
                    <TableReport api={'OpenSmoke/API/Report/getReportEndedWithErrorExecution'} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Ended with no columns" key="4">
                    <TableReport api={'OpenSmoke/API/Report/getReportEndedWithNoErrorNoColumnsExecution'} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Missing Curve Matching" key="5">
                    <TableReport api={'OpenSmoke/API/Report/getReportNoCurveMatchingExecution'} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Negative Curve Matching" key="6">
                    <TableReport api={'OpenSmoke/API/Report/getReportNegativeCurveMatchingExecution'} />
                </Tabs.TabPane>
            </Tabs>
        )
    }

}

export default DashBoard;