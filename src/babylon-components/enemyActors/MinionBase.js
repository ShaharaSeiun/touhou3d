import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Animation, Color3, StandardMaterial, Vector3 } from '@babylonjs/core';
import { useName } from '../hooks/useName';
import { useTexture } from '../hooks/useTexture';
import { AnimationContext } from '../gameLogic/GeneralContainer';
import { useScene } from 'react-babylonjs';
import { TrailMesh } from '../TrailMesh';

const planePosition = new Vector3(0, 0, 0.5);

export const MinionBase = React.forwardRef(({ radius, ...props }, ref) => {
    const planeRef = useRef();
    const name = useName("minionBase")
    const texture = useTexture("blueMagicCircle")
    const scaling = useMemo(() => new Vector3(radius, radius, radius), [radius]);
    const scene = useScene();
    const { registerAnimation, unregisterAnimation } = useContext(AnimationContext);
    
    useEffect(() => {
        const trail = new TrailMesh(name + 'Trail', ref.current, scene, 0.25, 30, true);
        const sourceMat = new StandardMaterial(name + 'sourceMat', scene);
        const color = new Color3.White();
        sourceMat.emissiveColor = sourceMat.diffuseColor = color;
        sourceMat.specularColor = new Color3.Black();
        trail.material = sourceMat;

        Animation.CreateAndStartAnimation(
            name + "anim",
            planeRef.current,
            'rotation',
            1,
            8,
            new Vector3(0, 0, 0),
            new Vector3(0, 0, Math.PI * 2),
            Animation.ANIMATIONLOOPMODE_CYCLE,
        )

        return () => {
            sourceMat.dispose();
            trail.dispose();
        }
    }, [])

    return (
        <transformNode ref={ref} scaling={scaling} name={name} {...props}>
            <plane position={planePosition} ref={planeRef} name={name + 'circlePlane'} width={3} height={3}>
                <standardMaterial useAlphaFromDiffuseTexture backFaceCulling={false} name={name + 'mat'}  diffuseTexture={texture}/>
            </plane>
            <sphere diameter={radius * 2} >
                <standardMaterial emissiveColor={new Color3(10, 10, 10)} disableLighting={true} name={name + 'spheremat'} />
            </sphere>
        </transformNode>
    );
});
