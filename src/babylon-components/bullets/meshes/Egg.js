import { makeName } from '../../hooks/useName';

export const makeEggMesh = (assets) => {
    const name = makeName('egg');
    const _mesh = assets.egg.clone(name);
    _mesh.makeGeometryUnique();
    return _mesh;
};
