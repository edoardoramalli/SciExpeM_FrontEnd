import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'

// Import CSS
import './components/index.css';
// import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
// import 'react-table/react-table.css'

// Import Local Componentsont
import App from "./components/App";

window.$API_address = "";
// window.$API_address = "http://127.0.0.1:8080/";
// window.$API_address = "https://dev.chem.polimi.it/";
// window.$API_address = "https://sciexpem.chem.polimi.it/";



ReactDOM.render(<BrowserRouter><App/></BrowserRouter>, document.getElementById("root"));


