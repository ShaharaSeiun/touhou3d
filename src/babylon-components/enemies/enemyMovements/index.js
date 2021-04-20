import { TransformNode } from "react-babylonjs";
import { AgroThenAfraidMovement } from "./AgroThenAfraidMovement";

export const makeEnemyMovement = (type) => {
    switch(type) {
        case "agroThenAfraid":
            return AgroThenAfraidMovement
        case "empty":
            return TransformNode;
        default:
            throw new Error('Unknown enemy movement type: ' + type)
    }
}