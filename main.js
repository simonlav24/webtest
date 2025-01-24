import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


const scene = new THREE.Scene();
//const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 500; // Size of the camera frustum

// camera
const camera = new THREE.OrthographicCamera(
    -frustumSize * aspect / 2, // left
    frustumSize * aspect / 2,  // right
    frustumSize / 2,           // top
    -frustumSize / 2,          // bottom
    0.1,                       // near
    1000                       // far
);

camera.position.set(500, 250, 500); // Adjust to your scene size
camera.lookAt(0, 0, 0); // Point the camera at the center of the scene

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// light
const ambientLight = new THREE.AmbientLight(0xbaf7ff, 0.1);
//scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xfffede, 1);
light.position.set(0, 5, 5).normalize();
//scene.add(light);

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 2 );
hemiLight.position.set( 0, 100, 0 );
scene.add( hemiLight );


camera.position.z = 500;


const loader = new OBJLoader();
let path = 'models/simonThreeJs.obj';

let loadedObject;
let laptop;

let group = new THREE.Group();
scene.add(group);



loader.load(
    // resource URL
    path,
    // called when resource is loaded
    function ( object ) {
        
        console.log(object);
        loadedObject = object;
        group.add( object );

        laptop = object.getObjectByName('simon laptop'); 

        laptop.castShadow = true; // Enable shadow casting

        object.getObjectByName('Cube').receiveShadow = true; // Enable shadow receiving

    },
    // called when loading is in progress
    function ( xhr ) {

        //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);

function animate() {
	renderer.render( scene, camera );

    //if(loadedObject)
        //loadedObject.rotation.y += 0.01;

    if(laptop)
    {
        laptop.axis = new THREE.Vector3(100, 100, 0);
        laptop.rotation.y += 0.01;
    }

    if(group)
    {
        //group.rotation.y += 0.01;
    }

}
renderer.setAnimationLoop( animate );