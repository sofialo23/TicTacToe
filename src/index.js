
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {

    return (
      <button 
        className="square" 
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i, pos) {
    return (
        <Square 
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i,pos)}
        />
      ); 
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, "0,0")}
          {this.renderSquare(1, "0,1")}
          {this.renderSquare(2, "0,2")}
        </div>
        <div className="board-row">
          {this.renderSquare(3, "1,0")}
          {this.renderSquare(4, "1,1")}
          {this.renderSquare(5, "1,2")}
        </div>
        <div className="board-row">
          {this.renderSquare(6, "2,0")}
          {this.renderSquare(7, "2,1")}
          {this.renderSquare(8, "2,2")}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      position: [],
    };
  }

   handleClick(i, pos){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares:squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      position: this.state.position.concat(pos),
    });
   
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      position: this.state.position.slice(0, step),
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const position = this.state.position;
     console.log(position);
    const moves = history.map((step, move) => {
      //step is the current array element
      //move is the index

      if(move <= this.state.stepNumber){
        let desc = '';
        if(!move){
          desc = 'Go to game start';
        }
        else if(position[move-1]){
          desc = 'Go to move # ' + move + " " + "(" + position[move-1] + ")";
        }

        return(
          <li key={move}>
            <button className="movesBtn" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      }
      
      /*
      const desc = move ? 
      'Go to move # ' + move + " " + "(" + position[move-1] + ")" :
      'Go to game start';
*/
     
    })


    let status;

    if(winner){
      status = "Winner " + winner;
    }
    else{
      status = "Next Player: " + (this.state.xIsNext ? 'X' : '0');
    }
    return (
      <div className = "container">
      <div className="title">
        <p>Let's play Tic Tac Toe</p>
      </div>
      <div className="game">
      
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i ,pos) => this.handleClick(i, pos)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


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
      return squares[a];
    }
  }
  return null;
}