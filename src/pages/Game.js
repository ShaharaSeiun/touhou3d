import { DefaultLoadingScreen } from '@babylonjs/core';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import React, { Suspense, useMemo } from 'react';
import { Scene } from 'react-babylonjs';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { FightRoot } from '../babylon-components/actors/FightRoot';
import { Player } from '../babylon-components/actors/player/characters/Player';
import { PlayerCamera } from '../babylon-components/actors/player/PlayerCamera';
import { PlayerMovement } from '../babylon-components/actors/player/PlayerMovement';
import { Playground } from '../babylon-components/actors/Playground';
import { BindControls } from '../babylon-components/BindControls';
import Engine from '../babylon-components/Engine';
import { GeneralContainer } from '../babylon-components/gameLogic/GeneralContainer';
import '../babylon-components/Shaders';
import { UI } from '../babylon-components/ui/UI';
import { ControlsContainer } from '../components/ControlsContainer';
import { globals, GlobalsContainer, loadGlobals, resetGlobals } from '../components/GlobalsContainer';
import { useWindowSize } from '../hooks/useWindowSize';
import { Stage1 } from '../stages/Stage1';
import { NeedsToClick } from '../utils/NeedsToClick';

DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (this._loadingDiv) {
        // Do not add a loading screen if there is already one
        return;
    }
    this._loadingDiv = document.createElement("div");
    this._loadingDiv.id = "babylonjsLoadingDiv";
    this._loadingDiv.style.opacity = "0";
    this._loadingDiv.style.transition = "opacity 1.5s ease";
    this._loadingDiv.style.pointerEvents = "none";
    // Loading text
    this._loadingTextDiv = document.createElement("div");
    this._loadingTextDiv.style.position = "absolute";
    this._loadingTextDiv.style.bottom = "20px";
    this._loadingTextDiv.style.right = "30px"
    this._loadingTextDiv.style.height = "10vh";
    this._loadingTextDiv.innerHTML = "Please Wait, The Girls Are Preparing...";
    this._loadingDiv.appendChild(this._loadingTextDiv);

    // Loading img
    var imgBack = new Image();
    imgBack.src = "/images/loading.png";
    imgBack.style.position = "absolute";
    imgBack.style.width = "20vw";
    imgBack.style.top = "20px";
    imgBack.style.left = "40vw";
    this._loadingDiv.appendChild(imgBack);
    this._resizeLoadingUI();
    window.addEventListener("resize", this._resizeLoadingUI);
    this._loadingDiv.style.backgroundColor = "#000000";
    document.body.appendChild(this._loadingDiv);
    this._loadingDiv.style.opacity = "1";
};

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
                                <NeedsToClick />
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
