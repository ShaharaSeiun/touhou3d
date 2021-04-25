import { times } from "lodash"
import { preComputedEndTimings } from "../../gameLogic/StaticRefs";

export const makeEndTimings = (endTimingsInstruction, lifespan, num) => {
    let endTimings = [];

    const precomputedEndTiming = preComputedEndTimings[JSON.stringify(endTimingsInstruction)];
    if(precomputedEndTiming){
        return precomputedEndTiming;
    }

    let _timings;

    switch(endTimingsInstruction.timing){
        case "lifespan":
            const timing = lifespan === Infinity ? 8000000 : lifespan;
            _timings = times(num, () => timing);
            break;
        case "batch":
            endTimingsInstruction.times.forEach(time => {
                endTimings.push(...times(num/endTimingsInstruction.times.length, () => time))
            })
            _timings = endTimings;
            break;
        case "uniform":
            _timings = times(num, () => endTimingsInstruction.time)
            break;
        default:
            throw new Error('invalid end timing type ' + endTimingsInstruction.timing)
    }

    if(!precomputedEndTiming){
        preComputedEndTimings[JSON.stringify(endTimingsInstruction)] = _timings;
    }

    return _timings;
}