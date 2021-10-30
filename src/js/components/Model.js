// load specified car model from file.
// todo ability to pass model url and load differenc models with this class

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const loadModel = async () => {
  const loader = new GLTFLoader();

  const modelData = await loader.loadAsync('/assets/models/hummerhx4.glb');
  // const modelData = await loader.loadAsync('/assets/models/hummerhx4.glb');
  // const modelData = await loader.loadAsync('/assets/models/test.gltf');

  console.log('Squaaawk! Model Loaded');

  // return modelData;

  const model = setupModel(modelData);

  return { model };
};

export const setupModel = (data) => {
  // ADD Whole Scene
  return data.scene;

  // Add objects one by one
  // const model = [];
  // data.scene.children.forEach((element) => {
  //   model.push(element);
  // });

  // return model;
};
