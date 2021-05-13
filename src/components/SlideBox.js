import { Box, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
    options: {
        position: 'absolute',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'left 2s',
        whiteSpace: 'nowrap',
        flexDirection: 'column'
    },
    optionsPos1: {
        left: '115vw',
    },
    optionsPos2: {
        left: '70vw',
    },
    optionsPos3: {
        left: '40vw',
    },
});

export const SlideBox = ({ children, active, wide }) => {
    const classes = useStyles();
    const optionsPos = active ? (wide ? classes.optionsPos3 : classes.optionsPos2) : classes.optionsPos1;

    return (
        <Box className={classes.options + ' ' + optionsPos}>
            {children}
        </Box>
    )
}
