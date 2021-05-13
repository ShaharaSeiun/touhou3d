import { InputBase } from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { useLS } from "./useLS";

export const useNewScores = (newName, setNewName) => {
    const [textField, setTextField] = useState();

    useEffect(() => {
        if (textField) {
            const interval = window.setInterval(
                () => {
                    if (textField !== document.activeElement) {
                        textField.focus()
                    }
                }
                , 100);
            return () => {
                window.clearInterval(interval);
            }
        }
    }, [textField])

    const ls = useLS()
    const highScores = useMemo(() => ls("HIGH_SCORES"), [ls]);
    const newScore = useMemo(() => ls("NEW_SCORE"), [ls]);
    const newHighScore = useMemo(() => highScores.some(score => score.score < newScore) ? newScore : false, [highScores, newScore])
    const history = useHistory()
    console.log(newScore)
    if (!newHighScore && newScore) {
        ls("NEW_SCORE", 0)
        history.push("/")
    }
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