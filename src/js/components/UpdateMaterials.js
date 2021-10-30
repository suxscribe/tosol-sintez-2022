import * as THREE from 'three';
import { debugObject } from './data/debug';

export default class UpdateMaterials {
  constructor(_options) {
    this.scene = _options.scene;
    this.environmentMap = _options.environmentMap;

    this.debugObjectEnvMap = {};
    this.debugObjectEnvMap.envMapIntensity = 1;

    this.updateAllMaterials();
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        // console.log(child);
        child.material.envMap = this.environmentMap; // apply env map to each child
        child.material.envMapIntensity = debugObject.envMapIntensity;
        child.material.needsUpdate = true; // this is for tonemapping

        child.material.emissive = new THREE.Color(0, 0, 0);

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    console.log('updateMaterials');
  }
}
