import * as THREE from 'three';

export default class UpdateMaterials {
  constructor(_options) {
    this.scene = _options.scene;
    this.debugObject = _options.debugObject;

    // this.updateAllMaterials();
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        if (this.debugObject) {
          child.material.envMap = this.debugObject.environmentMap; // apply env map to each child
          child.material.envMapIntensity = this.debugObject.envMapIntensity;
        }
        child.material.needsUpdate = true; // this is for tonemapping

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    console.log('updateMaterials');
  }
}
