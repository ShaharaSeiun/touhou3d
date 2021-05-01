import React, { useCallback, useEffect } from 'react';
import ls from 'local-storage';
import { SETTINGS } from '../utils/Settings';

export const GlobalsContext = React.createContext();

const defaults = {
    HISCORE: 0,
    SCORE: 0,
    PLAYER: SETTINGS.PLAYER,
    BOMB: SETTINGS.BOMB,
    POWER: 0,
    GRAZE: 0,
    POINT: 0,
    TIME: 0,
    character: "marisa",
    difficulty: "LUNATIC"
};

export const loadGlobals = () => {
    Object.assign(globals, JSON.parse(ls('globals')));
};

export const resetGlobals = (forceSave = false) => {
    Object.assign(globals, 
    {   
        HISCORE: 0,
        SCORE: 0,
        PLAYER: SETTINGS.PLAYER,
        BOMB: SETTINGS.BOMB,
        POWER: 0,
        GRAZE: 0,
        POINT: 0,
        TIME: 0
    })
    if(forceSave) ls('globals', JSON.stringify(globals));
};

export const globals = JSON.parse(ls('globals')) || defaults;

export const GlobalsContainer = ({ children }) => {
    const setGlobal = (key, value, forceSave = false) => {
        globals[key] = value;
        if(forceSave) ls('globals', JSON.stringify(globals));
    };
    
    useEffect(() => {
        const interval = window.setInterval(() => {
            console.log(globals.character);
            ls('globals', JSON.stringify(globals));
        }, 1000);
        return () => {
            window.clearInterval(interval);
        };
    }, []);

    return <GlobalsContext.Provider value={{ setGlobal, loadGlobals, resetGlobals }}>{children}</GlobalsContext.Provider>;
};
