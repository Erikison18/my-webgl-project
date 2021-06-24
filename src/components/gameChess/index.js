import React from 'react';
import './index.css';

// class Square extends React.Component {
//     render() {
//         return (
//             <button 
//                 className="square" 
//                 onClick={() => this.props.onClick()}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }
function Square(props) {
    return (
        <button className={`square ${props.isActive?"active":""}`} onClick={props.onClick}>
            {props.value}
        </button>
    )
}
  
class Board extends React.Component {
    renderSquare(i) {
        let isActive = false;
        for (let index = 0; index < this.props.winnerLine.length; index++) {
            const el = this.props.winnerLine[index];
            if (el === i) {
                isActive = true
            }
        }
        
        return (<Square 
            key={i}
            isActive={isActive}
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
        />);
    }

    render() {
        return (
        <div>
            {
                [0 ,1 ,2].map((item, i) => {
                    return (<div className="board-row" key={i}>
                        {
                            [0, 1, 2].map((li, j) => {
                                return this.renderSquare(j * 3 + i)
                            })
                        }
                    </div>)
                })
            }
            {/* <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div> */}
        </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                step: 0,
                xAxis: null,
                yAxis: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            activeNumber: -1,
            isAscend: true,
        };
    }

    handleOrderChange() {
        const isAscend = this.state.isAscend;
        const history = this.state.history;
        this.setState({
            isAscend: !isAscend,
            history: history.reverse(),
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            activeNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "x" : "o";
        console.log(this.state.history, this.state.stepNumber)
        this.setState({
            history: history.concat([{
                squares: squares,
                step: history.length,
                xAxis: parseInt(i / 3) + 1,
                yAxis: parseInt(i % 3) + 1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = `Winner: ${winner.winner}`;
        } else if(history.length === 10){
            status = `No Winner`;
        } else {
            status = `Next player: ${this.state.xIsNext?"x":"o"}`;
        }

        const moves = history.map((step, move) => {
            let desc;
            if (step.step === 0) {
                desc = "Go to game start";
            } else {
                desc = `Go To Move #${step.step}——-(${step.xAxis},${step.yAxis})`;
            }
            return (<li key={move} onClick={()=> this.jumpTo(move)} className={`${move===this.state.activeNumber?"history-selected":""}`}>
                {desc}
            </li>)
        });
        console.log(winner);

        return (
        <div className="game">
            <div className="game-board">
            <Board 
                winnerLine={winner?winner.frontline:[]}
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            <button onClick={() => this.handleOrderChange()}>{this.state.isAscend?"降序":"升序"}</button>
            </div>
        </div>
        );
    }
}

export default Game

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
            winner: squares[a],
            frontline: lines[i],
        };
      }
    }
    return null;
}