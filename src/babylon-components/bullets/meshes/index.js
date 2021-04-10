import { Matrix } from '@babylonjs/core';
import { makeSphereMesh } from './Sphere';
import { makeSphereWithHaloMesh } from './SphereWithHalo';
import { makeCardMesh } from './Card';
import { makeKnifeMesh } from './Knife';
import { makeItemMesh } from './Item';
import { makeEggMesh } from './Egg';

export const makeBulletMesh = (meshOptions, assets) => {
    const { mesh, radius } = meshOptions;

    let _mesh;

    switch (mesh) {
        case 'sphere':
            _mesh = makeSphereMesh(assets);
            break;
        case 'sphereWithHalo':
            _mesh = makeSphereWithHaloMesh(assets);
            break;
        case 'egg':
            _mesh = makeEggMesh(assets);
            break;
        case 'card':
            _mesh = makeCardMesh(assets);
            break;
        case 'item':
            _mesh = makeItemMesh(assets);
            break;
        case 'knife':
            _mesh = makeKnifeMesh(assets);
            break;
        default:
            throw new Error('Mesh type not supported: ' + meshOptions.mesh);
    }

    const scaleMatrix = Matrix.Scaling(radius, radius, radius);
    _mesh.bakeTransformIntoVertices(scaleMatrix);

    _mesh.alwaysSelectAsActiveMesh = true;
    _mesh.doNotSyncBoundingInfo = true;
    _mesh.isVisible = true;

    _mesh.makeInstances = (num) => {
        const bufferMatrices = new Float32Array(num * 16);
        for(let i = 0; i < num; i++){
            const matrix = Matrix.Identity();
            matrix.copyToArray(bufferMatrices, i * 16);
        };

        _mesh.thinInstanceSetBuffer("matrix", bufferMatrices, 16);
    }

    return {mesh: _mesh, radius};
};
