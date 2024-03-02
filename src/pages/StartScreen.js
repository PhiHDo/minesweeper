import React from "react";
import DifficultyToggle from './pages/Board';
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";


const StartScreen = props => {
    // const {startGame} = props;

    return (
        <Box>
            <Typography variant="h1">Select Difficulty</Typography>
            <DifficultyToggle/>
        </Box>
    );
};

export default StartScreen;