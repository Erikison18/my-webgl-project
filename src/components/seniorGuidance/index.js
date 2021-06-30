import React from 'react';
import ReactDOM from 'react-dom';
import {ThemeContext, themes} from './context/theme-context';
import ThemedButton from './context/themed-button';
import ErrorBoundary from "./errorBoundary/errorBoundary";
import PropTypes from 'prop-types';

// 1.Context
// 一个使用 ThemedButton 的中间组件
function Toolbar(props) {
    return (
      <ThemedButton>
        Change Theme
      </ThemedButton>
    );
}
// 2.错误边界
class BuggyCounter extends React.Component {
    constructor(props) {
      super(props);
      this.state = { counter: 0 };
      this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
      this.setState(({counter}) => ({
        counter: counter + 1
      }));
    }
    
    render() {
      if (this.state.counter === 5) {
        // Simulate a JS error
        throw new Error('I crashed!');
      }
      return <h1 onClick={this.handleClick}>{this.state.counter}</h1>;
    }
}
// 3.Refs 转发
class MyTextArea extends React.Component {
    myFuction() {
        console.log("MyTextArea myFuction");
    }
    render() {
        const {forwardedRef, ...rest} = this.props;
        return <div>
            <textarea ref={forwardedRef} {...rest}></textarea>
        </div>; 
    }
}
class FancyButton extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.refInput = React.createRef();
        this.refText = React.createRef();
        this.onClick = this.onClick.bind(this);
    }
    onClick() {
        console.log(this);
        console.log(this.ref.current);
        console.log(this.refText.current);
        this.refText.current.myFuction();
        this.refInput.current.focus();
    }
    render() {
        return <div>
            <button ref={this.ref} onClick={this.onClick}>Click me!</button>
            <input ref={this.refInput}></input>
            <MyTextArea ref={this.refText} className="myTextArea"/>
        </div>; 
    }
}
// 4.Fragments
class Table extends React.Component {
    render() {
      return (
        <table>
            <tbody>
                <tr>
                    <Columns />
                </tr>
            </tbody>
        </table>
      );
    }
}
class Columns extends React.Component {
    render() {
      return (
        // <React.Fragment>
        <>
          <td>Hello</td>
          <td>World</td>
        </>
        // </React.Fragment>
      );
    }
}
// 5.高阶组件--HOC函数
// 此函数接收一个组件...
function withSubscription(WrappedComponent, selectData) {
    // ...并返回另一个组件...
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
        //   data: selectData(DataSource, props)
        };
      }
  
    //   componentDidMount() {
    //     // ...负责订阅相关的操作...
    //     DataSource.addChangeListener(this.handleChange);
    //   }
  
    //   componentWillUnmount() {
    //     DataSource.removeChangeListener(this.handleChange);
    //   }
  
    //   handleChange() {
    //     this.setState({
    //       data: selectData(DataSource, this.props)
    //     });
    //   }
  
      render() {
        // ... 并使用新数据渲染被包装的组件!
        // 请注意，我们可能还会传递其他属性
        return <WrappedComponent />;
      }
    };
}
// const CommentListWithSubscription = withSubscription(
//     CommentList,
//     (DataSource) => DataSource.getComments()
// );
// const BlogPostWithSubscription = withSubscription(
//     BlogPost,
//     (DataSource, props) => DataSource.getBlogPost(props.id)
// );
// 6.与第三方库协同
// 7.深入 JSX
// 8.性能优化
class CounterButton extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {count: 1};
    }
    // PureComponent 等价于 组件只有当 props.color 或者 state.count 的值改变才需要更新
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.props.color !== nextProps.color) {
    //       return true;
    //     }
    //     if (this.state.count !== nextState.count) {
    //       return true;
    //     }
    //     return false;
    // }
    render() {
      return (
        <button
          color={this.props.color}
          onClick={() => this.setState(state => ({count: state.count + 1}))}>
          Count: {this.state.count}
        </button>
      );
    }
}
// 9.portals
// 在 DOM 中有两个容器是兄弟级 （siblings）
class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }
    componentDidMount() {
        this.modalRoot = document.getElementById('modal-root');
        // 在 Modal 的所有子元素被挂载后，
        // 这个 portal 元素会被嵌入到 DOM 树中，
        // 这意味着子元素将被挂载到一个分离的 DOM 节点中。
        // 如果要求子组件在挂载时可以立刻接入 DOM 树，
        // 例如衡量一个 DOM 节点，
        // 或者在后代节点中使用 ‘autoFocus’，
        // 则需添加 state 到 Modal 中，
        // 仅当 Modal 被插入 DOM 树中才能渲染子元素。
        this.modalRoot.appendChild(this.el);
    }
    componentWillUnmount() {
        this.modalRoot.removeChild(this.el);
    }
    render() {
        return ReactDOM.createPortal(
        this.props.children,
        this.el
        );
    }
}
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    // 当子元素里的按钮被点击时，
    // 这个将会被触发更新父元素的 state，
    // 即使这个按钮在 DOM 中不是直接关联的后代
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }
  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}
