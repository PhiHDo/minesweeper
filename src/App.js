import React, { Fragment, useState } from "react";
import Box from "@mui/material/Box";

import TopBanner from "./pages/TopBanner";
import Board from "./pages/Board";
import StatsTable from "./pages/StatsTable";
import sizes from "./utils/sizes";

function App() {

    //for stats table
    const [gameSize, setGameSize] = useState(sizes.num_rows);
    const [numMines, setNumMines] = useState(sizes.mines);
    const [updateCellWidth, setUpdateCellWidth] = useState(sizes.cell_width);
    const [updateCellHeight, setUpdateCellHeight] = useState(sizes.cell_height);

    return (
        <Fragment>
            <Box>
                <TopBanner
                    title="Minesweeper"
                />
                <Board/>
            </Box>
        </Fragment>
    );
}

export default App;
