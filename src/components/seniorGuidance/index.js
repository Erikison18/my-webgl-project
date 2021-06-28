import React from 'react'
import {ThemeContext, themes} from './context/theme-context';
import ThemedButton from './context/themed-button';
import ErrorBoundary from "./errorBoundary/errorBoundary";

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
            </div>
        </div>
    }
}

export default App