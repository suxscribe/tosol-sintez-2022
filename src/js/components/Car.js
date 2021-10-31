import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import UpdateMaterials from './UpdateMaterials.js';

export default class Car {
  constructor(_options) {
    this.container = new THREE.Object3D();
    this.object = _options.object;
    // this.position = _options.position;
    this.scene = _options.scene;
    this.debug = _options.debug;
    this.loadingManager = _options.loadingManager;

    this.updateMaterials = new UpdateMaterials({ scene: this.container });

    this.loadCarModel();
    this.setDebug();
  }

  async loadCarModel() {
    const { model } = await this.loadModel();

    // console.log(model);

    this.model = model;

    this.container.add(this.model);

    if (this.object.scale !== undefined) {
      this.container.scale.set(
        this.object.scale.x,
        this.object.scale.y,
        this.object.scale.z
      );
    } else {
      this.container.scale.set(1, 1, 1);
    }

    if (this.object.rotation !== undefined) {
      this.container.rotation.set(
        this.object.rotation.x,
        this.object.rotation.y,
        this.object.rotation.z
      );
    }

    if (this.object.position !== undefined) {
      this.container.position.set(
        this.object.position.x,
        this.object.position.y,
        this.object.position.z
      );
    } else {
      this.container.position.set(0, 0, 0);
    }

    // this.updateMaterials.updateAllMaterials();

    // console.log(this.model);
  }

  async loadModel() {
    this.loader = new GLTFLoader(this.loadingManager);

    const modelData = await this.loader.loadAsync(this.object.source);

    console.log('Squaaawk! Model Loaded');

    const model = this.setupModel(modelData);

    return { model };
  }

  setupModel(data) {
    // ADD Whole Scene
    return data.scene;
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder(this.object.name);
    this.debugFolder
      .add(this.container.position, 'x')
      .min(-20)
      .max(20)
      .step(0.1)
      .name(this.object.name + ' position x')
      .listen();
    this.debugFolder
      .add(this.container.position, 'y')
      .min(-20)
      .max(20)
      .step(0.1)
      .name(this.object.name + ' position y')
      .listen();
    this.debugFolder
      .add(this.container.position, 'z')
      .min(-20)
      .max(20)
      .step(0.1)
      .name(this.object.name + ' position z')
      .listen();
    this.debugFolder.close();
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

    this.debug.removeFolder(this.debugFolder);
  }
}
