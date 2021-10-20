import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Router from './router/router';
import Menu from './common/menu';
import "./index.scss";

class App extends React.Component {

    render() {
        return (<Provider store={store}>
                <div className="page-content">
                    <Router>
                        <Menu></Menu>
                    </Router>
                </div>
        </Provider >)
    }
}

ReactDOM.render((
    <App />
), document.getElementById('root'))
