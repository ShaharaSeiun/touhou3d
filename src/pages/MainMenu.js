import { makeStyles } from '@material-ui/core/styles';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router';
import { VerticleMenu } from '../components/VerticleMenu';


const useStyles = makeStyles({
    titlePos1: {
        left: '40vw',
    },
    titlePos2: {
        left: '10vw',
    },
    title: {
        transition: 'left 1s',
        writingMode: 'vertical-rl',
        textOrientation: 'upright',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '20vw',
        height: '100vh',
        fontSize: '10vw',
    },
    title2: {
        writingMode: 'initial',
        fontSize: '10vw',
    },
    options: {
        position: 'absolute',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'left 2s',
        whiteSpace: 'nowrap',
    },
    optionsPos1: {
        left: '100vw',
    },
    optionsPos2: {
        left: '70vw',
    },
});

export const MainMenu = ({ active }) => {
    const classes = useStyles();
    const history = useHistory();

    const quit = () => {
        window.location.href = 'https://www.reddit.com/r/touhou';
    };

    const titleOptions = useMemo(
        () => ({
            Play: () => history.push('/menu/game/difficultySelect'),
            Option: () => history.push('/menu/options'),
            Score: () => history.push('/menu/game/score'),
            Controls: () => history.push('/menu/controls'),
            Quit: quit,
        }),
        [history]
    );


    return <VerticleMenu menuMap={titleOptions} slanted={active} active={active} />
};
