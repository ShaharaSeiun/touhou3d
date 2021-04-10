export class BulletGroup {
    constructor(material, mesh, behaviour, sounds, positions, velocities, lifespan, startTime) {
        this.material = material;
        this.mesh = mesh;
        this.behaviour = behaviour;
        this.positions = positions;
        this.velocities = velocities;
        this.lifespan = lifespan;
        this.startTime = startTime;
        this.sounds = sounds;
    }

    dispose() {
        this.mesh.dispose();
        this.material.dispose();
        this.behaviour.dispose();
    }
}
