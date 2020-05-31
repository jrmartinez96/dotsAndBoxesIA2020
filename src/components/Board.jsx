import React, { Component } from 'react';
import './board.css';

class Board extends Component {

    constructor(props) {
        super();
    }

    getBoard = (dimmensions, values) => {
        
        let board = [];
        const h_values = values.h;
        const v_values = values.v;
        
        for (let i = 0; i < dimmensions[0] - 1; i++) {
            let row = [];
            for (let j = 0; j < dimmensions[1] - 1; j++) {
                const h_top_id = 6 * j + i;
                const h_bottom_id = 6 * j + (i + 1);
                const v_left_id = 6 * i + j;
                const v_right_id = 6 * i + (j + 1);

                let bkg = 'white';
                if (Math.abs(h_values[h_top_id]) === 2 || Math.abs(h_values[h_bottom_id]) === 2 || Math.abs(v_values[v_left_id]) === 2 || Math.abs(v_values[v_right_id]) === 2) {
                    if (h_values[h_top_id] === 2 || h_values[h_bottom_id] === 2 || v_values[v_left_id] === 2 || v_values[v_right_id] === 2) {
                        bkg = 'blue';
                    }
    
                    if (h_values[h_top_id] === -2 || h_values[h_bottom_id] === -2 || v_values[v_left_id] === -2 || v_values[v_right_id] === -2) {
                        bkg = 'red';
                    }
                }

                if (Math.abs(h_values[h_top_id]) === 1 || Math.abs(h_values[h_bottom_id]) === 1 || Math.abs(v_values[v_left_id]) === 1 || Math.abs(v_values[v_right_id]) === 1) {
                    if (h_values[h_top_id] === 1 || h_values[h_bottom_id] === 1 || v_values[v_left_id] === 1 || v_values[v_right_id] === 1) {
                        if (h_values[h_top_id] !== -1 && h_values[h_bottom_id] !== -1 && v_values[v_left_id] !== -1 && v_values[v_right_id] !== -1) {
                            bkg = 'blue';
                        }
                    }

                    if (h_values[h_top_id] === -1 || h_values[h_bottom_id] === -1 || v_values[v_left_id] === -1 || v_values[v_right_id] === -1) {
                        if (h_values[h_top_id] !== 1 && h_values[h_bottom_id] !== 1 && v_values[v_left_id] !== 1 && v_values[v_right_id] !== 1) {
                            bkg = 'red';
                        }
                    }
                }

                row.push(
                    <div key={`${i}${j}`} className={`box t${h_values[h_top_id]} b${h_values[h_bottom_id]} l${v_values[v_left_id]} r${v_values[v_right_id]} bkg-${bkg}`}>
                        <div className="circle top-left"></div>
                        <div className="circle top-right"></div>
                        <div className="circle bottom-left"></div>
                        <div className="circle bottom-right"></div>
                    </div>
                )
            }
            board.push(
                <div key={i} className="row-container">
                    {row}
                </div>
            )
        }

        return (board)
    }
    
    render() {

        const { board } = this.props;

        const dimmensions = [6,6];
        return (
            <div>
                {this.getBoard(dimmensions, board)}
            </div>
        );
    }
}

export default Board;
