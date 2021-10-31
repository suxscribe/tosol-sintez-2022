import EventEmitter from './../utils/EventEmitter';

export default class Sizes extends EventEmitter {
  constructor(_options) {
    super();

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);

    this.resize();
  }

  resize() {
    // this.width = Math.max(
    //   document.body.scrollWidth,
    //   document.documentElement.scrollWidth,
    //   document.body.offsetWidth,
    //   document.documentElement.offsetWidth,
    //   document.documentElement.clientWidth
    // );
    // this.height = Math.max(
    //   document.body.scrollHeight,
    //   document.documentElement.scrollHeight,
    //   document.body.offsetHeight,
    //   document.documentElement.offsetHeight,
    //   document.documentElement.clientHeight
    // );
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Trigger resize event
    this.trigger('resize');
    // console.log('resize');
    // Update everything on resize
  }
}
