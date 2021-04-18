import { Animation, Color3, Space, StandardMaterial, Vector3 } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { useName } from '../../../../hooks/useName';
import { useKeydown, useKeyup } from '../../../../../hooks/useKeydown';
import { useDoSequence } from '../../../../hooks/useDoSequence';
import { GlowContext } from '../../../../gameLogic/GeneralContainer';
import { PlayerUILeft } from '../PlayerUILeft';
import { PlayerUIRight } from '../PlayerUIRight';
import { ReimuLinearBulletEmitter } from './ReimuLinearBulletEmitter';
import { ReimuTrackingBulletEmitter } from './ReimuTrackingBulletEmitter';
import { TrailMesh } from '../../../../TrailMesh';
import { PLAYER_BOMB_DURATION, PLAYER_INVULNERABLE_COOLDOWN } from '../../../../../utils/Constants';
import { times } from 'lodash';

const UIPosition = new Vector3(0, -0.6, 0);
const z = new Vector3(0, 0, 1);

export const ReimuOrb = ({isBombing, powerClass, side, isInvulnerable}) => {
    const name = useName("ReimuOrb")
    const sphereTransformRef = useRef();
    const sphereRef = useRef();
    const trailRef = useRef();
    const sideCoefficient = useMemo(() => side === 'right' ? 1 : -1, [side])
    const UIClass = useMemo(() => side === 'right' ? PlayerUIRight : PlayerUILeft, [side])
    const linearBulletEmitterPosition = useMemo(() => new Vector3(sideCoefficient * 0.15, 0, 0), [sideCoefficient])
    const spherePosition = useMemo(() => new Vector3(sideCoefficient, 0, 0), [sideCoefficient])
    const focusPosition = useMemo(() => new Vector3(sideCoefficient * 0.5, 0, 0), [sideCoefficient])
    const unfocusPosition = useMemo(() => new Vector3(sideCoefficient, 0, 0), [sideCoefficient])
    const trackingInitialVelocity = useMemo(() => [sideCoefficient * 6, 0, 4], [sideCoefficient]);
    const glowLayer = useContext(GlowContext);
    const scene = useScene();

    useKeydown('SLOW', () => {
        Animation.CreateAndStartAnimation(
            'anim',
            sphereTransformRef.current,
            'position',
            60,
            15,
            sphereTransformRef.current.position,
            focusPosition,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );
    });
    useKeyup('SLOW', () => {
        Animation.CreateAndStartAnimation(
            'anim',
            sphereTransformRef.current,
            'position',
            60,
            15,
            sphereTransformRef.current.position,
            unfocusPosition,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );
    });

    //sphere blinking
    const invulnerableTimings = useMemo(() => 
        times(40, (num) => {
            return PLAYER_INVULNERABLE_COOLDOWN * num / 40
        }), 
    []);

    const invulnerableActions = useMemo(() => [
        ...times(39, (num) => {
            return () => {
                sphereRef.current.isVisible = num % 2 === 0
            }
        }), 
        () => {
            sphereRef.current.isVisible = true
        }
    ], []);

    useDoSequence(isInvulnerable, sphereRef, invulnerableTimings, invulnerableActions);

    const bombingTimings = useMemo(() => [0, PLAYER_BOMB_DURATION], []);

    const bombingActions = useMemo(
        () => [
            () => {
                
                trailRef.current = new TrailMesh('sphere1Trail', sphereTransformRef.current, scene, 0.25, 30, true);
                const sourceMat = new StandardMaterial('sourceMat1', scene);
                const color = new Color3.Red();
                sourceMat.emissiveColor = sourceMat.diffuseColor = color;
                sourceMat.specularColor = new Color3.Black();
                trailRef.current.material = sourceMat;
                glowLayer.addIncludedOnlyMesh(trailRef.current)
            },
            () => {
                glowLayer.removeIncludedOnlyMesh(trailRef.current)
                trailRef.current.dispose();
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useDoSequence(isBombing, sphereRef, bombingTimings, bombingActions);

    useBeforeRender((scene) => {
        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;
        sphereRef.current.rotate(z, sideCoefficient * deltaS, Space.WORLD);
    })

    return (
        <transformNode name={name + 'sphereTransform'} ref={sphereTransformRef} position={spherePosition}>
            {!isBombing && <UIClass position={UIPosition} />}
            <ReimuLinearBulletEmitter position={linearBulletEmitterPosition} powerClass={powerClass} />
            {powerClass > 0 && (
                <ReimuTrackingBulletEmitter initialVelocity={trackingInitialVelocity} powerClass={powerClass} />
            )}
            <sphere
                name={name + 'sphere'}
                scaling={new Vector3(0.5, 0.5, 0.5)}
                rotation={new Vector3(Math.PI / 4, 0, 0)}
                ref={sphereRef}
            >
                <standardMaterial alpha={0.5} name={name + 'sphereMat'}>
                    <texture assignTo="diffuseTexture" url={'/assets/debugTextures/yinyang.jpg'} />
                </standardMaterial>
            </sphere>
        </transformNode>
    )
}
