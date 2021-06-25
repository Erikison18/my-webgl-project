import React from 'react'
import "./index.css"

// 1.jsx
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}
const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};
const jsx = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

// 2.组件 & Props
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
function formatDate(date) {
  return date.toLocaleDateString();
}
const comment = {
  date: new Date(),
  text: 'I hope you enjoy learning React!',
  author: {
    name: 'Hello Kitty',
    avatarUrl: 'https://placekitten.com/g/64/64',
  },
};
// 3.State & 生命周期
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
  componentDidMount() {
    this.timeID = setInterval(()=> {
      this.tick();
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timeID);
  }
  tick() {
    this.setState({
      date: new Date(),
    })
  }
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
// 4.事件处理 & 条件渲染
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};
    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }
  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}
function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}
function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }
  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }
  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }
  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }
    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}
// 5.列表 & Key
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  return (
    <div>
      {sidebar}
      {
        props.posts.map((post) =>
          <div key={post.id}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </div>
        )
      }
    </div>
  );
}
const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
// 6.表单
class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '' ,
      valueSelect: 'coconut',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleChangeSelect(event) {
    this.setState({valueSelect: event.target.value});
  }
  handleSubmit(event) {
    alert('提交的名字: ' + this.state.value);
    alert('你喜欢的风味是: ' + this.state.valueSelect);
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          选择你喜欢的风味:
          <select value={this.state.valueSelect} onChange={this.handleChangeSelect}>
            <option value="grapefruit">葡萄柚</option>
            <option value="lime">酸橙</option>
            <option value="coconut">椰子</option>
            <option value="mango">芒果</option>
          </select>
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}

class App extends React.Component{
  render() {
      return <div>
          <h3>1.jsx</h3>
          <div>
            {jsx}
          </div>
          <h3>2.组件 & Props</h3>
          <div>
            <Comment 
              date={comment.date}
              text={comment.text}
              author={comment.author}
            ></Comment>
          </div>
          <h3>3.State & 生命周期</h3>
          <div>
            <Clock></Clock>
          </div>
          <h3>4.事件处理 & 条件渲染</h3>
          <div>
            <Toggle></Toggle>
            <LoginControl></LoginControl>
          </div>
          <h3>5.列表 & Key</h3>
          <div>
            <Blog posts={posts} />
          </div>
          <h3>6.表单</h3>
          <div>
            <MyForm></MyForm>
          </div>
          <h3>7.状态提升</h3>
          <div>

          </div>
        </div>
    }
}

export default App