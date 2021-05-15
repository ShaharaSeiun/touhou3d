import React, { useContext, useEffect, useRef } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { makeParticleSystemFromSingle } from '../effects/makeParticleSystem';
import { AssetsContext } from '../gameLogic/GeneralContainer';
import { useName } from '../hooks/useName';

export const Particles = ({ particleSystemName, ...props }) => {
    const transformNodeRef = useRef();
    const assets = useContext(AssetsContext);
    const name = useName()
    const systemRef = useRef();

    useEffect(() => {
        systemRef.current = makeParticleSystemFromSingle(assets, particleSystemName, transformNodeRef.current);
        systemRef.current.start();
    }, [assets, particleSystemName])

    useBeforeRender(() => {
        if (!systemRef.current) return;
        systemRef.current.worldOffset = transformNodeRef.current.getAbsolutePosition();
    })

    return (
        <transformNode name={name} ref={transformNodeRef} {...props} />
    )
}
