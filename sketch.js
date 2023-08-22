const canvasSketch = require('canvas-sketch');
global.THREE = require('three');
require('three/examples/js/controls/OrbitControls');

const settings = {
  animate: true,
  context: 'webgl',
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    context
  });


  renderer.setClearColor('#333', 1);


  const camera = new THREE.PerspectiveCamera(12,window.innerWidth / window.innerHeight,.01,100);

  camera.position.set(10.5,4,-3.5);

  camera.setViewOffset(10, 10, -2, 0.5, 9, 9)

  const controls = new THREE.OrbitControls(camera, context.canvas);
  const scene = new THREE.Scene();
  const lightHolder = new THREE.Group();
  const aLight=new THREE.DirectionalLight(0xffffff,2);

  aLight.position.set(-1.5,1.7,.7);

  lightHolder.add(aLight);

  const aLight2=new THREE.DirectionalLight(0xffffff,2);
  aLight2.position.set(-1.5,0.3,.7);
  lightHolder.add(aLight2);

  const geometry = new THREE.IcosahedronGeometry(1.0,2)  
  const materialIcosahedron = new THREE.MeshBasicMaterial({
    opacity: 0,
    transparent: true
  });

  const mesh = new THREE.Mesh(geometry,materialIcosahedron);

  const parent=mesh;

  const geomHide = new THREE.SphereBufferGeometry(1.0499, 64, 36);
  const matHide=new THREE.MeshStandardMaterial({color:new THREE.Color(0x091e5a)});
  const meshHide= new THREE.Mesh(geomHide, matHide);

  scene.add(meshHide);
  scene.add(lightHolder);

  return {
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render ({ time, deltaTime }) {
      lightHolder.quaternion.copy(camera.quaternion);
      renderer.render(scene, camera);
    },
    unload () {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);