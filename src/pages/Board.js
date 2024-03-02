import React, {Fragment, useEffect, useState} from "react";
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import Box from "@mui/material/Box"
import sizes from '../utils/sizes'
import {Button, Grid, Stack} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

//code given by Dr. Kooshesh to render board, I tweaked it a bit to get a grid from connect 4
const initBoard = (numMines) => 
{
    // returns the internal representation of the board.
    const board = new Array(sizes.num_rows).fill(null).map(() => new Array(sizes.num_columns).fill({
        backgroundColor: 'lightgrey',
        hasMine: false,
        mineRevealed: false,
        value: 0,
        hidden: true,
        flag: false,
    }));

    //if not bomb then check neighbors
    // if neighbor is a bomb then increment

    //placing mines on board
    let minesPlaced = 0;
    while (minesPlaced < numMines) 
    {
        const mineRow = Math.floor(Math.random() * sizes.num_rows);
        const mineCol = Math.floor(Math.random() * sizes.num_columns);

        //check for neighboring mines
        if (!board[mineRow][mineCol].hasMine)
        {
            board[mineRow][mineCol] = {
                ...board[mineRow][mineCol],
                hasMine: true,
                // mineRevealed: true,
                backgroundColor: 'lightgrey',
            };
            //before
            // board[mineRow][mineCol] = true;
            // board[mineRow][mineCol].backgroundColor = 'grey';
            minesPlaced++;
        }
    }

    //checking for neighboring mines
    for (let rowIdx = 0; rowIdx < sizes.num_rows; rowIdx++) {
        for (let colIdx = 0; colIdx < sizes.num_columns; colIdx++) {
            if (!board[rowIdx][colIdx].hasMine) {
                const neighbors = findNeighborMine(board, rowIdx, colIdx);
                board[rowIdx][colIdx] = { value: neighbors, hidden: true, backgroundColor: 'lightgrey' };
            }
        }
    }    

    return board;
};

// in each cell, check 8 neighboring cells for mines
const findNeighborMine = (currBoard, rowIdx, colIdx) => {
    let neighbors = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const cellRowNeighbor = rowIdx + i;
            const cellColNeighbor = colIdx + j;
            if (cellRowNeighbor >= 0 && cellRowNeighbor < sizes.num_rows && cellColNeighbor >= 0 && cellColNeighbor < sizes.num_columns) {
                if (currBoard[cellRowNeighbor][cellColNeighbor].hasMine) {
                    neighbors++;
                }
            }
        }
    }
    return neighbors;
};

const Cell = props => {

    const {cellContent, onClickCallback} = props;

    const displayValue = () => {
        if(!cellContent.hidden && cellContent.hasMine){
            return <SentimentVeryDissatisfiedOutlinedIcon/>;
        }
        if (!cellContent.hidden)
        {
            return cellContent.value;
        }
        if(cellContent.flag)
        {
            return <EmojiFlagsIcon/>;
        }

        return null;
    }

    return (
        <Box onClick={() => onClickCallback() }
            sx={{
                width: sizes.cell_width,
                height: sizes.cell_height,
                border: 0.5,
                backgroundColor: cellContent.backgroundColor,
                // borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: '32px',
                fontFamily: 'Courier New, monospace',
            }}
        >
            {/* {cellContent.hidden ? null : cellContent.value} */}
            {displayValue()}
        </Box>
    )
}

const Row = props => {

    const {row, onClickCallback} = props;

    return (
        <Fragment>
            <Grid container columns={sizes.num_columns}>
                {
                    row.map((cellContent, colIdx) => {
                        return <Grid item xs={1} key={colIdx}>
                            <Cell cellContent={cellContent} onClickCallback={() => onClickCallback(colIdx)} />
                        </Grid>
                    })
                }
            </Grid>
        </Fragment>
    )
}

const DifficultyToggle = props => {
    
    // const {difficulty, setDifficulty} = props;
    const [difficulty, setDifficulty] = useState("Standard");

    const handleChange = (event, newDifficulty) => {
        if(newDifficulty === "Standard")
        {
            setDifficulty(newDifficulty);
            sizes.num_rows = 8;
            sizes.num_columns = 8;
            sizes.mines = 10;
            sizes.cell_width = 60;
            sizes.cell_height = 60;
        }
        else if(newDifficulty === "Hard")
        {
            setDifficulty(newDifficulty);
            sizes.num_rows = 12;
            sizes.num_columns = 12;
            sizes.mines = 25;
            sizes.cell_width = 40;
            sizes.cell_height = 40;
        }
    }
    return(
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            m: 1,
        }}>
            <ToggleButtonGroup
                color="primary"
                value={difficulty}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
            >
                <ToggleButton value={"Standard"} /*onClick={() => {window.location.reload(false)}}*/>Standard</ToggleButton>
                <ToggleButton value={"Hard"} /*onClick={() => {window.location.reload(false)}}*/>Hard</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}



