import {
    AssetsManager,
    DracoCompression,
    Matrix,
    Mesh,
    MeshBuilder,
    ParticleHelper,
    ParticleSystemSet,
    Vector2,
    Vector3
} from '@babylonjs/core';
import { useCallback, useEffect, useState } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { capFirst } from '../../utils/Utils';
import { makeSpriteSheetAnimation } from '../BabylonUtils';

export const useLoadAssets = () => {
    const scene = useScene();
    const [animatedTextures, setAnimatedTextures] = useState();
    const [assets, setAssets] = useState();

    const loadAnimatedTextures = useCallback(
        (tempAssets) => {
            const tempAnimatedTextures = [];
            const spriteSheetTexture = tempAssets['fairySpriteSheet'];
            const blueFairyTexture = makeSpriteSheetAnimation({
                name: 'blueFairyTextureAnimation',
                scene,
                spriteSize: new Vector2(32, 32),
                spriteSheetOffset: new Vector2(12, 40),
                spriteSheetSize: new Vector2(1024, 1024),
                totalFrames: 4,
                frameRate: 10,
                spriteSheetTexture: spriteSheetTexture,
            });
            tempAssets['blueFairyTexture'] = blueFairyTexture;
            tempAnimatedTextures.push(blueFairyTexture);

            setAnimatedTextures(tempAnimatedTextures);
        },
        [scene]
    );

    useEffect(() => {
        //Particles
        ParticleHelper.BaseAssetsUrl = '/assets/particles';
        ParticleSystemSet.BaseAssetsUrl = '/assets/particles';

        DracoCompression.Configuration = {
            decoder: {
                wasmUrl: '/assets/util/draco_wasm_wrapper_gltf.js',
                wasmBinaryUrl: '/assets/util/draco_decoder_gltf.wasm',
                fallbackUrl: '/assets/util/draco_decoder_gltf.js',
            },
        };

        const tempAssets = {};
        const assetList = [
            {
                json: 'deathParticles',
                name: 'deathParticles',
                type: 'particles',
            },
            {
                json: 'hitParticles',
                name: 'hitParticles',
                type: 'particles',
            },
            {
                json: 'chargeBomb',
                name: 'chargeBomb',
                type: 'particles',
            },
            {
                json: 'chargeBombMarisa',
                name: 'chargeBombMarisa',
                type: 'particles',
            },
            {
                json: 'chargeWriggle',
                name: 'chargeWriggle',
                type: 'particles',
            },
            {
                rootUrl: '/assets/enemies/bosses/',
                sceneFilename: 'wriggle.glb',
                name: 'wriggle',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'blueFairy.glb',
                name: 'blueFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'salmonFairy.glb',
                name: 'salmonFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'greenFairy.glb',
                name: 'greenFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'yellowFairy.glb',
                name: 'yellowFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'blueHatFairy.glb',
                name: 'blueHatFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'salmonHatFairy.glb',
                name: 'salmonHatFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'greenHatFairy.glb',
                name: 'greenHatFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/fairies/',
                sceneFilename: 'yellowHatFairy.glb',
                name: 'yellowHatFairy',
                type: 'model',
            },
            {
                rootUrl: '/assets/landscapes/stage1/',
                sceneFilename: 'landscapeTileAdraco.glb',
                name: 'stage1TileA',
                type: 'model',
            },
            {
                rootUrl: '/assets/landscapes/stage1/',
                sceneFilename: 'landscapeTileBdraco.glb',
                name: 'stage1TileB',
                type: 'model',
            },
            {
                url: '/assets/player/marisa/rune1.png',
                name: 'rune1',
                type: 'texture',
            },
            {
                url: '/assets/player/marisa/rune2.png',
                name: 'rune2',
                type: 'texture',
            },
            {
                url: '/assets/player/marisa/rune3.png',
                name: 'rune3',
                type: 'texture',
            },
            {
                url: '/assets/player/marisa/rune4.png',
                name: 'rune4',
                type: 'texture',
            },
            {
                url: '/assets/player/marisa/runeEmpty.png',
                name: 'runeEmpty',
                type: 'texture',
            },
            {
                url: '/assets/enemies/textures/blueMagicCircle.png',
                name: 'blueMagicCircle',
                type: 'texture',
            },
            {
                url: '/assets/spriteSheets/fairySpriteSheet.png',
                name: 'fairySpriteSheet',
                type: 'texture',
            },
            {
                url: '/assets/bullets/ofuda/reimu_ofuda.jpg',
                name: 'reimu_ofuda',
                type: 'texture',
            },
            {
                url: '/assets/bullets/ofuda/reimu_ofuda_blue.jpg',
                name: 'reimu_ofuda_blue',
                type: 'texture',
            },
            {
                url: '/assets/player/reimu/reimuDeath.png',
                name: 'reimuDeath',
                type: 'texture',
            },
            {
                url: '/assets/items/point.png',
                name: 'point',
                type: 'texture',
            },
            {
                url: '/assets/items/power.png',
                name: 'power',
                type: 'texture',
            },
            {
                url: '/assets/items/fullpower.png',
                name: 'fullpower',
                type: 'texture',
            },
            {
                url: '/assets/items/bomb.png',
                name: 'bomb',
                type: 'texture',
            },
            {
                url: '/assets/items/1up.png',
                name: '1up',
                type: 'texture',
            },
            {
                rootUrl: '/assets/bullets/knife/',
                sceneFilename: 'knife.glb',
                name: 'knife',
                type: 'model',
            },
            {
                rootUrl: '/assets/enemies/tumbleweeds/',
                sceneFilename: 'tumbleweed.glb',
                name: 'tumbleweed',
                type: 'model',
            },
            {
                rootUrl: '/assets/player/marisa/broomstick/',
                sceneFilename: 'scene.gltf',
                name: 'broomstick',
                type: 'model',
            },
            {
                rootUrl: '/assets/player/marisa/beam/',
                sceneFilename: 'beam.glb',
                name: 'beam',
                type: 'model',
            },
            {
                rootUrl: '/assets/bullets/marisaBullet/',
                sceneFilename: 'marisaBullet.glb',
                name: 'marisaBullet',
                type: 'model',
            },
            {
                type: 'function',
                name: 'egg',
                generator: () => {
                    const segments = 10
                    const length = 4
                    const width = 2

                    const y = (x) => width * (x) * (x - length) / ((length * length) / 2)

                    const myShape = [];

                    for (let i = 0; i <= segments; i++) {
                        myShape.push(new Vector3(y(i * length / segments), i * length / segments, 0))
                    }

                    const mesh = MeshBuilder.CreateLathe(
                        "egg",
                        {
                            shape: myShape,
                            tessellation: segments * 2
                        }
                    );

                    const rotationMatrix = Matrix.RotationX(Math.PI / 2);
                    mesh.bakeTransformIntoVertices(rotationMatrix);
                    mesh.isVisible = false;
                    return mesh;
                },
            },
            {
                type: 'function',
                name: 'sphere',
                generator: () => {
                    const mesh = MeshBuilder.CreateSphere(
                        'sphere',
                        {
                            diameter: 2,
                            segments: 10,
                            updatable: false,
                        },
                        scene
                    );
                    mesh.isVisible = false;
                    return mesh;
                },
            },
            {
                type: 'function',
                name: 'sphereWithHalo',
                generator: () => {
                    const meshInner = MeshBuilder.CreateSphere(
                        'sphereWithHaloInner',
                        {
                            diameter: 1.5,
                            segments: 10,
                        },
                        scene
                    );
                    const meshOuter = MeshBuilder.CreateTorus(
                        'sphereWithHaloOuter',
                        {
                            diameter: 2.0,
                            thickness: 0.1,
                            tessellation: 20,
                        },
                        scene
                    );

                    const rotationMatrix = Matrix.RotationX(Math.PI / 2);
                    meshOuter.bakeTransformIntoVertices(rotationMatrix);

                    const mesh = Mesh.MergeMeshes([meshInner, meshOuter], true);

                    mesh.isVisible = false;
                    return mesh;
                },
            },
            {
                type: 'function',
                name: 'card',
                generator: () => {
                    const mesh = MeshBuilder.CreatePlane(
                        'card',
                        {
                            width: 0.3,
                            height: 0.6,
                            updatable: true,
                        },
                        scene
                    );
                    const matrixX = Matrix.RotationX(Math.PI / 2);
                    const matrixZ = Matrix.RotationZ(Math.PI / 2);

                    const matrix = matrixX.multiply(matrixZ);
                    mesh.bakeTransformIntoVertices(matrix);
                    mesh.isVisible = false;
                    return mesh;
                },
            },
            {
                type: 'function',
                name: 'item',
                generator: () => {
                    const mesh = MeshBuilder.CreatePlane(
                        'item',
                        {
                            width: 0.25,
                            height: 0.25,
                            updatable: true,
                        },
                        scene
                    );
                    mesh.isVisible = false;
                    return mesh;
                },
            },
        ];

        ['reimu', 'wriggle'].forEach((name) =>
            ['angry', 'dissapoint', 'excited', 'neutral', 'shocked', 'special', 'tired'].forEach((emotion) =>
                assetList.push({
                    url: `/assets/characterPortraits/${name}/${emotion}.png`,
                    name: `${name}Character${capFirst(emotion)}`,
                    type: 'texture',
                    postProcess: (texture) => {
                        texture.vScale = 0.99;
                    },
                })
            )
        );

        const assetsManager = new AssetsManager(scene);

        assetList.forEach((asset) => {
            let assetTask;

            switch (asset.type) {
                case 'particles':
                    new ParticleHelper.CreateAsync(asset.json, scene, true).then(function (set) {
                        set.systems[0].emitter = new Vector3(0, 0, 0);
                        tempAssets[asset.name] = set.systems[0];
                    });
                    break;
                case 'texture':
                    assetTask = assetsManager.addTextureTask(asset.name, asset.url);
                    assetTask.onSuccess = (task) => {
                        task.texture.hasAlpha = true;

                        if (asset.postProcess) {
                            asset.postProcess(task.texture);
                        }
                        tempAssets[task.name] = task.texture;
                    };
                    break;
                case 'function':
                    tempAssets[asset.name] = asset.generator();
                    break;
                case 'model':
                    assetTask = assetsManager.addContainerTask(asset.name, '', asset.rootUrl, asset.sceneFilename);
                    assetTask.onSuccess = (task) => {
                        tempAssets[task.name] = task.loadedContainer;
                    };
                    break;
                default:
                    throw new Error('Invalid asset type: ' + asset.type);
            }

            if (!assetTask) return;
            assetTask.onError = (error) => {
                console.error(error);
            };
        });

        assetsManager.onFinish = async () => {
            loadAnimatedTextures(tempAssets);
            setAssets(tempAssets);
        };

        assetsManager.load();
    }, [scene, loadAnimatedTextures]);

    useBeforeRender(() => {
        if (!animatedTextures) return;
        let now = new Date();

        animatedTextures.forEach((texture) => {
            const timeAlive = now - texture.startTime;
            const frame = Math.floor(timeAlive / texture.frameTime) % texture.totalFrames;
            texture.setFloat('frame', frame);
        });
    });

    return assets;
};
