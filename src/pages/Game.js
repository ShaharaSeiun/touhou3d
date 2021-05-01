import React, { Suspense, useMemo } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Stage1 } from '../stages/Stage1';
import { Scene } from 'react-babylonjs';
import { useWindowSize } from '../hooks/useWindowSize';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { ControlsContainer } from '../components/ControlsContainer';
import { BindControls } from '../babylon-components/BindControls';
import { GeneralContainer } from '../babylon-components/gameLogic/GeneralContainer';
import { Playground } from '../babylon-components/actors/Playground';
import { PlayerMovement } from '../babylon-components/actors/player/PlayerMovement';
import { PlayerCamera } from '../babylon-components/actors/player/PlayerCamera';
import { FightRoot } from '../babylon-components/actors/FightRoot';
import '../babylon-components/Shaders';
import Engine from '../babylon-components/Engine';
import { UI } from '../babylon-components/ui/UI';
import { globals, loadGlobals, resetGlobals, GlobalsContainer } from '../components/GlobalsContainer';
import { Player } from '../babylon-components/actors/player/characters/Player';

export const Game = () => {
    const windowSize = useWindowSize();
    useMemo(() => loadGlobals(), []);
    useMemo(() => resetGlobals(), []);

    return (
        <Engine width={windowSize.width} height={windowSize.height} antialias canvasId="babylonJS">
            <Scene clearColor={new Color3(0.1, 0.1, 0.2)} render>
                <GlobalsContainer>
                    <ControlsContainer>
                        <GeneralContainer>
                            <Suspense fallback={false}>
                                <BindControls />
                                <FightRoot>
                                    <UI
                                        charactersInDialogue={['reimu', 'wriggle']}
                                        activeCharacter={'reimu'}
                                        activeCharacterEmotion="neutral"
                                    />
                                    <Playground />
                                    <PlayerMovement>
                                        <Player character={globals.character} />
                                        <PlayerCamera />
                                    </PlayerMovement>
                                </FightRoot>
                                <Router>
                                    <Switch>
                                        <Route path="/game/stage1">
                                            <Stage1 />
                                        </Route>
                                    </Switch>
                                </Router>
                            </Suspense>
                        </GeneralContainer>
                    </ControlsContainer>
                </GlobalsContainer>
            </Scene>
        </Engine>
    );
};
