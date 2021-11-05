const customizerDom = document.querySelector('.customizer');
const customizerLocationsDom = document.querySelector('.customizer__locations');
const customizerCarsDom = document.querySelector('.customizer__cars');
const customizerGirlsDom = document.querySelector('.customizer__girls');

const carClass = 'customizer__car';
const girlClass = 'customizer__girl';

export const renderCarsList = () => {
  if (customizerCarsDom) {
    customizerCarsDom.innerHTML = '';

    this.config.location.cars.forEach((car) => {
      console.log(car);
    });
  }
};
