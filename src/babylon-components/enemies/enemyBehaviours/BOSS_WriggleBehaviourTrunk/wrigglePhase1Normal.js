import { useContext, useMemo } from "react";
import { AnimationContext } from "../../../gameLogic/GeneralContainer";
import { useAddBulletGroup } from "../../../hooks/useAddBulletGroup";
import { useAddEffect } from "../../../hooks/useAddEffect";
import { useDoSequence } from "../../../hooks/useDoSequence";
import { moveTo } from "../BehaviourCommon";
import { burst1, burst1_replace1, burst2, burst2_replace1 } from "./BOSS_WriggleBehaviourCommon";

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


export const useWrigglePhase1Normal = (active, transformNodeRef) => {
    const addBulletGroup = useAddBulletGroup();
    const { registerAnimation } = useContext(AnimationContext);
    const addEffect = useAddEffect()
    const actionsTimings = useMemo(() => [1, 2, 3, 4, 10, 12,12.25, 12.5, 12.75, 13,13.25, 13.5, 13.75, 14, 16, 16.25, 16.5, 16.75, 17, 17.25, 17.5, 17.75], []);
    const actions = useMemo(() =>
        [
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    burst1
                )

                addBulletGroup(
                    transformNodeRef.current,
                    burst1_replace1(id)
                )
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    burst2
                )
                addBulletGroup(
                    transformNodeRef.current,
                    burst2_replace1(id)
                )
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    burst1
                )

                addBulletGroup(
                    transformNodeRef.current,
                    burst1_replace1(id)
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