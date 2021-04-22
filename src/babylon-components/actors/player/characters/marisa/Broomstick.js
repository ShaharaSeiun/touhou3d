import { Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef } from 'react'
import { useAssets } from '../../../../hooks/useAssets';

export const Broomstick = (props) => {
    const transformNodeRef = useRef();
    const broomstick = useAssets("broomstick")

    useEffect(() => {
        if(!broomstick || !transformNodeRef.current) return;

        broomstick.rotation = new Vector3(0, -Math.PI/2, 0);
        broomstick.position = new Vector3(0, 0, -0.5);
        broomstick.parent = transformNodeRef.current;
    }, [broomstick])

    return (
        <transformNode ref={transformNodeRef} {...props}/>
    )
}
