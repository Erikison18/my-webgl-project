import React from 'react'

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
        </div>
    }
}

export default App