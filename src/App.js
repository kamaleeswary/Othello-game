import React, { Component } from 'react';
import './App.css';

class Box extends Component {
 
  // This Function cals the Square Component for making Button for each squares(this function called by renderRow())
  renderSquare(i) {
    return <Square key={'square' + i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  //Creating Coloumn for each Row (This function is called by renderRows())
  renderRow(r) {
    var row = [];
    for (var i = 0; i < 8; i++) {
      row.push(this.renderSquare(r * 8 + i));
    }
    return (
      <div key={'row' + r}>
        {row}
      </div>
    );
  }

  //Creating the rows (called by render())
  renderRows() {
    var rows = [];
    for (var i = 0; i < 8; i++) {
      rows.push(this.renderRow(i));
    }
    return (
      <div>
        {rows}
      </div>
    );
  }

  //Creates the layout of each Squares
  render() {
    return (
      <div>
        {this.renderRows()}
      </div>
    );
  }
}

    // class Component 
class Othello extends Component {
  //Constructor for the class
  constructor() {
    super();
    const squares = Array(64).fill(null);
    squares[27] = squares[36] = 'O';
    squares[28] = squares[35] = 'X';
    //Setting up the state
    this.state = {
      squares: squares,
      xIsNext: true,
      stepNumber: 0,
    };
  }

        //handle click event for performing the logic (This is Called by onclick   )
  handleClick(i) {
    console.log("this is hadle click")

    const squares = this.state.squares.slice();
//checking the box are filled are not
    if (this.state.stepNumber >= 60 || squares[i])
      return;

//fetching the position for opposite value for change that into the current value 
    var isCalculatePosition = this.calculatePosition(i);
    console.log("pos " + isCalculatePosition)

//checking the index holds null value
    if (isCalculatePosition === 0)
      return;

//Getting the current position for changing the fetched index
    var current = this.state.xIsNext ? 'X' : 'O';
    console.log("current :" + current);
//Function changing the values
    isCalculatePosition.forEach(function (square) {
      console.log("current :" + current)
      squares[square] = current;
      // console.log("square :"+squares)
    });

    squares[i] = current;//place the current player to the onclicked index
    //setting up the state for next player
    this.setState({
      squares: squares,
      stepNumber: this.state.stepNumber + 1,
      xIsNext: !this.state.xIsNext
    })

  }
  //checking the nearest eqaul values either X or O
  calculatePosition(i) {
    var position = Array(0);
    for (var x = -1; x < 2; x++) {
      for (var y = -1; y < 2; y++) {
        if (x !== 0 || y !== 0) {
          position = position.concat(this.concatXY(i, x, y));//
        }
      }
    }
    return position;

  }

  //
  concatXY(i, xVal, yVal) {
    var position = [];
    const squares = this.state.squares.slice();
    var foundVal = false;
    var current = this.state.xIsNext ? 'X' : 'O';
    var x = getX(i) + xVal, y = getY(i) + yVal;
    while (!foundVal && x >= 0 && x < 8 && y >= 0 && y < 8) {
      //Checking the index have null value ,if true then it returns nothing
      if (!squares[get(x, y)]) {
        return []
      }
      //Checking Square of index and current value is are same or not
      else if (squares[get(x, y)] === current) {
        console.log("curr : ", current, " get(x,y) : ", get(x, y), " squares : ", squares[get(x, y)], " x: " + x + " y : " + y)
        foundVal = true;
      }
      //if the value is not null and also it is not equal to current value then it eqauls to the opposite value so push this value to position array for change this to an current value and increment x and y value for checking the boundry
      else {
        position.push(get(x, y))
        console.log("position array : ", position, " else : " + get(x, y) + " x : " + x + " y : " + y)
        x += xVal;
        y += yVal;
        console.log("position array : ", position, " else : " + get(x, y) + " x : " + x + " y : " + y)
      }
    } 
    console.log("x : ", x, " y :", y)
    //if found value is true then it send the position arry to the calculatePosition()
    if (foundVal)
      return position;
    return [];

  }
  passTurn() {
    if (this.state.stepNumber > 59)
      return;
    this.setState({ xIsNext: !this.state.xIsNext });
  }
  //
  render() {
    const squares = this.state.squares;
    const score = calcScore(this.state.squares);
    const winner = calcWinner(score);
    const displayScore = 'X :' + score.x + ' | O :' + score.o;
    let status;

    if (winner)
      status = <h1>Winner : {winner}</h1>
    else
      status = 'Next Player :' + (this.state.xIsNext ? 'X' : 'O')

    return (
      <fragment>
      <div className="game" key={'box'}>
        <div className="game-board" key={'box-board'}>
          <Box squares={squares}  onClick={(i) => this.handleClick(i)} />
        </div></div>
        <div id="text">
          <div className="game-info" key={'box-info'}><p id="para">{displayScore}</p></div>
          <div id="status"><p>{status}</p></div>
          <button className="btn btn-primary btn-lg" id="btn" onClick={() => this.passTurn()}>Pass</button>
        </div>
      
      </fragment>
    );
  }
}
//This function is called by render for calculate the score of each person
function calcScore(squares) {
  var x = 0, o = 0;
  squares.forEach(function (squares) {
    if ('X' === squares)
      x++;
    else if ('O' === squares)
      o++
  }); return { x: x, o: o }
}
//This function is called by render for calculate who is the winner of the game
function calcWinner(score) {
  if (score.x + score.o === 64)
    return score.x > score.o ? 'X' : 'O'
  return null

}
//This function component is called by Box component of renderSquare function
function Square(props) {
  console.log("props "+props.xIsNext)
   return (
      <button style={{backgroundColor: props.value === 'X' ? 'green' : null}} id="y" className="square" onClick={() => props.onClick()}>
        {props.value}
      </button>
    );
}
//Called by concatXY() for getting the x and y value based on onclicked index
function getX(i) {
  console.log("i", i)
  return i % 8
}
function getY(i) {
  return parseInt(i / 8)
}
function get(x, y) {
  return y * 8 + x
}
export default Othello;
