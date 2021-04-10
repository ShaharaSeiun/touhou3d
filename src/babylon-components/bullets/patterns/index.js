import { isFunction } from 'lodash';
import { makeBurstPattern } from './Burst';
import { makeEmptyPattern } from './Empty';
import { makeSinglePattern } from './Single';
import { makeSprayPattern } from './Spray';

export const makeBulletPattern = (patternOptions, parent) => {
    let _pattern;

    if (isFunction(patternOptions)) {
        _pattern = patternOptions();
    } else {
        switch (patternOptions.pattern) {
            case 'empty':
                _pattern = makeEmptyPattern(patternOptions, parent);
                break;
            case 'single':
                _pattern = makeSinglePattern(patternOptions, parent);
                break;
            case 'burst':
                _pattern = makeBurstPattern(patternOptions, parent);
                break;
            case 'spray':
                _pattern = makeSprayPattern(patternOptions, parent);
                break;
            default:
                throw new Error('Pattern type not supported: ' + patternOptions.pattern);
        }
    }

    const parentPosition = parent.getAbsolutePosition();

    _pattern.positions.forEach((position) => {
        position.addInPlace(parentPosition);
    });

    if(!_pattern.timings){
        _pattern.timings = new Float32Array(_pattern.positions.length)
    }

    return _pattern;
};
