import { Matrix } from "@babylonjs/core";
import { makeName } from "../../hooks/useName";

export const makeMarisaBulletMesh = (assets) => {
    const _mesh = assets.marisaBullet.instantiateModelsToScene(makeName).rootNodes[0]._children[0];
    
    return _mesh;
}