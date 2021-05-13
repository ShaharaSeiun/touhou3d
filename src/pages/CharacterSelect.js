import React, { useCallback, useContext, useMemo } from 'react';
import { useHistory } from 'react-router';
import { GlobalsContext } from '../components/GlobalsContainer';
import { VerticleMenu } from '../components/VerticleMenu';
import { useBack } from '../hooks/useBack';

export const CharacterSelect = ({ back, next, active }) => {
    const { setGlobal } = useContext(GlobalsContext);
    const history = useHistory();
    useBack(back);

    const choose = useCallback(
        (character) => {
            setGlobal('character', character, true);
            history.push(next);
        },
        [setGlobal, history, next]
    );

    const characterOptions = useMemo(
        () => ({
            Marisa: () => choose('marisa'),
            Reimu: () => choose('reimu'),
        }),
        [choose]
    );

    return <VerticleMenu active={active} slanted={active} menuMap={characterOptions}></VerticleMenu>;
};
