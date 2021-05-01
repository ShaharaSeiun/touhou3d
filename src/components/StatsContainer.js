import ls from 'local-storage';
import React, { useCallback, useState } from 'react';

export const StatsContext = React.createContext();

export const stats = {
    HIGHEST_SCORE: 0,
    DIFFICULTY_LEVEL: "Lunatic",
    CONTINUES_USED: 0,
    DEATHS: 0,
    BOMBS_USED: 0,
    FRAMES_DROPPED: 0,
}

export const StatsContainer = ({ children }) => {
    const [loadedStats, setLoadedStats] = useState(stats);

    const saveStats = useCallback(() => {
        ls("STATS", JSON.stringify(stats))
    }, [])

    const loadStats = useCallback(() => {
        if (ls("STATS")) {
            Object.assign(stats, ls("STATS"))
            setLoadedStats({ ...stats })
        }
    }, [])

    return <StatsContext.Provider value={{ loadedStats, saveStats, loadStats }}>{children}</StatsContext.Provider>
}
