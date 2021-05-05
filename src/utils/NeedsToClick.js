import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { useScene } from "react-babylonjs";

let initFunc;

const didInit = {
    current: false
}

const useStyles = makeStyles({
    needsToClick: {
        position: "absolute",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#aaaaaaaa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        textAlign: "center",
        top: 0,
        left: 0
    }
})

export const NeedsToClick = () => {
    const classes = useStyles();
    const scene = useScene()

    useEffect(() => {
        if (didInit.current) return;
        let elem = document.createElement("div");
        elem.className = classes.needsToClick;
        elem.innerHTML = "CLICK/TAP THE SCREEN <br><br> (Also, F11 for fullscreen if you want)"
        document.body.appendChild(elem);

        initFunc = () => {
            if (didInit.current) return;
            document.body.removeEventListener('click', initFunc);
            document.body.removeEventListener('touchstart', initFunc);
            didInit.current = true;
            document.body.removeChild(elem);
            elem = null;
            if (scene) scene.paused = false;
        }

        if (scene) scene.paused = true;
        document.body.addEventListener('click', initFunc);
        document.body.addEventListener('touchstart', initFunc);
    }, [classes.needsToClick, scene]);

    return false;
}
