import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { ControlsContext } from '../components/ControlsContainer';
import BackgroundImage from '../img/menu_bamboo.jpg';
import Music from '../sounds/Music';
import { NeedsToClick } from '../utils/NeedsToClick';
import { CharacterSelect } from './CharacterSelect';
import { Controls } from './Controls';
import { DifficultySelect } from './DifficultySelect';
import { MainMenu } from './MainMenu';
import { Options } from './Options';
import { Score } from './Score';
import { Stats } from './Stats';


const useStyles = makeStyles({
    container: {
        background: `url(${BackgroundImage})`,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export const Menu = () => {
    useEffect(() => {
        Music.play('menuTheme');
    }, []);

    const classes = useStyles();

    const { keyUpHandler, keyDownHandler } = useContext(ControlsContext);
    const [handlerDiv, setHandlerDiv] = useState();
    useEffect(() => {
        if (!handlerDiv) return;
        handlerDiv.focus();
    })

    return (
        <Box
            ref={(newRef) => setHandlerDiv(newRef)}
            onKeyUp={keyUpHandler}
            onKeyDown={keyDownHandler}
            onPointerUp={keyUpHandler}
            onPointerDown={keyDownHandler}
            className={classes.container}
            tabIndex={0}
        >
            <NeedsToClick />
            <Route exact path="/">
                <MainMenu />
            </Route>
            <Route exact path="/menu">
                <MainMenu menuOpenInit />
            </Route>
            <Route exact path="/menu/options">
                <Options />
            </Route>
            <Route exact path="/menu/controls">
                <Controls />
            </Route>
            <Route exact path="/menu/game/difficultySelect">
                <DifficultySelect next={'/menu/game/characterSelect'} />
            </Route>
            <Route exact path="/menu/game/characterSelect">
                <CharacterSelect back={'/menu/game/difficultySelect'} next={'/game/stage1'} />
            </Route>
            <Route exact path="/menu/game/stats">
                <Stats />
            </Route>
            <Route exact path="/menu/game/score">
                <Score />
            </Route>

        </Box>
    );
};
