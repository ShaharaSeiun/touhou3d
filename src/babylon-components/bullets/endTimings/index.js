import { times } from "lodash"

export const makeEndTimings = (endTimingsInstruction, lifespan, num) => {
    let endTimings = [];

    switch(endTimingsInstruction.timing){
        case "lifespan":
            const timing = lifespan === Infinity ? 8000000 : lifespan;
            return times(num, () => timing);
        case "batch":
            endTimingsInstruction.times.forEach(time => {
                endTimings.push(...times(num/endTimingsInstruction.times.length, () => time))
            })
            return endTimings;
        case "uniform":
            return times(num, () => endTimingsInstruction.time)
        default:
            throw new Error('invalid end timing type ' + endTimingsInstruction.timing)
    }
}