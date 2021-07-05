import React, { useState, useEffect } from 'react'
// import { connect } from 'react-redux'
import { add, reduce, getList } from '../../store/action'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'antd';
import "./index.scss"

function App() {
    const [catData, setCatData] = useState({ id: "", url: "" });
    const [catListData, setCatListData] = useState([]);
    useEffect(() => {
        // "proxy": "https://thatcopy.pw",
        fetch('https://thatcopy.pw/catapi/rest/').then((response) => {
            let promise = response.json();
            promise.then((catData) => {
                // console.log(catData, 99)
                setCatData(catData);
            });
        });
        getData('/facts/random', { type: "cat", amount: 5 }).then((catListData) => {
            // console.log(catListData, 99)
            setCatListData(catListData);
        });
        async function getData(url = '', data = { type: "cat", amount: 3 }) {
            // Default options are marked with *
            const response = await fetch(`${url}?animal_type=${data.type}&amount=${data.amount}`, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            });
            return response.json(); // parses JSON response into native JavaScript objects
        }
        // async function postData(url = '', data = {}) {
        //     // Default options are marked with *
        //     const response = await fetch(url, {
        //       method: 'POST', // *GET, POST, PUT, DELETE, etc.
        //       mode: 'cors', // no-cors, *cors, same-origin
        //       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //       credentials: 'same-origin', // include, *same-origin, omit
        //       headers: {
        //         'Content-Type': 'application/json'
        //         // 'Content-Type': 'application/x-www-form-urlencoded',
        //       },
        //       redirect: 'follow', // manual, *follow, error
        //       referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //       body: JSON.stringify(data) // body data type must match "Content-Type" header
        //     });
        //     return response.json(); // parses JSON response into native JavaScript objects
        // }
    }, []);
    // redux
    const count = useSelector(state => {
        return state.number.number
    });
    const list = useSelector(state => {
        return state.list
    });
    const dispatch = useDispatch();
    function onClick() {
        getList({type: "cat", amount: 4})
    }

    return <div>
        <h3>Fetch</h3>
        <h5>id: {catData.id}</h5>
        <img src={catData.url} className="cat-img"></img>
        <ul>
            {
                catListData.map((item) => {
                    return (<li key={item._id}>
                        {item.text}
                    </li>)
                })
            }
        </ul>
        <h3>Redux</h3>
        <p>
            <span>{count}</span>
            <button onClick={() => dispatch(reduce(count))}>-</button>
            <button onClick={() => dispatch(add(count))}>+</button>
        </p>
        <Button onClick={onClick}>onclick fetch</Button>
        <ul>
            {
                list.map((item) => {
                    return (<li key={item._id}>
                        {item.text}
                    </li>)
                })
            }
        </ul>
    </div>
}

export default App