import * as THREE from 'three';

export const vars = {
  customizerDom: document.querySelector('.customizer'),
  customizerLocationsDom: document.querySelector('.customizer__locations'),
  customizerCarsDom: document.querySelector('.customizer__cars'),
  customizerGirlsDom: document.querySelector('.customizer__girls'),

  locationClass: 'customizer__locations-item',
  carClass: 'customizer__cars-item',
  girlClass: 'customizer__girls-item',
};

export const objectsData = {
  locations: {
    desert: {
      name: 'Desert',
      source: '/assets/models/desert.glb',
      position: new THREE.Vector3(-15, -1.7, -9),
      scale: new THREE.Vector3(0.25, 0.25, 0.25),
      rotation: new THREE.Euler(0, Math.PI * 0.66, 0),
      envMapSource: '/assets/envMaps/sf/',
      envMapType: 'cube',
    },
    track: {
      name: 'Track',
      source: '/assets/models/empty.glb',
      position: new THREE.Vector3(-15, -1.7, -9),
      scale: new THREE.Vector3(0.25, 0.25, 0.25),
      rotation: new THREE.Euler(0, Math.PI * 0.66, 0),
      envMapSource: '/assets/envMaps/room/',
      envMapType: 'cube',
    },
  },
  cars: {
    hummer: {
      name: 'Hummer',
      source: '/assets/models/hummerhx4.glb',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(0.08, 0.08, 0.08),
      rotation: new THREE.Euler(0, Math.PI * -0.5, 0),
      lensflares: [
        { x: -24.8, y: 40.8, z: -76.9, name: 'left' },
        { x: 24.8, y: 40.8, z: -76.9, name: 'right' },
      ],
    },
    cruiser: {
      name: 'Land Cruiser',
      source: '/assets/models/landcruiser/landcruiser.glb',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(2, 2, 2),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    delorean: {
      name: 'DeLorean',
      source: '/assets/models/delorean.glb',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(2.5, 2.5, 2.5),
      rotation: new THREE.Euler(0, 0, 0),
    },
    porsche: {
      name: 'Porsche',
      source: '/assets/models/porsche/porsche.glb',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(3.5, 3.5, 3.5),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
  },
  girls: {
    girl1: {
      name: 'Girl 1',
      source: '/assets/models/girl1.glb',
      position: new THREE.Vector3(5, 0, 6),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    girl2: {
      name: 'Girl 2',
      source: '/assets/models/girl2.glb',
      position: new THREE.Vector3(5, 0, 6),
      scale: new THREE.Vector3(4, 4, 4),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    girl3: {
      name: 'Girl 3',
      source: '/assets/models/girl3.glb',
      position: new THREE.Vector3(5, 0.5, 6),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    helmet: {
      name: 'Helmet',
      source: '/assets/models/helmet/DamagedHelmet.gltf',
      position: new THREE.Vector3(5, 3, 9.5),
      scale: new THREE.Vector3(2.5, 2.5, 2.5),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
  },
};

export const customizerData = {
  desert: {
    name: 'Location 1',
    location: 'desert',
    cars: ['hummer', 'cruiser', 'porsche', 'delorean'],
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
  },
  track: {
    name: 'Location 2',
    location: 'track',
    cars: ['hummer', 'cruiser', 'porsche', 'delorean'],
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
  },
};

export let debugObject = {
  needsUpdate: false,
  envMapIntensity: 1,
  exposure: 1,
  removeCar: () => {
    this.removeCar();
  },
  reloadCar: () => {
    this.world.reloadCar();
  },
};
