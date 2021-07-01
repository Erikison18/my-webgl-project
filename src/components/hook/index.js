import React, { useState, useEffect } from 'react'
import "./index.css"

// State Hook、 State Hook
function Example() {
  const [count, setCount] = useState(0);
  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器的 API 更新页面标题
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
// 自定义 Hook
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  let ChatAPI = {
    subscribeToFriendStatus: (friendID, callback)=> {
      if (friendID === 1) {
        callback({isOnline: true});
      } else {
        callback({isOnline: false});
      }
    },
    unsubscribeFromFriendStatus: (friendID, callback)=> {
      callback({isOnline: null});
    },
  };
  useEffect(() => {
    console.log(friendID);
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  }, [friendID]);
  return isOnline;
}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);
  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);
  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
let friend = {
  id: 1,
  name: "cao",
};
let friend1 = {
  id: 2,
  name: "qiang",
};
// 示当前选定的好友是否在线:
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];
function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
  return (
    <>
      <p style={{color: isRecipientOnline ? 'green' : 'red'}}>{friendList[recipientID-1].name}</p>
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}

class App extends React.Component{
  render() {
      return <div>
          <h3>1.Hook 简介</h3>
          <div>
            不编写 class 的情况下使用 state 以及其他的 React 特性
          </div>
          <h3>2.Hook 概览-- State Hook、 State Hook、自定义 Hook、useContext、useReducer</h3>
          <div>
              <h6>State Hook、 State Hook</h6>
              <Example></Example>
              <h6>自定义 Hook</h6>
              <FriendStatus friend={friend}></FriendStatus><br></br>
              <FriendStatus friend={friend1}></FriendStatus>
              <ul>
                <FriendListItem friend={friend}></FriendListItem>
                <FriendListItem friend={friend1}></FriendListItem>
              </ul>
          </div>
          <h3>3.使用 State Hook-- React 函数组件上添加内部 state</h3>
          <div>
          </div>
          <h3>4.使用 Effect Hook--让你在函数组件中执行副作用操作，可以看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。</h3>
          <div></div>
          <h3>5.Hook 规则</h3>
          <div>
            <ul>
              <li>只在最顶层使用 Hook--不要在循环，条件或嵌套函数中调用 Hook</li>
              <li>只在 React 函数中调用 Hook--不要在普通的 JavaScript 函数中调用 Hook</li>
            </ul>
          </div>
          <h3>6.自定义 Hook---将组件逻辑提取到可重用的函数中</h3>
          <div>
            <p>自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook</p>
            <ChatRecipientPicker></ChatRecipientPicker>
          </div>
        </div>
    }
}

export default App