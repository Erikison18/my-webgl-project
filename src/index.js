import React from 'react'
import ReactDOM from 'react-dom';
import Router from './router/router';
import { Button } from 'antd';
import "./index.css";

class App extends React.Component{
    render() {
      return <div>
                <ol>
                    <li><a href="#/gameChess">gameChess</a></li>
                    <li><a href="#/coreContent">coreContent</a></li>
                    <li><a href="#/seniorGuidance">seniorGuidance</a></li>
                    <li><a href="#/api">api</a></li>
                    <li><a href="#/hook">hook</a></li>
                    <li><a href="#/faq">faq</a></li>
                    <li><a href="#/about">about</a></li>
                </ol>
                <Button type="primary">Button</Button>
                <Router />
        </div>
    }
}

ReactDOM.render((
    <App />
), document.getElementById('root'))
