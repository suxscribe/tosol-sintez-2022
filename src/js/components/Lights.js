import * as THREE from 'three';

export default class Lights {
  constructor(_options) {
    this.scene = _options.scene;
    this.debug = _options.debug;
    this.camera = _options.camera;

    this.setLights();
  }

  setLights() {
    this.ambientLight = new THREE.AmbientLight({
      color: '#ffffff',
      intensity: 0.1,
    });
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(6.5, 9.1, 7.8);
    this.directionalLightTarget = new THREE.Object3D(0, 0, 0);
    this.directionalLight.target = this.directionalLightTarget;
    this.scene.add(this.directionalLightTarget);
    // this.directionalLight.target.set(0, 0, 0);

    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 30;

    this.directionalLight.shadow.camera.left = -10;
    this.directionalLight.shadow.camera.top = 10;
    this.directionalLight.shadow.camera.right = 10;
    this.directionalLight.shadow.camera.bottom = -10;

    this.scene.add(this.directionalLight);

    this.directionalLightCameraHelper = new THREE.CameraHelper(
      this.directionalLight.shadow.camera
    );
    // this.scene.add(this.directionalLightCameraHelper);

    this.camera.on('cameratransitionstart', () => {
      console.log('cameratransitionstart');

      this.directionalLight.shadow.mapSize.set(512, 512);
    });
    this.camera.on('cameracontrolend', () => {
      console.log('cameracontrolend');

      this.directionalLight.shadow.mapSize.set(1024, 1024);
    });

    if (this.debug) {
      this.debugFolderLight = this.debug.addFolder('Directional Light');
      this.debugFolderLight
        .add(this.directionalLight.position, 'x')
        .min(-10)
        .max(20)
        .step(0.1)
        .name('Light x');
      this.debugFolderLight
        .add(this.directionalLight.position, 'y')
        .min(-10)
        .max(20)
        .step(0.1)
        .name('Light y');
      this.debugFolderLight
        .add(this.directionalLight.position, 'z')
        .min(-10)
        .max(20)
        .step(0.1)
        .name('Light z');
      this.debugFolderLight
        .add(this.directionalLightTarget.position, 'x')
        .min(-10)
        .max(20)
        .step(0.1)
        .name('Light x');
      this.debugFolderLight
        .add(this.directionalLightTarget.position, 'y')
        .min(-10)
        .max(20)
        .step(0.1)
        .name('Light y');
      this.debugFolderLight
        .add(this.directionalLightTarget.position, 'z')
        .min(-10)
        .max(20)
        .step(0.1)
        .name('Light z');
      this.debugFolderLight.close();
    }
  }
}