function Child() {
  // 这个按钮的点击事件会冒泡到父元素
  // 因为这里没有定义 'onClick' 属性
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}
// 10.Profiler API---测量渲染一个 React 应用多久渲染一次以及渲染一次的“代价”
function onRenderCallback(
    id, // 发生提交的 Profiler 树的 “id”
    phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
    actualDuration, // 本次更新 committed 花费的渲染时间
    baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
    startTime, // 本次更新中 React 开始渲染的时间
    commitTime, // 本次更新中 React committed 的时间
    interactions // 属于本次更新的 interactions 的集合
) {
    // 合计或记录渲染时间。。。
    console.log(
        id, // 发生提交的 Profiler 树的 “id”
        phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
        actualDuration, // 本次更新 committed 花费的渲染时间
        baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
        startTime, // 本次更新中 React 开始渲染的时间
        commitTime, // 本次更新中 React committed 的时间
        interactions
    );
}
// 11.不使用 ES6 && 不使用 JSX
var SetIntervalMixin = {
    componentWillMount: function() {
      this.intervals = [];
    },
    setInterval: function() {
      this.intervals.push(setInterval.apply(null, arguments));
    },
    componentWillUnmount: function() {
      this.intervals.forEach(clearInterval);
    }
};
// var createReactClass = require('create-react-class');
// var TickTock = createReactClass({
//     mixins: [SetIntervalMixin], // 使用 mixin
//     getInitialState: function() {
//       return {seconds: 0};
//     },
//     componentDidMount: function() {
//       this.setInterval(this.tick, 1000); // 调用 mixin 上的方法
//     },
//     tick: function() {
//       this.setState({seconds: this.state.seconds + 1});
//     },
//     render: function() {
//       return (
//         <p>
//           React has been running for {this.state.seconds} seconds.
//         </p>
//       );
//     }
// });
// 13. Render Props
class Cat extends React.Component {
    render() {
        const mouse = this.props.mouse;
        return (
            <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
        );
    }
}
class Mouse extends React.Component {
    constructor(props) {
        super(props);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.state = { x: 0, y: 0 };
    }
    handleMouseMove(event) {
        let offsetX = this.state.x, offsetY = this.state.y;
        let srcObj = event.target || event.srcElement;
	    if (event.offsetX && event.offsetY){
            offsetX = event.offsetX;
            offsetY = event.offsetY;
	    }else{
            let rect = srcObj.getBoundingClientRect();
	        let clientx = event.clientX;
	        offsetX = clientx - rect.left;
            let clienty = event.clientY;
	        offsetY = clienty - rect.top;
	    }

        this.setState({
            x: offsetX,
            y: offsetY,
        });
    }
    render() {
        return (
            <div style={{ height: '20vh', position: "relative" }} onMouseMove={this.handleMouseMove}>
                {/*
                    Instead of providing a static representation of what <Mouse> renders,
                    use the `render` prop to dynamically determine what to render.
                */}
                {this.props.render(this.state)}
            </div>
        );
    }
}
class MouseTracker extends React.Component {
    render() {
        return (
        <div>
            <h1>移动鼠标!</h1>
            <Mouse render={mouse => (
                <Cat mouse={mouse} />
            )}/>
        </div>
        );
    }
}
// 16.PropTypes 进行类型检查
class MyComponent extends React.Component {
    static defaultProps = {
        name: 'MyComponent'
    }
    render() {
      // 这必须只有一个元素，否则控制台会打印警告。
      const children = this.props.children;
      return (
        <div>
            <p>{this.props.name}</p>
            <Message></Message>
            {children}
        </div>
      );
    }
}
class Message extends React.Component {
    render() {
      return (
        <h6>Message:{this.props.name}</h6>
      );
    }
}
// 指定 props 的默认值：
Message.defaultProps = {
    name: 'Stranger'
};
MyComponent.propTypes = {
  // 你可以将属性声明为 JS 原生类型，默认情况下
  // 这些属性都是可选的。
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,
  // 任何可被渲染的元素（包括数字、字符串、元素或数组）
  // (或 Fragment) 也包含这些类型。
  optionalNode: PropTypes.node,
  // 一个 React 元素。
  optionalElement: PropTypes.element,
  // 一个 React 元素类型（即，MyComponent）。
  optionalElementType: PropTypes.elementType,
  // 你也可以声明 prop 为类的实例，这里使用
  // JS 的 instanceof 操作符。
  optionalMessage: PropTypes.instanceOf(Message),
  // 你可以让你的 prop 只能是特定的值，指定它为
  // 枚举类型。
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),
  // 一个对象可以是几种类型中的任意一个类型
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),
  // 可以指定一个数组由某一类型的元素组成
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
  // 可以指定一个对象由某一类型的值组成
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),
  // 可以指定一个对象由特定的类型值组成
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),
  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),   
  // 你可以在任何 PropTypes 属性后面加上 `isRequired` ，确保
  // 这个 prop 没有被提供时，会打印警告信息。
  requiredFunc: PropTypes.func.isRequired,
  // 任意类型的数据
  requiredAny: PropTypes.any.isRequired,
  // 你可以指定一个自定义验证器。它在验证失败时应返回一个 Error 对象。
  // 请不要使用 `console.warn` 或抛出异常，因为这在 `onOfType` 中不会起作用。
  customProp: function(props, propName, componentName) {
      console.log(props, propName, componentName, props[propName], !/matchme/.test(props[propName]));
    if (!/matchme/.test(props[propName])) {
      console.log(props, propName, componentName);
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },
  // 你也可以提供一个自定义的 `arrayOf` 或 `objectOf` 验证器。
  // 它应该在验证失败时返回一个 Error 对象。
  // 验证器将验证数组或对象中的每个值。验证器的前两个参数
  // 第一个是数组或对象本身
  // 第二个是他们当前的键。
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
// 17.非受控组件
class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.input = React.createRef();
      this.fileInput = React.createRef();
    }
    handleSubmit(event) {
      console.log('A name was submitted: ' + this.input.current.value);
      console.log(`Selected file - ${this.fileInput.current.files[0].name}`);
      event.preventDefault();
    }
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" ref={this.input} />
          </label>
          <label>
            Upload file:
            <input type="file" ref={this.fileInput} />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

