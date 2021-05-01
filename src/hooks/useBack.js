import { useHistory } from 'react-router';
import { backSound } from '../sounds/SFX';
import { useKeydownMenu } from './useKeydown';

export const useBack = (path) => {
    const history = useHistory();

    useKeydownMenu('ESCAPE', () => {
        history.push(path);
        backSound.play();
    });
};
