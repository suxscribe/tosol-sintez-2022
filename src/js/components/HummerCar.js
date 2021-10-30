import * as THREE from 'three';

import { loadModel } from './Model.js';
import UpdateMaterials from './updateMaterials';

export default class HummerCar {
  constructor(_options) {
    this.container = new THREE.Object3D();
    this.position = new THREE.Vector3();
    this.scene = _options.scene;

    this.updateMaterials = new UpdateMaterials({ scene: this.container });

    this.loadCarModel();
  }

  async loadCarModel() {
    const { model } = await loadModel();

    // console.log(model);

    // Set up car groups. Will be animating them later
    this.groupHummer = new THREE.Group();
    this.groupHummerBody = new THREE.Group();
    this.groupHummerWheels = new THREE.Group();

    this.container.add(this.groupHummer);
    this.groupHummer.add(this.groupHummerBody);
    this.groupHummer.add(this.groupHummerWheels);

    this.model = model;

    this.groupHummer.add(this.model);

    this.groupHummer.scale.set(0.1, 0.1, 0.1);
    this.groupHummer.rotation.y = Math.PI * -0.5;

    this.updateMaterials.updateAllMaterials();

    console.log(this.model);
  }

  removeObject() {
    this.container.traverse((child) => {
      if (child.hasOwnProperty('geometry')) {
        child.geometry.dispose();
      }
      if (child.hasOwnProperty('material')) {
        child.material.dispose();
      }
      this.scene.remove(child);
      // child.removeFromParent() // alternate way to remove object. without passing scene.
    });
  }
}
