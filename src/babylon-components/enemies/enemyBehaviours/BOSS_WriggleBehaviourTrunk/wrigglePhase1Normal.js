import { useContext, useMemo } from "react";
import { bulletReplaceRotation } from "../../../bullets/BulletUtils";
import { AnimationContext } from "../../../gameLogic/GeneralContainer";
import { useAddBulletGroup } from "../../../hooks/useAddBulletGroup";
import { useAddEffect } from "../../../hooks/useAddEffect";
import { useDoSequence } from "../../../hooks/useDoSequence";
import { moveTo } from "../BehaviourCommon";
import { burst1, burst2 } from "./BOSS_WriggleBehaviourCommon";

const makeSlash = (from1, from2, to1, to2) => ({
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [1, 1, 0]
    },
    patternOptions: {
        pattern: 'claws',
        num: 20,
        from1,
        from2,
        to1,
        to2
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
})

export const slash1 = makeSlash([-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1])
export const slash2 = makeSlash([-1, 1, -1], [-1, -1, -1], [1, 1, -1], [1, -1, -1])
export const slash3 = makeSlash([-1, 0, -1], [0, -1, -1], [0, 1, -1], [1, 0, -1])
export const slash4 = makeSlash([0, 1, -1], [-1, 0, -1], [1, 0, -1], [0, -1, -1])
export const slash5 = makeSlash([1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1])
export const slash6 = makeSlash([1, -1, -1], [1, 1, -1], [-1, -1, -1], [-1, 1, -1])
export const slash7 = makeSlash([1, 0, -1], [0, 1, -1], [0, -1, -1], [-1, 0, -1])
export const slash8 = makeSlash([0, -1, -1], [1, 0, -1], [-1, 0, -1], [0, 1, -1])


export const useWrigglePhase1Normal = (active, transformNodeRef) => {
    const addBulletGroup = useAddBulletGroup();
    const { registerAnimation } = useContext(AnimationContext);
    const addEffect = useAddEffect()
    const actionsTimings = useMemo(() => [1, 3, 4, 5, 6, 12, 14,12.25, 14.5, 14.75, 15,13.25, 15.5, 15.75, 16, 18, 18.25, 18.5, 18.75, 19, 19.25, 19.5, 19.75], []);
    const actions = useMemo(() =>
        [
            () => {
                addEffect(transformNodeRef.current, 'wriggleCharge')
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    burst1
                )

                addBulletGroup(
                    transformNodeRef.current,
                    bulletReplaceRotation(id, { rotation: Math.PI/2 }, {
                        behaviour: 'linear'
                    })
                )
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    burst2
                )
                addBulletGroup(
                    transformNodeRef.current,
                    bulletReplaceRotation(id, { rotation: Math.PI/2 }, {
                        behaviour: 'linear'
                    })
                )
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    burst1
                )

                addBulletGroup(
                    transformNodeRef.current,
                    bulletReplaceRotation(id, { rotation: Math.PI/2 }, {
                        behaviour: 'linear'
                    })
                )
            },
            () => {
                moveTo(registerAnimation, transformNodeRef.current, [[-0.8, 0.8], [-0.8, 0.8], [0.8, 1.0]])
            },
            () => {
                addEffect(transformNodeRef.current, 'wriggleCharge')
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    slash1
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    slash2
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    slash3
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    slash4
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    slash5
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    slash6
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    slash7
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    slash8
                )
            },
            () => {
                moveTo(registerAnimation, transformNodeRef.current, [[-0.8, 0.8], [-0.8, 0.8], [0.8, 1.0]])
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    makeSlash([-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1])
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    makeSlash( [-1, 1, -1], [-1, -1, -1], [1, 1, -1], [1, -1, -1])
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    makeSlash([-1, 0, -1], [0, -1, -1], [0, 1, -1], [1, 0, -1])
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    makeSlash([0, 1, -1], [-1, 0, -1], [1, 0, -1], [0, -1, -1])
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    makeSlash([1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1])
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    makeSlash( [1, -1, -1], [1, 1, -1], [-1, -1, -1], [-1, 1, -1])
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    makeSlash([1, 0, -1], [0, 1, -1], [0, -1, -1], [-1, 0, -1])
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    makeSlash([0, -1, -1], [1, 0, -1], [-1, 0, -1], [0, 1, -1])
                )
            },
        ],
        //eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useDoSequence(active, transformNodeRef, actionsTimings, actions, true);
}