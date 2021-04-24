export class BulletGroup {
    constructor(props) {
        Object.assign(this, props)
    }

    dispose() {
        this.mesh.dispose();
        this.material.dispose();
        this.behaviour.dispose();
    }
}
