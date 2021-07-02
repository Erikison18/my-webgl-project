import React, { useState, useEffect } from 'react'
import "./index.css"

function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("https://restapi.amap.com/v3/weather/weatherInfo?parameters")
      .then(res => res.json({city: "110101"}))
      .then(
        (result) => {
          setIsLoaded(true);
          // setItems(result.items);
          setItems([
            { "id": 1, "name": "Apples",  "price": "$2" },
            { "id": 2, "name": "Peaches", "price": "$5" }
          ]);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {items.map(item => (
          <li key={item.name}>
            {item.name} {item.price}
          </li>
        ))}
      </ul>
    );
  }
}
// 传递函数给组件
const A = 65 // ASCII character code
class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }
  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}

class App extends React.Component{
  render() {
      let name = "4567";
      return <div>
          <h3>1.AJAX and APIs</h3>
          <div>
            <MyComponent></MyComponent>
          </div>
          <h3>2.Babel，JSX 及构建过程</h3>
          <div>
            <div>
              {/* 注释写在这里 */}
              Hello, {name}!
            </div>
          </div>
          <h3>3.传递函数给组件</h3>
          <div>
            <Alphabet></Alphabet>
          </div>
          <h3>4.组件状态</h3>
          <div>
          </div>
          <h3>5.样式与 CSS</h3>
          <div>
          </div>
          <h3>6.项目文件结构</h3>
          <div>
          </div>
          <h3>7.Virtual DOM 及内核</h3>
          <div>
          </div>
        </div>
    }
}

export default App