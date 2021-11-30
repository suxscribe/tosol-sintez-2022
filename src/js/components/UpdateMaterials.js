import * as THREE from 'three';
import { debugObject } from './data/vars';
import { TextureLoader } from 'three';

export default class UpdateMaterials {
  constructor(_options) {
    this.scene = _options.scene;
    this.loadingManager = _options.loadingManager;
    this.debugObject = debugObject;

    this.carPaintMaterialName = 'paint';
    this.textureLoader = new TextureLoader(this.loadingManager);
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

  changeCarColor(color) {
    this.scene.traverse((child) => {
      if (child.material && child.material.name === this.carPaintMaterialName) {
        child.material.color.set(color);
      }
    });
    this.debugObject.needsUpdate = true;
  }

  // async loadTexture() {
  //   const texture = await this.textureLoader.load(
  //     '/assets/textures/car-test.jpg'
  //   );
  //   return { texture };
  // }

  async changeCarTexture() {
    // const { carTexture } = await this.loadTexture();
    const carTexture = this.textureLoader.load('/assets/textures/car-test.jpg');
    console.log(carTexture);

    this.scene.traverse((child) => {
      if (child.material && child.material.name === this.carPaintMaterialName) {
        child.material.map = carTexture;
        child.material.needsUpdate = true;
      }
    });
    this.debugObject.needsUpdate = true;
  }
}
