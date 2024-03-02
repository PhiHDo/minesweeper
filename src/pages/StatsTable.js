import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Board from './Board';
import sizes from '../utils/sizes';

const sizeString = `${sizes.num_rows} x ${Board.num_columns}`;

function createData(size, timeSeconds, outcome) {
  return { size, timeSeconds, outcome };
}

let size = sizeString;
let timeSeconds = "0";
let outcome = "Null";

const rows = [
  createData(size, timeSeconds, outcome),
];

export default function GameAttributesTable() {
  return (
    <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <TableContainer component={Paper}>
        <Table sx={{ width: 300 }} aria-label="game attributes table">
            <TableHead>
            <TableRow>
                <TableCell>Size</TableCell>
                <TableCell align="right">Time (seconds)</TableCell>
                <TableCell align="right">Outcome</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow key={row.size}>
                <TableCell component="th" scope="row">
                    {row.size}
                </TableCell>
                <TableCell align="right">{row.timeSeconds}</TableCell>
                <TableCell align="right">{row.outcome}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </div>
  );
}