class App extends React.Component{
    constructor(props) {
        super(props);
        this.toggleTheme = () => {
          this.setState(state => ({
            theme:
              state.theme === themes.dark
                ? themes.light
                : themes.dark,
          }));
        };
        this.state = {
          theme: themes.light,
          toggleTheme: this.toggleTheme,
        };
    }

    render() {
        return <div>
            <h3>1.Context</h3>
            <div>
                <ThemeContext.Provider value={this.state}>
                    <Toolbar />
                </ThemeContext.Provider>
                <div>
                    {/* <ThemedButton>No Change Theme</ThemedButton> */}
                </div>
            </div>
            <h3>2.错误边界</h3>
            <div>
                <ErrorBoundary>
                    <BuggyCounter />
                </ErrorBoundary>
                <ErrorBoundary>
                    <BuggyCounter />
                </ErrorBoundary>
            </div>
            <h3>3.Refs 转发</h3>
            <div>
                <FancyButton></FancyButton>
            </div>
            <h3>4.Fragments</h3>
            <div>
                <Table></Table>
            </div>
            <h3>5.高阶组件--HOC函数(高阶组件是参数为组件，返回值为新组件的函数。)</h3>
            <div>
            </div>
            <h3>6.与第三方库协同</h3>
            <div>
            </div>
            <h3>7.深入 JSX</h3>
            <div>
            </div>
            <h3>8.性能优化</h3>
            <div>
                <CounterButton color="blue"></CounterButton>
            </div>
            <h3>9.portals</h3>
            <div> 
                <div id="app-root" style={{backgroundColor: "greenyellow"}}>
                    <Parent></Parent>
                </div>
                <div id="modal-root"></div>
            </div>
            <h3>10.Profiler API</h3>
            <div>
                <React.Profiler id="Navigation" onRender={onRenderCallback}>
                    <CounterButton />
                </React.Profiler>
                <React.Profiler id="Main" onRender={onRenderCallback}>
                    <Parent />
                </React.Profiler>
            </div>
            <h3>11.不使用 ES6 & 不使用 JSX</h3>
            <div>
            </div>
            <h3>12.Refs & DOM</h3>
            <div>
            </div>
            <h3>13. Render Props</h3>
            <div>
                <React.StrictMode>
                    <MouseTracker></MouseTracker>
                </React.StrictMode>
            </div>
            <h3>14.静态类型检查</h3>
            <div>
                Flow 和 TypeScript 等这些静态类型检查器，可以在运行前识别某些类型的问题。
            </div>
            <h3>15.严格模式</h3>
            <div>
            </div>
            <h3>16.PropTypes 进行类型检查</h3>
            <div>
                <MyComponent requiredAny={true} requiredFunc={()=>{}} customProp={"matchme6u"}></MyComponent>
            </div>
            <h3>17.非受控组件(受控组件中，表单数据是由 React 组件来管理的。非受控组件中，表单数据将交由 DOM 节点来处理。)</h3>
            <div>
                <NameForm></NameForm>
            </div>
            <h3>18.Web Components</h3>
            <div>
            </div>
        </div>
    }
}

export default App