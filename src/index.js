
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
 const winningSquareStyle = {
    backgroundColor: '#85ff85'
  };
    return (
      <button 
        className="square" 
        onClick={props.onClick}
        style={props.winningSquare === true ? winningSquareStyle : null}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i, pos) {
    let winningSquare = false;
    const allwinningSquare = this.props.winner;
    if(allwinningSquare != null){
      for(let j = 0; j < 8; j++){
        if (allwinningSquare[j] === i){
          winningSquare =true;
          break;
        }
      } 
    }

    return (
        <Square winningSquare = {winningSquare}
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i,pos)}
        />
      ); 
  }

  createBoard = () => {
    let rows = [];
    let counter = 0;
    for(let i = 0; i < 3; i++){ // Outer loop to create parent
      let children = [];
      for(let j = 0; j < 3; j++){ // Inner loop to create children
        let position = i.toString() + "," + j.toString();
        children.push(this.renderSquare(counter++, position));
      }
      //Create the parent and add the children
      rows.push(<div className="board-row">{children}</div>);
    }
    return rows;
  }

  render() {
    return (
        <div>
          {this.createBoard()}
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
      ascending: true,
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
      ascending: this.state.ascending,
    })
  }

  handleToggle(){
    this.setState({
      ascending: !this.state.ascending,
    });
  }

  render() {
    const active = {"fontWeight": "bold"};
    const inactive = {"fontWeight": "normal"}
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const position = this.state.position;
    let value = this.state.stepNumber;
    const moves = history.map((step, move) => {
      //step is the current array element
      //move is the index
    
      if(this.state.ascending === false){
        let sendValue = value;
        console.log("Value is : " + value); 
        let desc = '';
        if(value === 0){
          desc = 'Go to game start';
        }
        else if(position[value-1]){
          desc = 'Go to move # ' + value + " " + "(" + position[value-1] + ")";
        }
        value--;
        console.log("Value second time is : " + value);
       let styling = (value + 1) === this.state.stepNumber? active: inactive;
        if(desc !== '')
          return(
            <li className= "stepsButtons" key={sendValue}>
              <button className="movesBtn" style = {styling} onClick={() => this.jumpTo(sendValue )}>{desc}</button>
            </li>
          )
      } // end of ascending check

      else{
         if(move <= this.state.stepNumber){
        let desc = '';
        if(!move){
          desc = 'Go to game start';
        }
        else if(position[move-1]){
          desc = 'Go to move # ' + move + " " + "(" + position[move-1] + ")";
        }

       let styling = move === this.state.stepNumber? active: inactive;
        return(
          <li className= "stepsButtons" key={move}>
            <button className="movesBtn" style = {styling} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      }
      } // end of else
     
      }) // end of moves map


    let status;

    if(winner){
      status = "Winner " + winner[0]; // to only show X or O and not the winningn indexes
    }
    else{
      status = 'Next Player: "' + (this.state.xIsNext ? 'X' : '0') + '"';
    }
    return (
      <div className = "container">
      <div className="title">
        <p>Let's play Tic Tac Toe</p>
      </div>
      <div className="game">
      
        <div className="game-board">
          <Board
            winner = {winner}
            squares = {current.squares}
            onClick = {(i ,pos) => this.handleClick(i, pos)} 
          />
        </div>
        <div className="game-info">
          <div id="status">{status}</div>
          <div>
            <button className = "toggleButton" onClick= {() => this.handleToggle()} >Change order</button>
          </div>
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
      let valuetoReturn = [squares[a], a, b, c];
      return valuetoReturn;
    }
  }
  return null;
}