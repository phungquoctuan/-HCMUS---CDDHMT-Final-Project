import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Background texture
import starsTexture from './src/img/stars.jpg';
// Sun texture
import sunTexture from './src/img/sun.jpg';
// Planet texture
import mercuryTexture from './src/img/mercury.jpg';
import venusTexture from './src/img/venus.jpg';
import earthTexture from './src/img/earth.jpg';
import marsTexture from './src/img/mars.jpg';
import jupiterTexture from './src/img/jupiter.jpg';
import saturnTexture from './src/img/saturn.jpg';
import saturnRingTexture from './src/img/saturn ring.png';
import uranusTexture from './src/img/uranus.jpg';
import uranusRingTexture from './src/img/uranus ring.png';
import neptuneTexture from './src/img/neptune.jpg';

// Satellite
import earthMoonTexture from './src/img/earthmoon.jpg';

// Setting up orbit control
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Creating a scene to add all elements
const scene = new THREE.Scene();

// Creating a camera instance
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1, 1000
);

// Setting up texture loader
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture
]);

// Setting up orbit control
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

// Seting up light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Loading planets
const textureload = new THREE.TextureLoader();

// Sun
const sunGeo = new THREE.SphereGeometry(12, 25, 20);
const sunMat = new THREE.MeshBasicMaterial({ map: textureload.load(sunTexture) });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Adding point light
const pointLight = new THREE.PointLight(0xffffff, 3, 300);
scene.add(pointLight);

// Loading another planets now
function createPlanet(size, texture, position, ring, naturalSatellite) {
  const geometry = new THREE.SphereGeometry(size, 25, 20);
  const material = new THREE.MeshStandardMaterial({ map: textureload.load(texture) });
  const planet = new THREE.Mesh(geometry, material);
  const planetObj = new THREE.Object3D;

  planetObj.add(planet);
  scene.add(planetObj);
  planet.position.x = position;

  // Create Planet Ring if need
  if (ring) {
    const RingGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius, 30
    );
    const RingMat = new THREE.MeshStandardMaterial({
      map: textureload.load(ring.texture),
      side: THREE.DoubleSide
    });

    const Ring = new THREE.Mesh(RingGeo, RingMat);
    planetObj.add(Ring);

    Ring.position.x = position;
    Ring.rotation.x = -0.5 * Math.PI;
  }

  // Create Natural Satellite Ring if need
  if (naturalSatellite) {
    const geometry = new THREE.SphereGeometry(naturalSatellite.size, 25, 20);
    const material = new THREE.MeshStandardMaterial({ map: textureload.load(naturalSatellite.texture) });

    const satellite = new THREE.Mesh(geometry, material);
    satellite.position.x = position;

    const satelliteObj = new THREE.Object3D;
    satelliteObj.add(satellite)
    planetObj.add(satelliteObj);

    return { planet, planetObj, satellite, satelliteObj };
  }

  return { planet, planetObj };
}

function planetMotion(θ, au, e) {
  // Tính khoảng cách giữa hành tinh và Mặt Trời
  let r = (au * (1 - e ** 2) / (1 + e * Math.cos(θ)));

  // Xác định vị trí của hành tinh trên màn hình
  let x = r * Math.cos(θ);
  let y = r * Math.sin(θ);

  // Trả về vị trí của hành tinh
  return { x, y };
}

// Planet distance from the sun
const mercuryDistance = 30
const venusDistance = 50
const earthDistance = 80
const marsDistance = 120
const jupiterDistance = 150
const saturnDistance = 190
const uranusDistance = 250
const neptuneDistance = 300

// Ellipse motion setup
const mercuryPos = planetMotion(0, mercuryDistance, 0.21).x
const mercury = new createPlanet(4, mercuryTexture, mercuryPos);

const venusPos = planetMotion(0, venusDistance, 0.007).x
const venus = new createPlanet(5, venusTexture, venusPos);

const earthPos = planetMotion(0, earthDistance, 0.017).x
const earth = new createPlanet(5.56, earthTexture, earthPos, null, {
  size: 1.39,
  texture: earthMoonTexture,
  planetDistance: 3,
});

