import React, { Fragment } from "react";
import Box from "@mui/material/Box";

import TopBanner from "./pages/TopBanner";
import Board from "./pages/Board";

function App() {
    return (
        <Fragment>
            <Box>
                <TopBanner title="Minesweeper" />
                <Board />
            </Box>
        </Fragment>
    );
}

export default App;