const Board = props => {

    //added this
    const numMines = sizes.mines;

    const width = () => sizes.num_columns * sizes.cell_width +
    (sizes.num_columns - 1) * sizes.h_gap;
    const height = () => sizes.num_rows * sizes.cell_height +
    (sizes.num_rows - 1) * sizes.v_gap;

    const [board, setBoard] = useState(initBoard(numMines)); 
    const [button, setButton] = useState(null);
    const [timer, setTimer] = useState(0);
    const [gameOver, setGameover] = useState(false);
    const [message, setMessage] = useState(""); 
    const [flag, setFlag] = useState(false);
    
    //added this
    useEffect(() => {
        setBoard(initBoard(numMines));
    }, [numMines]);

    //timer
    useEffect(() => {
        let seconds;
        if(!gameOver){
            seconds = setInterval(() => {
                setTimer((timer) => timer + 1);
            }, 1000);
        }
            return () => clearInterval(seconds);
    }, [gameOver]);

    //win condition
    useEffect(() => {
        const mines = board.flat().filter(cell => cell.backgroundColor === 'red').length; //#revealed mines
        const unreavealedTiles = board.flat().filter(cell => !cell.hidden).length;
        const totalCells = sizes.num_rows * sizes.num_columns;

        //no mines are unveild and all nonmines are veild
        if (mines === 0 && unreavealedTiles === totalCells - numMines) {
            setGameover(true);
            setMessage("You win!");
        }
    }, [board, numMines]);

    const onClickCallback = (rowIdx, colIdx) => {
        // console.log(`rowIdx = ${rowIdx}, colIdx = ${colIdx}`);

        //prevent click when gameover is true
        if(gameOver){
            return;
        }

        const newBoard = board.slice();
        const affectedRow = board[rowIdx].slice();

        //logic for setting flags on board
        //is board in flag mode?
        //if it is => flag? set flag to true
        //else return
        if(flag && affectedRow[colIdx].hidden) //in flag mode
        {
            affectedRow[colIdx] = {
                ...affectedRow[colIdx],
                flag: !affectedRow[colIdx].flag,
            }
            newBoard[rowIdx] = affectedRow;
            setBoard(newBoard);
            return;
        }
        if(affectedRow[colIdx].flag)
        {
            return;
        }

        if(!affectedRow[colIdx].hidden)
        {
            return; 
        }

        //reveals tiles with values
        affectedRow[colIdx] = {
            ...affectedRow[colIdx],
            hidden: !affectedRow[colIdx].hidden
        };

        //mine tiles
        if(affectedRow[colIdx].hasMine){
            console.log("mine");
            affectedRow[colIdx] = {
                // mineRevealed: true,
                ...affectedRow[colIdx],
                backgroundColor: 'red',
                hidden: false
                // stop timer, record game history to table
            }
            setGameover(true);
            setMessage("Gameover, you lost!");
        }
        else //reveals non-mine tiles
        {
            affectedRow[colIdx] = {
                ...affectedRow[colIdx],
                backgroundColor: 'white',
            };
        }
        newBoard[rowIdx] = affectedRow;
        setBoard(newBoard);
    }    

    const handleChange = (buttonPressed) => {
        //done
        if(buttonPressed === "flag_button")
        {
            setButton(buttonPressed);
            // console.log("flag");
            setFlag(!flag);
            return;
        }
        
        //done
        if(buttonPressed === "bomb_button")
        {
            setButton(buttonPressed);
            // console.log("bomb/mine");
            revealMines();
            setGameover(true);
        }

        //done
        if(buttonPressed === "reveal_button")
        {
            setButton(buttonPressed);
            // console.log("reveal");
            revealTiles();
            setGameover(true);
        }

        if(buttonPressed === "reset_button")
        {
            setButton(buttonPressed);
            // console.log("reset");
            setBoard(initBoard(numMines));
            setTimer(0);
            setGameover(false);
            setMessage("");
            setFlag(false);
            setButton(null);
        }
    }

    //helper function to reveal all the mines on the board for bomb button
    const revealMines = () => {
        const tempBoard = board.map(row =>
            row.map(cell => {
                if (cell.hasMine) {
                    return {
                        ...cell,
                        hidden: false, // Set hidden to false to reveal the mine
                        backgroundColor: 'red',
                    };
                }
                return cell;
            })
        );
        setBoard(tempBoard);
    }

    const revealTiles = () => {
        const tempBoard = board.map(row =>
            row.map(cell => {
                if (cell.hasMine) {
                    return {
                        ...cell,
                        hidden: false, // Set hidden to false to reveal the mine
                        backgroundColor: 'red',
                    };
                    
                }
                else{ //anything that is not a mine
                    return {
                        ...cell,
                        hidden: false, // Set hidden to false to reveal the mine
                        backgroundColor: 'white',
                    };
                } 
            })
        );
        setBoard(tempBoard);
    }

    return (
        <Fragment>

            <DifficultyToggle/>

            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", fontSize: '32px'}}>
                Timer: {timer} Seconds
            </Box>

            <Box
                margin="auto"
                sx={{
                m: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Stack spacing={2} direction="row">
                    <Button value={button} variant="outlined" onClick={() => handleChange("flag_button")}>🚩</Button>
                    <Button value={button} variant="outlined" onClick={() => handleChange("bomb_button")}>💣</Button>
                    <Button value={button} variant="contained" onClick={() => handleChange("reveal_button")}>Reveal All</Button>
                    <Button value={button} variant="contained" color="error" onClick={() => handleChange("reset_button")}>Reset Board</Button>
                </Stack>
            </Box>

            <Box  
                margin="auto"
                sx={{
                width: width(),
                height: height(),
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>            
                <Grid container columns={1}
                      sx={{
                        width: width(),
                        height: height()
                      }}
                >
                    {
                        board.map((row, rowIdx) =>
                            <Grid item key={rowIdx} xs={1}>
                                <Row row={row} onClickCallback={(colIdx) => onClickCallback(rowIdx, colIdx)} />
                            </Grid>
                        )
                    }
                </Grid>
            </Box>
            <Box
             sx={{
                width: "100%",
                height: "100%",
                mt: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "orange",
                fontSize: "24px",
            }}>
                {message}
            </Box>
        </Fragment>
    );

};

export default Board;