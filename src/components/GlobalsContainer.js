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
};

export const globals = {...defaults};

export const GlobalsContainer = ({ children }) => {
    const setGlobal = (key, value) => {
        globals[key] = value;
    };

    const loadGlobals = useCallback(() => {
        Object.assign(globals, defaults, JSON.parse(ls('globals')));
    }, []);

    useEffect(() => {
        const interval = window.setInterval(() => {
            ls('globals', JSON.stringify(globals));
        }, 1000);
        return () => {
            window.clearInterval(interval);
        };
    }, []);

    return <GlobalsContext.Provider value={{ setGlobal, loadGlobals }}>{children}</GlobalsContext.Provider>;
};
