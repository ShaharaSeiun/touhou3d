import { Box, withStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from "@material-ui/core/TableCell";
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { StatsContext } from '../components/StatsContainer';
import { useBack } from '../hooks/useBack';
import { useKeydownMenu } from '../hooks/useKeydown';


const TableCell = withStyles({
    root: {
        borderBottom: "none"
    }
})(MuiTableCell);

export const Stats = () => {
    useBack('/menu');
    const history = useHistory();
    useKeydownMenu("ENTER", () => {
        history.push("/")
    })
    const { loadedStats, loadStats } = useContext(StatsContext)

    useEffect(() => {
        loadStats();
    }, [loadStats])


    return <Box>
        <span style={{ fontSize: "8vh" }}>
            Your Stats
        </span>
        <Table style={{ width: "80vh" }}>
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.keys(loadedStats).map(key => {
                    const stat = loadedStats[key];
                    return <TableRow key={key}>
                        <TableCell component="th" scope="row">
                            {key}
                        </TableCell>
                        <TableCell align="right">{stat}</TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </Box>
};
