import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Router from './router/router';
import { Menu } from 'antd';
import "./index.css";

class App extends React.Component {
    state = {
        current: 'shadow',
    };

    handleClick = e => {
        // console.log('click ', e);
        this.setState({ current: e.key });
    };

    render() {
        const { current } = this.state;
        return (<Provider store={store}>
            <div>
                <Menu mode="horizontal" onClick={this.handleClick} selectedKeys={[current]}>
                    <Menu.Item key="shadow">
                        <a href="#/shadow">着色器</a>
                    </Menu.Item>
                    <Menu.Item key="triangle">
                        <a href="#/triangle">绘制三角形</a>
                    </Menu.Item>
                </Menu>
                <div className="page-content">
                    <Router />
                </div>
            </div>
        </Provider >)
    }
}

ReactDOM.render((
    <App />
), document.getElementById('root'))
