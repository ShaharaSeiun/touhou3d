import { InputBase } from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { useLS } from "./useLS";

export const useNewScores = (newName, setNewName) => {
    const [textField, setTextField] = useState();

    useEffect(() => {
        if (textField) {
            console.log(textField)
            const interval = window.setInterval(() => textField.focus(), 1000);
            return () => {
                window.clearInterval(interval);
            }
        }
    }, [textField])

    const ls = useLS()
    const highScores = useMemo(() => ls("HIGH_SCORES"), [ls]);
    const newHighScore = useMemo(() => highScores.some(score => score.score < ls("NEW_SCORE")) ? ls("NEW_SCORE") : false, [highScores, ls])
    const newScores = useMemo(() => {
        if (newHighScore) {
            const scoresWithNewScore = [...highScores, {
                name: <InputBase
                    inputRef={newRef => setTextField(newRef)}
                    placeholder="Enter a name"
                    value={newName}
                    onChange={e => { setNewName(e.target.value) }}
                />,
                score: newHighScore
            }]
            return scoresWithNewScore.sort((a, b) => b.score - a.score).slice(0, 7);
        }
        return highScores
    }, [highScores, newHighScore, newName, setNewName])

    return newScores;
}