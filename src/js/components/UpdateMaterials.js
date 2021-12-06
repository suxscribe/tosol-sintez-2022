import * as THREE from 'three';
import { debugObject } from './data/vars';
import { TextureLoader } from 'three';

export default class UpdateMaterials {
  constructor(_options) {
    this.scene = _options.scene;
    this.loadingManager = _options.loadingManager;
    this.debugObject = debugObject;

    this.carPaintMaterialArr = ['paint', 'CarPaint'];
    this.textureLoader = new TextureLoader(this.loadingManager);
  }

  updateAllMaterials() {
    debugObject.selects = [];
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        console.log(child.material.name);

        if (this.debugObject.excludedMaterials.includes(child.material.name)) {
          // do nothing
          console.log(child.material);
          child.material.envMapIntensity = 0;
        } else if (child.material.name == 'shadow') {
          // child.material.alphaMap
          // child.material._alphaTest = 0.5;
          child.material.transparent = true;
          child.material.blending = THREE.MultiplyBlending;
          console.log(child.material);
        } else {
          if (this.debugObject) {
            child.material.envMap = this.debugObject.environmentMap; // apply env map to each child
            child.material.envMapIntensity = this.debugObject.envMapIntensity;
          }

          child.material.needsUpdate = true; // this is for tonemapping

          child.castShadow = true;
          child.receiveShadow = true;
        }

        child.material.needsUpdate = true; // this is for tonemapping

        debugObject.selects.push(child); // ssr
      }
    });
    console.log('updateMaterials');
  }

  changeCarColor(color) {
    this.scene.traverse((child) => {
      if (
        child.material &&
        this.carPaintMaterialArr.includes(child.material.name)
      ) {
        console.log(
          'set color',
          child.material.name,
          this.carPaintMaterialName
        );

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
      if (
        child.material &&
        this.carPaintMaterialArr.includes(child.material.name)
      ) {
        child.material.map = carTexture;
        child.material.needsUpdate = true;
      }
    });
    this.debugObject.needsUpdate = true;
  }
}
