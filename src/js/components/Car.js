import * as THREE from 'three';

import UpdateMaterials from './UpdateMaterials.js';
import EventEmitter from './../utils/EventEmitter';
import {
  Lensflare,
  LensflareElement,
} from 'three/examples/jsm/objects/Lensflare.js';
import { debugObject } from './data/vars.js';

export default class Car extends EventEmitter {
  constructor(_options) {
    super();

    this.container = new THREE.Object3D();
    this.object = _options.object;
    // this.position = _options.position;
    this.scene = _options.scene;
    this.debug = _options.debug;
    this.loadingManager = _options.loadingManager;
    this.loader = _options.loader;
    this.textureLoader = _options.textureLoader;

    this.debugObject = this.debugObject;
    this.updateMaterials = new UpdateMaterials({ scene: this.container });

    this.loadCarModel();

    this.debugFolderLight = [];
    this.setDebug();

    this.setLensflare();
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

    console.log('trigger loaded');

    this.trigger('loaded'); // trigger loaded event to force update materials
  }

  async loadModel() {
    const modelData = await this.loader.loadAsync(this.object.source);
    console.log('Squaaawk! Loaded: ' + this.object.source);
    const model = this.setupModel(modelData);
    // const modalScene = modelData.scene;
    return { model };
  }

  setupModel(data) {
    // ADD Whole Scene
    return data.scene;
  }

  addLensflare() {
    if (this.object.lensflares) {
      this.object.lensflares.forEach((lensflareData) => {
        const light = new THREE.PointLight(0xffffff, 1.5, 20);
        light.color.setHSL(0.5, 0.5, 0.5);
        light.position.set(lensflareData.x, lensflareData.y, lensflareData.z);
        this.container.add(light);

        const lensflare = new Lensflare();
        lensflare.addElement(
          new LensflareElement(this.textureFlare0, 700, 0, light.color)
        );
        // lensflare.addElement(new LensflareElement(this.textureFlare3, 60, 0.6));
        // lensflare.addElement(new LensflareElement(this.textureFlare3, 70, 0.7));
        // lensflare.addElement(
        //   new LensflareElement(this.textureFlare3, 120, 0.9)
        // );
        // lensflare.addElement(new LensflareElement(this.textureFlare3, 70, 1));
        light.add(lensflare);

        if (this.debug) {
          this.debugFolderLight[lensflareData.name] = this.debug.addFolder(
            'Lensflare ' + lensflareData.name
          );
          this.debugFolderLight[lensflareData.name]
            .add(light.position, 'x')
            .min(-100)
            .max(200)
            .step(0.1)
            .onChange(() => {
              this.setNeedsUpdate();
            })
            .name('Light x');
          this.debugFolderLight[lensflareData.name]
            .add(light.position, 'y')
            .min(-100)
            .max(200)
            .step(0.1)
            .onChange(() => {
              this.setNeedsUpdate();
            })
            .name('Light y');
          this.debugFolderLight[lensflareData.name]
            .add(light.position, 'z')
            .min(-100)
            .max(200)
            .step(0.1)
            .onChange(() => {
              this.setNeedsUpdate();
            })
            .name('Light z');

          this.debugFolderLight[lensflareData.name].close();
        }
      });
    }
  }

  setLensflare() {
    // const textureLoader = new THREE.TextureLoader();

    this.textureFlare0 = this.textureLoader.load('/assets/textures/flare.png');
    this.textureFlare3 = this.textureLoader.load(
      '/assets/textures/Flare_Pentagone.png'
    );
    this.addLensflare();
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder(this.object.name);
    this.debugFolder
      .add(this.container.position, 'x')
      .min(-20)
      .max(20)
      .step(0.05)
      .name(this.object.name + ' position x')
      .listen();
    this.debugFolder
      .add(this.container.position, 'y')
      .min(-20)
      .max(20)
      .step(0.05)
      .name(this.object.name + ' position y')
      .listen();
    this.debugFolder
      .add(this.container.position, 'z')
      .min(-20)
      .max(20)
      .step(0.05)
      .name(this.object.name + ' position z')
      .listen();
    this.debugFolder
      .add(this.container.rotation, 'x')
      .min(-Math.PI)
      .max(Math.PI)
      .step(0.001)
      .name(this.object.name + ' rotation x')
      .listen();
    this.debugFolder
      .add(this.container.rotation, 'y')
      .min(-Math.PI)
      .max(Math.PI)
      .step(0.001)
      .name(this.object.name + ' rotation y')
      .listen();
    this.debugFolder
      .add(this.container.rotation, 'z')
      .min(-Math.PI)
      .max(Math.PI)
      .step(0.001)
      .name(this.object.name + ' rotation z')
      .listen();
    this.debugFolder.close();
  }

  setNeedsUpdate() {
    this.debugObject.needsUpdate = true;
  }

  removeObject() {
    this.container.traverse((child) => {
      if (child.hasOwnProperty('geometry')) {
        child.geometry.dispose();
      }
      if (child.hasOwnProperty('material')) {
        if (child.material) {
          child.material.dispose();
        }
      }
      this.scene.remove(child);
      // child.removeFromParent() // alternate way to remove object. without passing scene.
    });

    if (this.debugFolder) {
      this.debug.removeFolder(this.debugFolder);
      Object.values(this.debugFolderLight).forEach((folder) => {
        this.debug.removeFolder(folder);
      });
    }
    // this.debug.removeFolder(this.debugFolderLight);
  }
}
