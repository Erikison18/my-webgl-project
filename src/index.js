import React from 'react'
import ReactDOM from 'react-dom';
import Router from './router/router';


class App extends React.Component{
    render() {
      return <div>
                <ol>
                    <li><a href="#/gameChess">gameChess</a></li>
                    <li><a href="#/coreContent">coreContent</a></li>
                    <li><a href="#/seniorGuidance">seniorGuidance</a></li>
                    <li><a href="#/about">about</a></li>
                </ol>
                <Router />
        </div>
    }
}

ReactDOM.render((
    <App />
), document.getElementById('root'))
