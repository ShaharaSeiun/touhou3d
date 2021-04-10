import { Animation, BezierCurveEase } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../BabylonUtils';
import { AnimationContext } from '../gameLogic/GeneralContainer';
import { globalActorRefs } from '../gameLogic/StaticRefs';
import { useDoSequence } from '../hooks/useDoSequence';
import { useTexture } from '../hooks/useTexture';

export const InertMinionBehaviour = ({ children, leaveScene, spawn}) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn]);

    return (
        <transformNode name position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};
