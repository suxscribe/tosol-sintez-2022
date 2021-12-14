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
  customizerGirlsParamsButton: document.querySelector(
    '.customizer__button--girls-params'
  ),
  customizerCarColorsElements: document.querySelectorAll(
    '.customizer__car-color'
  ),
  customizerGerenateButtonDom: document.querySelector(
    '.customizer__generate-button'
  ),
  screenshoterLinkImageDom: document.querySelector(
    '.customizer__screenshoter-link--1'
  ),
  screenshoterLinkPageDom: document.querySelector(
    '.customizer__screenshoter-link--2'
  ),
  screenshotHolderDownloadDom: document.querySelector(
    '.screenshot__holder--download'
  ),
  screenshotHolderShareDom: document.querySelector(
    '.screenshot__holder--share'
  ),
  screenshotHolderGiftDom: document.querySelector('.screenshot__holder--gift'),
  preloaderProgressDom: document.querySelector('.preloader__progress'),
  formDom: document.querySelector('#form-gift'),
  formInputScreenshotDom: document.querySelector('#form-screenshot'),
  formInputCalendarCheckbox: document.querySelector('#screenshot-calendar'),
  formGiftCodeInputDom: document.querySelector('#form-code'),
  formGiftCodeMatch: 'CUSTOM',
  modalGiftId: 'modal-gift',
  modalSentId: 'modal-sent',

  domain: 'https://constructor.ts-2022.ru/',

  customizerButtonClass: 'customizer__button',
  customizerControlBarClass: 'customizer__control-bar',
  locationClass: 'customizer__locations-item',
  carClass: 'customizer__cars-item',
  girlClass: 'customizer__girls-item',
  spriteGirlClass: 'customizer__sprite-girls-item',
  girlParamsPoseClass: 'customizer__girls-pose-item',
  visibleClass: 'visible',
  screenshotUrlPart: 'script.php?c=view&image=',
  screenshotMime: 'image/jpeg',
  spriteGirlShift: 0.3,
};

