const canvasSketch = require('canvas-sketch');
global.THREE = require('three');

const anime=require('animejs')
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
  camera.setViewOffset(10, 10, -2, .5, 9, 9)

  const controls = new THREE.OrbitControls(camera, context.canvas);
  const scene = new THREE.Scene();
  const lightHolder = new THREE.Group();
  const aLight=new THREE.DirectionalLight(0xffffff,2);

  aLight.position.set(-1.5,1.7,.7);

  lightHolder.add(aLight);

  const aLight2=new THREE.DirectionalLight(0xffffff,2);
  aLight2.position.set(-1.5,0.3,.7);
  lightHolder.add(aLight2);

  const geometry = new THREE.IcosahedronGeometry(1.0,2);
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

    scene.add(mesh)
    function addMapInf(posCil1,posCir2,main=false){
      let mainSize=
          mSC=null,
          color=0x008DFB;
      if(main){
          mainSize=[.004,.004,.3,3];
          mSC=[.017,24];
          color=0x86c3f9
      }else{ 
          mainSize=[.002,.002,.16,4]
          mSC=[.01,12]
      };
      const cyl=new THREE.CylinderBufferGeometry(mainSize[0],mainSize[1],mainSize[2],mainSize[3]);
      const cylinder=new THREE.Mesh(
        cyl,
        new THREE.MeshBasicMaterial({color})
      );
      

      cylinder.position.set(posCil1[0],posCil1[1],posCil1[2]);

      parent.add(cylinder);
      if(posCir2==''){return [cylinder]}

      const circLocation = new THREE.CircleBufferGeometry(mSC[0],mSC[1]);

      const circleLocation = new THREE.Mesh(
          circLocation,
          new THREE.MeshBasicMaterial({color, side: THREE.DoubleSide})
      );

      circleLocation.position.set(posCir2[0],posCir2[1],posCir2[2]);

      circleLocation.lookAt(new THREE.Vector3());

      //scene.add(circleLocation);

      parent.add(circleLocation);

      return [cylinder,circleLocation]
    }

    const c1=addMapInf([.66,.95,-.28],[.662,.8,-.28],true)

    anime({
      targets:c1[0].scale,// указываем цель анимации — «scale» — увеличение чего-то
      x:[0,1],// увеличивает с 0 до 1 по оси X
      y:[0,1],// увеличивает с 0 до 1 по оси Y
      z:[0,1],// увеличивает с 0 до 1 по оси Z
      duration:2000,// время выполнения самой анимации
      delay:1100,// задержка перед выполнением анимации
      easing:'easeOutBounce' // тип перехода анимации — лучше всего выбирать «linear»
    });

    anime({targets:c1[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:2000,easing:'linear'});


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