import * as THREE from 'three';

export const vars = {
  canvasClass: 'webgl',

  customizerDom: document.querySelector('.customizer'),
  customizerButtonsDom: document.querySelector('.customizer__buttons'),
  customizerLocationsDom: document.querySelector('.customizer__locations'),
  customizerCarsDom: document.querySelector('.customizer__cars'),
  customizerGirlsDom: document.querySelector('.customizer__girls'),
  customizerSpriteGirlsDom: document.querySelector('.customizer__sprite-girls'),
  customizerGirlsParamsDom: document.querySelector('.customizer__girls-params'),
  customizerToggleCalendarDom: document.querySelector(
    '.customizer__toggle-calendar'
  ),
  screenshotHolderDom: document.querySelector('.screenshot__holder'),
  formDom: document.querySelector('#form-gift'),

  customizerControlBarClass: 'customizer__control-bar',
  locationClass: 'customizer__locations-item',
  carClass: 'customizer__cars-item',
  girlClass: 'customizer__girls-item',
  spriteGirlClass: 'customizer__sprite-girls-item',
  girlParamsPoseClass: 'customizer__girls-pose-item',
  visibleClass: 'visible',
};

export const objectsData = {
  locations: {
    underground: {
      name: 'Underground',
      source: '/assets/models/loc-underground.gltf',
      position: new THREE.Vector3(-2.2, 0, 3.1),
      scale: new THREE.Vector3(0.05, 0.05, 0.05),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
      envMapSource: '/assets/envMaps/underground/',
      envMapType: 'cube',
    },
    track: {
      name: 'Track',
      source: '/assets/models/empty.glb',
      position: new THREE.Vector3(-15, -1.7, -9),
      scale: new THREE.Vector3(0.25, 0.25, 0.25),
      rotation: new THREE.Euler(0, Math.PI * 0.66, 0),
      envMapSource: '/assets/envMaps/bw/',
      envMapType: 'cube',
    },
  },
  cars: {
    porsche: {
      name: 'Porsche',
      source: '/assets/models/porsche.glb',
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
    lamborgini: {
      name: 'Lamborgini',
      source: '/assets/models/lamborgini-lite.glb',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(0.3, 0.3, 0.3),
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
      position: new THREE.Vector3(0.6, -0.26, -3),
      scale: new THREE.Vector3(1, 1, 1),
      clothing: {
        clothing1: {
          pose1: {
            source: '/assets/textures/girl0/girl-1-1.webp',
          },
          pose2: {
            source: '/assets/textures/girl0/girl-1-2.webp',
          },
          pose3: {
            source: '/assets/textures/girl0/girl-1-3.webp',
          },
        },
        clothing2: {
          pose1: {
            source: '/assets/textures/girl0/girl-2-1.webp',
          },
          pose2: {
            source: '/assets/textures/girl0/girl-2-2.webp',
          },
          pose3: {
            source: '/assets/textures/girl0/girl-2-3.webp',
          },
        },
        clothing3: {
          pose1: {
            source: '/assets/textures/girl0/girl-3-1.webp',
          },
          pose2: {
            source: '/assets/textures/girl0/girl-3-2.webp',
          },
          pose3: {
            source: '/assets/textures/girl0/girl-3-3.webp',
          },
        },
      },
    },
    girl1: {
      name: 'Girl 1',
      source: '/assets/textures/girl1.png',
      center: new THREE.Vector2(0.5, 0.5),
      position: new THREE.Vector3(0.6, -0.26, -3),
      scale: new THREE.Vector3(1, 1, 1),
      clothing: {
        clothing1: {
          pose1: {
            source: '/assets/textures/girl1/girl-1-1.webp',
          },
          pose2: {
            source: '/assets/textures/girl1/girl-1-2.webp',
          },
          pose3: {
            source: '/assets/textures/girl1/girl-1-3.webp',
          },
        },
        clothing2: {
          pose1: {
            source: '/assets/textures/girl1/girl-2-1.webp',
          },
          pose2: {
            source: '/assets/textures/girl1/girl-2-2.webp',
          },
          pose3: {
            source: '/assets/textures/girl1/girl-2-3.webp',
          },
        },
        clothing3: {
          pose1: {
            source: '/assets/textures/girl1/girl-3-1.webp',
          },
          pose2: {
            source: '/assets/textures/girl1/girl-3-2.webp',
          },
          pose3: {
            source: '/assets/textures/girl1/girl-3-3.webp',
          },
        },
      },
    },
    girl2: {
      name: 'Girl 2',
      source: '/assets/textures/girl2.png',
      center: new THREE.Vector2(0.0, 1.0),
      position: new THREE.Vector3(0.6, -0.26, -3),
      scale: new THREE.Vector3(1, 1, 1),
      clothing: {
        clothing1: {
          pose1: {
            source: '/assets/textures/girl2/girl-1-1.webp',
          },
          pose2: {
            source: '/assets/textures/girl2/girl-1-2.webp',
          },
          pose3: {
            source: '/assets/textures/girl2/girl-1-3.webp',
          },
        },
        clothing2: {
          pose1: {
            source: '/assets/textures/girl2/girl-2-1.webp',
          },
          pose2: {
            source: '/assets/textures/girl2/girl-2-2.webp',
          },
          pose3: {
            source: '/assets/textures/girl2/girl-2-3.webp',
          },
        },
        clothing3: {
          pose1: {
            source: '/assets/textures/girl2/girl-3-1.webp',
          },
          pose2: {
            source: '/assets/textures/girl2/girl-3-2.webp',
          },
          pose3: {
            source: '/assets/textures/girl2/girl-3-3.webp',
          },
        },
      },
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
    name: 'Подземка',
    location: 'underground',
    cars: ['porsche', 'ferrari', 'lamborgini'],
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: ['girl0', 'girl1', 'girl2'],
  },
  track: {
    name: 'Студия',
    location: 'track',
    cars: ['porsche', 'ferrari', 'lamborgini'],
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: ['girl0', 'girl1', 'girl2'],
  },
};

export let debugObject = {
  needsUpdate: false,
  envMapIntensity: 2,
  exposure: 1,
  cameraInitMovementCompleted: false,
  needsToggleCalendar: false,
  selects: [],
  excludedMaterials: [
    'TIRE1.1',
    'TIRE1.2',
    'WallRight.1',
    'WallLeft.1',
    'WallBack.1',
    'watter',
    'Pipes2.1',
  ],
  removeCar: () => {
    this.removeCar();
  },
  reloadCar: () => {
    this.world.reloadCar();
  },
};