const marsPos = planetMotion(0, marsDistance, 0.093).x
const mars = new createPlanet(5, marsTexture, marsPos);

const jupiterPos = planetMotion(0, jupiterDistance, 0.049).x
const jupiter = new createPlanet(6, jupiterTexture, jupiterPos);

const saturnPos = planetMotion(0, saturnDistance, 0.055).x
const saturn = new createPlanet(8, saturnTexture, saturnPos, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture
});

const uranusPos = planetMotion(0, uranusDistance, 0.047).x
const uranus = new createPlanet(8.2, uranusTexture, uranusPos, {
  innerRadius: 10,
  outerRadius: 20,
  texture: uranusRingTexture
});

const neptunePos = planetMotion(0, neptuneDistance, 0.009).x
const neptune = new createPlanet(5, neptuneTexture, neptunePos);

// Planet speed
const mercurySpeed = 0.002;
const venusSpeed = 0.0008;
const earthSpeed = 0.0005;
const marsSpeed = 0.00026;
const jupiterSpeed = 0.00004;
const saturnSpeed = 0.00002;
const uranusSpeed = 0.00001;
const neptuneSpeed = 0.000003;

function animate() {
  const mercuryTime = mercurySpeed * performance.now();
  const venusTime = venusSpeed * performance.now();
  const earthTime = earthSpeed * performance.now();
  const marsTime = marsSpeed * performance.now();
  const jupiterTime = jupiterSpeed * performance.now();
  const saturnTime = saturnSpeed * performance.now();
  const uranusTime = uranusSpeed * performance.now();
  const neptuneTime = neptuneSpeed * performance.now();

  sun.rotateY(0.02);

  let mercuryMotion = planetMotion(mercuryTime, mercuryDistance, 0.2)
  mercury.planet.rotateY(0.001);
  mercury.planetObj.position.x = mercuryMotion.x - mercuryDistance
  mercury.planetObj.position.z = mercuryMotion.y

  let venusMotion = planetMotion(venusTime, venusDistance, 0.0685)
  venus.planet.rotateY(0.0012);
  venus.planetObj.position.x = venusMotion.x - venusDistance
  venus.planetObj.position.z = venusMotion.y

  let earthMotion = planetMotion(earthTime, earthDistance, 0.016)
  earth.planet.rotateY(0.012);
  earth.planetObj.position.x = earthMotion.x - earthDistance
  earth.planetObj.position.z = earthMotion.y

  earth.satellite.rotateY(0.012);
  const moonDistance = 9;
  const moonSpeed = 10; // Disatance between the midlle of the moon and the middle of the earth 
  const angle = earth.planetObj.rotation.y;
  earth.satelliteObj.position.x = Math.cos(angle * moonSpeed) * moonDistance;
  earth.satelliteObj.position.z = Math.sin(angle * moonSpeed) * moonDistance;

  let marsMotion = planetMotion(marsTime, marsDistance, 0.09)
  mars.planet.rotateY(0.013);
  mars.planetObj.position.x = marsMotion.x - marsDistance
  mars.planetObj.position.z = marsMotion.y

  let jupiterMotion = planetMotion(jupiterTime, jupiterDistance, 0.0489)
  jupiter.planet.rotateY(0.04);
  jupiter.planetObj.position.x = jupiterMotion.x - jupiterDistance
  jupiter.planetObj.position.z = jupiterMotion.y

  let saturnMotion = planetMotion(saturnTime, saturnDistance, 0.0545)
  saturn.planet.rotateY(0.04);
  saturn.planetObj.position.x = saturnMotion.x - saturnDistance
  saturn.planetObj.position.z = saturnMotion.y

  let uranusMotion = planetMotion(uranusTime, uranusDistance, 0.0466)
  uranus.planet.rotateY(0.012);
  uranus.planetObj.position.x = uranusMotion.x - uranusDistance
  uranus.planetObj.position.z = uranusMotion.y

  let neptuneMotion = planetMotion(neptuneTime, neptuneDistance, 0.0085)
  neptune.planet.rotateY(0.01);
  neptune.planetObj.position.x = neptuneMotion.x - neptuneDistance
  neptune.planetObj.position.z = neptuneMotion.y

  orbit.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Setting window size
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


