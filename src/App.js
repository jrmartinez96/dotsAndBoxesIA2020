import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';
import io from 'socket.io-client';
import { alphaBeta, problemaTotitoChino } from './lib/alphabeta';

class App extends Component {

    constructor(props) {
        super();
        this.state = {
            socket: {},
            tournament_id: '123456',
            username: 'JoseMartinez',
            game_id: 0,
            movementNumber: 0,
            player_turn_id: 0,
            board: {
                h: [99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99],
                v: [99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99]
            }
        }
    }

    componentDidMount() {
        // console.log(alphaBeta(problemaTotitoChino, this.state.board));
    }
    // http://3.12.129.126:5000
    connect = () => {
        const socket = io('http://localhost:4000');
        this.setState({socket});

        socket.on('connect', () => {
            console.log('on connect');
            // Sign in signal
            socket.emit('signin', {
              user_name: this.state.username,
              tournament_id: this.state.tournament_id,
              user_role: 'player'
            });
        })

        socket.on('ready', (data) => {
            // console.log('ready', {data})
            const board = {
                h: data.board[0],
                v: data.board[1]
            }
            this.setState({
                game_id: data.game_id,
                movementNumber: data.movementNumber,
                player_turn_id: data.player_turn_id,
                board
            })

            this.onPlay(board);
          });

        socket.on('finish', (data) => {

            console.log('finish', {data});
            this.setState({
                board: {
                    h: data.board[0],
                    v: data.board[1]
                }
            })
            this.onReady();
          });
    }

    onPlay = (board) => {
        const {socket} = this.state;

        // movimiento random
        // let lineType = Math.floor(Math.random() * 2);
        // let lineNumber = 0;
        // const lineTypeName = lineType ? 'v' : 'h';

        // let possibleMoves = [];

        // for (let i = 0; i < board[lineTypeName].length; i++) {
        //     const position = board[lineTypeName][i];
        //     if (position === 99) {
        //         possibleMoves.push(i);
        //     }
        // }

        // const randLineNumberIndex = Math.floor(Math.random() * possibleMoves.length);
        // lineNumber = possibleMoves[randLineNumberIndex];

        const movimiento = alphaBeta(problemaTotitoChino, this.state.board);

        socket.emit('play', {
            tournament_id: this.state.tournament_id,
            player_turn_id: this.state.player_turn_id,
            game_id: this.state.game_id,
            movement: movimiento
        });
    }

    onReady = () => {
        const { socket } = this.state;

        socket.emit('player_ready', {
            tournament_id: this.state.tournament_id,
            game_id: this.state.game_id,
            player_turn_id: this.state.player_turn_id
        });
    }

    render() {

        return (
            <div className="App">
                <div className="input-container">
                    <input value={this.state.username} onChange={(e)=>this.setState({username: e.target.value})}></input>
                    <button onClick={this.connect}>Connect</button>
                    <button onClick={this.onReady}>Ready</button>
                </div>
                <div className={`circle-turn bkg-${this.state.player_turn_id === 1 ? 'blue' : 'red'}`}></div>
                <Board board={this.state.board}/>
            </div>
        )
    }
}

export default App;
