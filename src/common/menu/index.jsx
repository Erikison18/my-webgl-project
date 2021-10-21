import React from 'react'
import { Menu } from 'antd';
import "./index.scss";

class MyMenu extends React.Component {
    state = {
        current: 'shadow',
    };

    componentDidMount() {
        // console.log(this);
    }

    handleClick = e => {
        this.setState({ current: e.key });
    };

    render() {
        const { current } = this.state;
        let menuList = [{
            key: "shadow",
            name: "着色器",
        }, {
            key: "scene",
            name: "3D场景",
        }, {
            key: "solarSystem",
            name: "太阳系",
        }, {
            key: "earth",
            name: "地球",
        }]
        return (<Menu mode="horizontal" onClick={this.handleClick} selectedKeys={[current]} className="main-menu">
                    {
                        menuList.map((item)=> {
                            return <Menu.Item key={item.key}>
                                <a href={`#/${item.key}`}>{item.name}</a>
                            </Menu.Item>;
                        })
                    }
                </Menu>)
    }
}

export default MyMenu;