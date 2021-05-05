import localstorage from 'local-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { DEV_REHYDRATE_LS } from '../utils/Constants';

export const LSContext = React.createContext();

export const LS = {
    ///STATS
    HIGHEST_SCORE: 0,
    DIFFICULTY_LEVEL: "Lunatic",
    CONTINUES_USED: 0,
    DEATHS: 0,
    BOMBS_USED: 0,
    FRAMES_DROPPED: 0,

    NEW_SCORE: 0,
    HIGH_SCORES: [
        {
            name: "--------",
            score: 10000
        },
        {
            name: "--------",
            score: 9000
        },
        {
            name: "--------",
            score: 8000
        },
        {
            name: "--------",
            score: 7000
        },
        {
            name: "--------",
            score: 6000
        },
        {
            name: "--------",
            score: 5000
        },
        {
            name: "--------",
            score: 4000
        }
    ],
}

export const LSContainer = ({ children }) => {
    const [loadedLS, setLoadedLS] = useState((() => {
        if (DEV_REHYDRATE_LS) {
            if (localstorage("LS")) {
                Object.assign(LS, JSON.parse(localstorage("LS")))
            }
        }
        return LS;
    })());

    useEffect(() => {
        if (!loadedLS) return;
        localstorage("LS", JSON.stringify(loadedLS))
    }, [loadedLS])

    const ls = useCallback((key, value) => {
        let outLS = loadedLS;

        if (value === undefined) {
            return outLS[key];
        }

        outLS = { ...outLS };
        outLS[key] = value;
        setLoadedLS(outLS);
    }, [loadedLS]);

    return <LSContext.Provider value={{ ls }}>{children}</LSContext.Provider>
}