export const objectsData = {
  locations: {
    studio: {
      name: 'Studio',
      source: '/assets/models/loc-studio.glb',
      preview: '/assets/images/previews/loc-studio.jpg',
      position: new THREE.Vector3(-1.7, -0.02, 1.8),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
      envMapSource: '/assets/envMaps/bw/',
      envMapType: 'cube',
    },
    track: {
      name: 'Studio 2',
      source: '/assets/models/loc-studio-mono.glb',
      preview: '/assets/images/previews/loc-studio-mono.jpg',
      position: new THREE.Vector3(-1.7, -0.02, 1.8),
      scale: new THREE.Vector3(1.5, 1.5, 1.5),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
      envMapSource: '/assets/envMaps/bw/',
      envMapType: 'cube',
    },
  },
  cars: {
    porsche: {
      name: 'Porsche',
      source: '/assets/models/porsche.glb',
      preview: '/assets/images/previews/car-porsche.jpg',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(0.03, 0.03, 0.03),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    ferrari: {
      name: 'Ferrari',
      source: '/assets/models/ferrari.glb',
      preview: '/assets/images/previews/car-ferrari.jpg',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    lamborgini: {
      name: 'Lamborgini',
      source: '/assets/models/lamborgini-12.glb',
      preview: '/assets/images/previews/car-lamborgini.jpg',
      position: new THREE.Vector3(0, 0.0, 0),
      scale: new THREE.Vector3(0.3, 0.3, 0.3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
  },
  girls: {
    girl1: {
      name: 'Girl 1',
      source: '/assets/models/girl1.glb',
      preview: '',
      position: new THREE.Vector3(5, 0, 6),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    girl2: {
      name: 'Girl 2',
      source: '/assets/models/girl2.glb',
      preview: '',
      position: new THREE.Vector3(5, 0, 6),
      scale: new THREE.Vector3(4, 4, 4),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    girl3: {
      name: 'Girl 3',
      source: '/assets/models/girl3.glb',
      preview: '',
      position: new THREE.Vector3(5, 0.5, 6),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    helmet: {
      name: 'Helmet',
      source: '/assets/models/helmet/DamagedHelmet.gltf',
      preview: '',
      position: new THREE.Vector3(5, 3, 9.5),
      scale: new THREE.Vector3(2.5, 2.5, 2.5),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    empty: {
      name: 'Empty',
      source: '/assets/models/empty.glb',
      preview: '',
      position: new THREE.Vector3(5, 3, 9.5),
      scale: new THREE.Vector3(2.5, 2.5, 2.5),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
  },
  spritegirls: {
    girl0: {
      name: 'Без девушки',
      source: '',
      preview: '/assets/images/previews/girl0.jpg',
      center: new THREE.Vector2(0.5, 0.5),
      position: new THREE.Vector3(0.8, -0.05, -3),
      scale: new THREE.Vector3(1, 1, 1),
      clothing: {},
    },
    girl1: {
      name: 'Girl 1',
      source: '/assets/textures/girl1.png',
      preview: '/assets/images/previews/girl1.jpg',
      center: new THREE.Vector2(0.5, 0.5),
      position: new THREE.Vector3(0.8, -0.05, -3),
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
      name: 'Без девушки',
      source: '',
      preview: '/assets/images/previews/soon.jpg',
      center: new THREE.Vector2(0.5, 0.5),
      position: new THREE.Vector3(0.8, -0.05, -3),
      scale: new THREE.Vector3(1, 1, 1),
      clothing: {},
    },
    girl3: {
      name: 'Без девушки',
      source: '',
      preview: '/assets/images/previews/soon.jpg',
      center: new THREE.Vector2(0.5, 0.5),
      position: new THREE.Vector3(0.8, -0.05, -3),
      scale: new THREE.Vector3(1, 1, 1),
      clothing: {},
    },
  },
  calendar: {
    name: 'Calendar',
    source: '/assets/textures/calendar.png',
    preview: '',
    center: new THREE.Vector2(1, 0.5),
    position: new THREE.Vector3(0.0, 0.0, 1),
    scale: undefined,
    isOrtho: true,
    align: 'right',
  },
  logo: {
    name: 'Logo',
    source: '/assets/textures/felix_graphic.png',
    preview: '',
    center: new THREE.Vector2(0, 0.5),
    position: new THREE.Vector3(0.0, 0.0, 1),
    scale: undefined,
    isOrtho: true,
    align: 'left',
  },
  grain: {
    name: 'Grain',
    source: '/assets/textures/grain-background-2.png',
    preview: '',
    center: new THREE.Vector2(0.5, 0.5),
    position: new THREE.Vector3(0, 0, -0.65),
    scale: new THREE.Vector3(1, 1, 1),
    repeat: true,
  },
};

export const customizerData = {
  studio: {
    name: 'Студия',
    location: 'studio',
    cars: ['lamborgini', 'porsche', 'ferrari'],
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: ['girl0', 'girl1', 'girl2', 'girl3'],
  },
  track: {
    name: 'Пустая',
    location: 'track',
    cars: ['lamborgini', 'porsche', 'ferrari'],
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: ['girl0', 'girl1', 'girl2', 'girl3'],
  },
};

export let debugObject = {
  needsUpdate: false,
  envMapIntensity: 1,
  exposure: 1,
  pixelRatio: Math.min(Math.max(window.devicePixelRatio, 2), 1),
  cameraInitMovementCompleted: false,
  needsToggleCalendar: false,
  selects: [],
  carPaintMaterials: ['paint', 'CarPaint'],
  excludedMaterials: [
    'TIRE1.1',
    'TIRE1.2',
    'Tire_',
    'WallRight.1',
    'WallLeft.1',
    'WallBack.1',
    'Pipes2.1',
    'RimsColor_',
    'RimsColor',
    'plane_01',
    'plane_02',
    'plane_03',
    'plane_04',
    'BG',
    'disk',
    'brake',
  ],
  giftScreenshotSize: {
    width: 3840,
    height: 2160,
  },
  includedMaterials: ['paint', 'CarPaint', 'CarPaint_'],
  shadowMaterials: ['shadow', 'watter', 'Shadow_'],
  bloomIntensity: 0,
  showStats: false,
  showDebug: false,
};
