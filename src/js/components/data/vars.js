import * as THREE from 'three';

export const vars = {
  canvasClass: 'webgl',

  customizerDom: document.querySelector('.customizer'),
  customizerLocationsDom: document.querySelector('.customizer__locations'),
  customizerCarsDom: document.querySelector('.customizer__cars'),
  customizerGirlsDom: document.querySelector('.customizer__girls'),
  customizerSpriteGirlsDom: document.querySelector('.customizer__sprite-girls'),
  customizerToggleCalendarDom: document.querySelector(
    '.customizer__toggle-calendar'
  ),

  customizerControlBarClass: 'customizer__control-bar',
  locationClass: 'customizer__locations-item',
  carClass: 'customizer__cars-item',
  girlClass: 'customizer__girls-item',
  spriteGirlClass: 'customizer__sprite-girls-item',
  visibleClass: 'visible',
};

export const objectsData = {
  locations: {
    desert: {
      name: 'Desert',
      source: '/assets/models/empty.glb',
      position: new THREE.Vector3(-15, -1.7, -9),
      scale: new THREE.Vector3(0.25, 0.25, 0.25),
      rotation: new THREE.Euler(0, Math.PI * 0.66, 0),
      envMapSource: '/assets/envMaps/bw/',
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
    ferrari: {
      name: 'Ferrari',
      source: '/assets/models/ferrari.glb',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(0.03, 0.03, 0.03),
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
    empty: {
      name: 'Empty',
      source: '/assets/models/empty.glb',
      position: new THREE.Vector3(5, 3, 9.5),
      scale: new THREE.Vector3(2.5, 2.5, 2.5),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
  },
  spritegirls: {
    girl0: {
      name: 'Без девушки',
      source: '/assets/textures/girl1.png',
      center: new THREE.Vector2(0.5, 0.5),
      position: new THREE.Vector3(0.0, 0.0, 0.0),
      scale: new THREE.Vector3(1, 1, 1),
    },
    girl1: {
      name: 'Girl 1',
      source: '/assets/textures/girl1.png',
      center: new THREE.Vector2(0.5, 0.5),
      position: new THREE.Vector3(0.4, -0.8, -3),
      scale: new THREE.Vector3(1.5, 1.5, 1),
    },
    girl2: {
      name: 'Girl 2',
      source: '/assets/textures/girl2.png',
      center: new THREE.Vector2(0.0, 1.0),
      position: new THREE.Vector3(0.3, 0, -3),
      scale: new THREE.Vector3(1.5, 1.5, 1),
    },
  },
  calendar: {
    name: 'Calendar',
    source: '/assets/textures/calendar.png',
    center: new THREE.Vector2(1, 0.5),
    position: new THREE.Vector3(1.59, 0.0, -3.1),
    scale: new THREE.Vector3(0.9, 0.9, 1),
  },
};

export const customizerData = {
  desert: {
    name: 'Location 1',
    location: 'desert',
    cars: ['hummer', 'cruiser', 'porsche', 'delorean', 'ferrari'],
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: ['girl0', 'girl1', 'girl2'],
  },
  track: {
    name: 'Location 2',
    location: 'track',
    cars: ['hummer', 'cruiser', 'porsche', 'delorean'],
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: ['girl0', 'girl1', 'girl2'],
  },
};

export let debugObject = {
  needsUpdate: false,
  envMapIntensity: 1,
  exposure: 1,
  cameraInitMovementCompleted: false,
  needsToggleCalendar: false,
  removeCar: () => {
    this.removeCar();
  },
  reloadCar: () => {
    this.world.reloadCar();
  },
};
