import * as THREE from 'three';
import { debugObject } from './data/vars';
import { TextureLoader } from 'three';

export default class UpdateMaterials {
  constructor(_options) {
    this.scene = _options.scene;
    this.loadingManager = _options.loadingManager;
    this.debugObject = debugObject;

    // this.textureLoader = new TextureLoader(this.loadingManager);
  }

  updateAllMaterials() {
    debugObject.selects = []; // array for object to make SSR effects
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        (child.material instanceof THREE.MeshStandardMaterial ||
          child.material instanceof THREE.MeshPhysicalMaterial)
      ) {
        // console.log(child.material.name);
        // console.log(child.material);

        // todo add envMap assignment only to materials specified

        // Disable envMap effect on some materials
        if (this.debugObject.excludedMaterials.includes(child.material.name)) {
          // console.log(child.material);
          child.material.envMapIntensity = 0;
        }

        // Set Transparent = True on shadow materials
        if (this.debugObject.shadowMaterials.includes(child.material.name)) {
          // child.material.alphaMap
          // child.material._alphaTest = 0.5;
          // child.material.alphaMap = this.shadowTexture;
          child.material.transparent = true;
          // child.material.visible = false;
          // child.material.blending = THREE.MultiplyBlending;
          // console.log(child.material);
        }

        // Set EnvMaps to specified materials
        // if (this.debugObject.includedMaterials.includes(child.material.name)) {
        //   child.material.envMap = this.debugObject.environmentMap; // apply env map
        //   child.material.envMapIntensity = this.debugObject.envMapIntensity;
        // }
        if (
          !this.debugObject.excludedMaterials.includes(child.material.name) &&
          !this.debugObject.shadowMaterials.includes(child.material.name)
        ) {
          child.material.envMap = this.debugObject.environmentMap; // apply env map to each child
          child.material.envMapIntensity = this.debugObject.envMapIntensity;

          // child.castShadow = true;
          // child.receiveShadow = true;
        }

        if (child.material.name == 'watter') {
          child.material.transparent = true;
          child.material.blending = THREE.MultiplyBlending;
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
        debugObject.carPaintMaterials.includes(child.material.name)
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

  // async changeCarTexture() {
  //   // const { carTexture } = await this.loadTexture();
  //   const carTexture = this.textureLoader.load('/assets/textures/car-test.jpg');
  //   console.log(carTexture);

  //   this.scene.traverse((child) => {
  //     if (
  //       child.material &&
  //       this.carPaintMaterialArr.includes(child.material.name)
  //     ) {
  //       child.material.map = carTexture;
  //       child.material.needsUpdate = true;
  //     }
  //   });
  //   this.debugObject.needsUpdate = true;
  // }
}
