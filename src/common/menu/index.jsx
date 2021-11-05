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
        }, {
            key: "kongmingdeng",
            name: "孔明灯",
        }, {
            key: "chongdong",
            name: "虫洞",
        }, {
            key: "bofang",
            name: "3D播放",
        }, {
            key: "yuzhuo",
            name: "玉镯",
        }, {
            key: "fenzi",
            name: "化学分子",
        }, {
            key: "houseDesign",
            name: "房屋设计",
        }, {
            key: "engine",
            name: "发动机",
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