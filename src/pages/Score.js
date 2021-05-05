import { Box, withStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from "@material-ui/core/TableCell";
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useBack } from '../hooks/useBack';
import { useKeydownMenu } from '../hooks/useKeydown';
import { useLS } from '../hooks/useLS';
import { useNewScores } from '../hooks/useNewScores';

const TableCell = withStyles({
    root: {
        borderBottom: "none"
    }
})(MuiTableCell);

export const Score = () => {

    const [newName, setNewName] = useState("");
    const newScores = useNewScores(newName, setNewName);

    const ls = useLS()
    useBack('/menu', () => {
        ls("NEW_SCORE", 0)
    });


    const history = useHistory();
    useKeydownMenu("ENTER", () => {
        const scoresToSave = newScores.map(score => {
            if (typeof score.name === 'string') {
                return score
            }
            else {
                return {
                    name: newName,
                    score: score.score
                }
            }
        })
        ls("HIGH_SCORES", scoresToSave);
        ls("NEW_SCORE", 0);
        history.push("/")
    })

    return <Box>
        <span style={{ fontSize: "8vh" }}>
            High Scores
        </span>
        <Table style={{ width: "max(40vw, 60vh)" }}>
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {newScores.map((score, i) => {
                    return <TableRow key={i}>
                        <TableCell component="th" scope="row">
                            {score.name}
                        </TableCell>
                        <TableCell align="right">{score.score}</TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </Box>
};
