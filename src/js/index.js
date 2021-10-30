import App from './components/App.js';



// some svg magic. SVG to shadow root
function requireAll(r) {
  r.keys().forEach(r);
}
requireAll(require.context('../svg/', true, /\.svg$/));

// DOCUMENT READY
// COMMON SCRIPTS
window.application = new App();

