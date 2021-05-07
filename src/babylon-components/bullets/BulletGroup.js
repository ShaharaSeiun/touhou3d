export class BulletGroup {
    constructor(props) {
        Object.assign(this, props)
    }

    dispose() {
        if (this.mesh.isPooled) {
            this.releaseMesh(this.mesh)
        }
        else {
            this.mesh.dispose()
        }
        this.mesh.dispose();
        this.material.dispose();
        this.behaviour.dispose();
    }
}
