import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Animation, Color3, StandardMaterial, Vector3 } from '@babylonjs/core';
import { useName } from '../../hooks/useName';
import { useTexture } from '../../hooks/useTexture';
import { useScene } from 'react-babylonjs';
import { TrailMesh } from '../../TrailMesh';
import { GlowContext } from '../../gameLogic/GeneralContainer';

const planePosition = new Vector3(0, 0, 0.5);

export const MinionBase = React.forwardRef(({ radius = 0.5, ...props }, ref) => {
    const planeRef = useRef();
    const sphereRef = useRef();
    const name = useName("minionBase")
    const texture = useTexture("blueMagicCircle")
    const scaling = useMemo(() => new Vector3(radius, radius, radius), [radius]);
    const scene = useScene();
    const glowLayer = useContext(GlowContext);
    
    useEffect(() => {
        const trail = new TrailMesh(name + 'Trail', ref.current, scene, 0.25, 30, true);
        const sourceMat = new StandardMaterial(name + 'sourceMat', scene);
        const matColor = new Color3(1, 1, 1);
        sourceMat.emissiveColor = sourceMat.diffuseColor = matColor;
        sourceMat.specularColor = new Color3.Black();
        trail.material = sourceMat;

        const sphere = sphereRef.current;

        glowLayer.addIncludedOnlyMesh(trail)
        glowLayer.addIncludedOnlyMesh(sphere)

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
            glowLayer.removeIncludedOnlyMesh(trail)
            glowLayer.removeIncludedOnlyMesh(sphere)
            sourceMat.dispose();
            trail.dispose();
        }
    }, [glowLayer, name, ref, scene])

    return (
        <transformNode ref={ref} scaling={scaling} name={name} {...props}>
            <plane position={planePosition} ref={planeRef} name={name + 'circlePlane'} width={3} height={3}>
                <standardMaterial useAlphaFromDiffuseTexture backFaceCulling={false} name={name + 'mat'}  diffuseTexture={texture}/>
            </plane>
            <sphere ref={sphereRef} name={name + 'sphere'} diameter={radius * 2} >
                <standardMaterial emissiveColor={new Color3(1, 1, 1)} disableLighting={true} name={name + 'spheremat'} />
            </sphere>
        </transformNode>
    );
});
