import { Matrix } from '@babylonjs/core';
import { makeSphereMesh } from './Sphere';
import { makeSphereWithHaloMesh } from './SphereWithHalo';
import { makeCardMesh } from './Card';
import { makeKnifeMesh } from './Knife';
import { makeItemMesh } from './Item';
import { makeEggMesh } from './Egg';
import { MAX_BULLETS_PER_GROUP } from '../../../utils/Constants';
import { makeMarisaBulletMesh } from './MarisaBullet';

const bufferMatricesPreCompute = new Float32Array(MAX_BULLETS_PER_GROUP * 16);
for(let i = 0; i < MAX_BULLETS_PER_GROUP; i++){
    const matrix = Matrix.Identity();
    matrix.copyToArray(bufferMatricesPreCompute, i * 16);
};

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
        case 'marisaBullet':
            _mesh = makeMarisaBulletMesh(assets);
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
        if(num > MAX_BULLETS_PER_GROUP) throw new Error("MAX_BULLETS_PER_GROUP is " + MAX_BULLETS_PER_GROUP + " You have " + num)
        _mesh.thinInstanceSetBuffer("matrix", bufferMatricesPreCompute.slice(0, num * 16), 16);
    }

    return {mesh: _mesh, radius};
};
