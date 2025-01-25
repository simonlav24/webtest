import * as THREE from 'three';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { detectFlick } from './src/gestures.js';

window.addEventListener('resize', onWindowResize, false);

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

// listeners

let rightFlick = false;
let leftFlick = false;
let animatingRoom = false;
let roomRotation = 0;

let mouseStartX = 0;
let mouseStartY = 0;
let mouseStartTime = 0;

document.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    mouseStartTime = Date.now();
});

document.addEventListener('touchstart', (e) => {
    const touch = e.changedTouches[0];
    mouseStartX = touch.clientX;
    mouseStartY = touch.clientY;
    mouseStartTime = Date.now();
});

document.addEventListener('touchend', (e) => {
    console.log(e)
    const touch = e.changedTouches[0];
    handleFlick(mouseStartX, mouseStartY, touch.clientX, touch.clientY, mouseStartTime, Date.now());
});

document.addEventListener('mouseup', (e) => {
    console.log(e)
    handleFlick(mouseStartX, mouseStartY, e.clientX, e.clientY, mouseStartTime, Date.now());
});

function handleFlick(startX, startY, endX, endY, startTime, endTime) {
    if(animatingRoom)
        return;
    let vec = detectFlick(startX, startY, endX, endY, startTime, endTime);
    if(vec[0] == 1)
    {
        rightFlick = true;
        animatingRoom = true;
    }
    else if(vec[0] == -1)
    {
        leftFlick = true;
        animatingRoom = true;
    }
}

function animate() {
    //controls.update();
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

    if(animatingRoom)
    {
        if(rightFlick)
        {
            roomRotation += 0.1;
            group.rotation.y = roomRotation;
        }
        if (leftFlick)
        {
            roomRotation -= 0.1;
            group.rotation.y = roomRotation;
        }
        if(roomRotation >= Math.PI * 2 || roomRotation <= -Math.PI * 2)
        {
            animatingRoom = false;
            rightFlick = false;
            leftFlick = false;
            roomRotation = 0;
        }
    }

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    console.log( 'resize' );

    renderer.setSize( window.innerWidth, window.innerHeight );

}

renderer.setAnimationLoop( animate );