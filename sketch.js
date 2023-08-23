const canvasSketch = require('canvas-sketch');
global.THREE = require('three');

const anime=require('animejs')
require('three/examples/js/controls/OrbitControls');

// Подключаем управление объектами на сцене
require('three/examples/js/controls/OrbitControls');

/* УРОК 2-3 / Добавим загрузчик шрифтов */
require('three/examples/js/loaders/FontLoader');
require('three/examples/js/geometries/TextGeometry');

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
  const parent = mesh;
  const geomHide = new THREE.SphereBufferGeometry(1.0499, 64, 36);
  const matHide = new THREE.MeshStandardMaterial({color:new THREE.Color(0x091e5a)});
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

  //  const c1=addMapInf([.66,.95,-.28],[.662,.8,-.28],true)
  //
  //  anime({
  //    targets:c1[0].scale,// указываем цель анимации — «scale» — увеличение чего-то
  //    x:[0,1],// увеличивает с 0 до 1 по оси X
  //    y:[0,1],// увеличивает с 0 до 1 по оси Y
  //    z:[0,1],// увеличивает с 0 до 1 по оси Z
  //    duration:2000,// время выполнения самой анимации
  //    delay:1100,// задержка перед выполнением анимации
  //    easing:'easeOutBounce' // тип перехода анимации — лучше всего выбирать «linear»
  //  });
  //
  //  anime({targets:c1[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:2000,easing:'linear'});
  const fontLoader=new THREE.FontLoader();
  fontLoader.load('fonts/font-roboto.json', font =>{
      function createText(text,pos,rot,size,font,color=0xffffff){
        text=new String(text);
        const textGeo = new THREE.TextGeometry(text,{
          font,
          size,
          height: .015,
          curveSegments: 12,
          /* bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5 */
        } );
        const textMaterial=new THREE.MeshBasicMaterial({
            color,
            side:THREE.FrontSide
        });
        text=new THREE.Mesh(textGeo,textMaterial);
        text.position.set(pos[0],pos[1],pos[2]);
        text.rotation.set(rot[0],rot[1],rot[2]);
        /* text.updateMatrix(); */
        scene.add(text);
        parent.add(text);
        return text;
    }
      const txt1=createText('Center of the Earth',[-.64,1.0499,-.3],[0,1.75,0],.05,font) //[приближение/отдаление объекта, высота, влево сдвигается объект приувелечении]
      const txt2=createText('Saint-Petersburg',[-.64,.95,-.3],[0,1.75,0],.05,font,0x6f98fc);

      const mainPos=[.662,.8,-.28];
      anime.timeline().add({
          targets:txt1.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
      }).add({
          targets:txt2.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,delay:1000,easing:'linear',complete:()=>{
              //(main) колбэк для очерёдности запуска анимации текста и фигур
              let c1=addMapInf([.66,.95,-.28],mainPos,true);
              anime({targets:c1[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
              anime({targets:c1[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
          }
        })
  });
  //\TEXT+
  /* \ !!!WARN!!! Planet 2-3 */
  const loader = new THREE.TextureLoader();

  // load a resource
  loader.load(
      'png/logo.png',
      function ( texture ) {
          const material = new THREE.MeshBasicMaterial( {
              map: texture,
              side: THREE.DoubleSide,
              alphaTest:.4
          });
          const meshTexture = new THREE.Mesh(
              new THREE.PlaneGeometry(1,.235),//[ширина фотографии, высота фотографии]
              material
          );
          meshTexture.position.set(.62,1.065,-.41); //[приближение/отдаление объекта, высота, влево сдвигается объект приувелечении]
          meshTexture.rotation.set(0,1.95,0); //наклоны 
          meshTexture.scale.set(0,0,0);
          scene.add(meshTexture)
          parent.add(meshTexture)
          anime({targets:meshTexture.scale,x:[0,.2],y:[0,.2],z:[0,1],duration:600,easing:'linear'})
      },
      undefined,
      function ( e ) {
          console.error( e );
      }
  );
    // draw each frame
return {
  // Handle resize events here
  resize ({ pixelRatio, viewportWidth, viewportHeight }) {
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(viewportWidth, viewportHeight);
    camera.aspect = viewportWidth / viewportHeight;
    camera.updateProjectionMatrix();
  },
  // And render events here
  render ({ time, deltaTime }) {
    //mesh.rotation.y = time * (10 * Math.PI / 180);
    // Включаем копирование кватерниона камеры для группы Светов! чтобы Света не вращались вместе с другими объектами, когда мы их вращаем мышью / пальцами
    lightHolder.quaternion.copy(camera.quaternion);
    //controls.update();
    renderer.render(scene, camera);
  },
  // Dispose of WebGL context (optional)
  unload () {
    renderer.dispose();
  }
};
};

canvasSketch(sketch, settings);