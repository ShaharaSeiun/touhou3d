export class BulletGroup {
    constructor(material, mesh, behaviour, sounds, positions, velocities, timings, endTimings, lifespan, timeSinceStart) {
        this.material = material;
        this.mesh = mesh;
        this.behaviour = behaviour;
        this.positions = positions;
        this.velocities = velocities;
        this.timings = timings;
        this.endTimings = endTimings;
        this.lifespan = lifespan;
        this.timeSinceStart = timeSinceStart;
        this.sounds = sounds;
    }

    dispose() {
        this.mesh.dispose();
        this.material.dispose();
        this.behaviour.dispose();
    }
}
