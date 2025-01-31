import * as THREE from 'three';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

import { detectFlick } from './src/gestures.js';
import { handleLoadError} from './src/loading.js';

import {animateChair} from './src/animateOfficeRoom.js';


window.addEventListener('resize', onWindowResize, false);

const clock = new THREE.Clock();
clock.start();

const scene = new THREE.Scene();
//const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 200; // Size of the camera frustum

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

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
//const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(2);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
//renderer.setPixelRatio(0.8);
document.body.appendChild( renderer.domElement );

scene.background = new THREE.Color(0x87ceeb);



// light
const light = new THREE.DirectionalLight( 0xffffff, 2);
light.position.set( -50, 100, 50 );
light.power = 10000;
scene.add( light );

const ambient = new THREE.AmbientLight( 0xffffff, 0.8 );
scene.add( ambient );

camera.position.z = 500;
camera.position.y = 280;


const loader = new FBXLoader();
let path = 'models/mobileyeroom.fbx'; // latest working one

let loadedObject;

let roattedRoomGroup = new THREE.Group();
scene.add(roattedRoomGroup);

let chairGroup;
let animationMixer;

loader.load(
    // resource URL
    path,
    // called when resource is loaded
    function ( object ) {
    
        loadedObject = object;
        let scaleFactor = 0.5
        loadedObject.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        roattedRoomGroup.add( loadedObject );
        

        loadedObject.traverse((child) => {
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide;
            }

            //console.log(child.name);
            if(child.name == 'ShahafAndChair')
            {
                chairGroup = child;
            }

          });
    },
    // called when loading is in progress
    function ( xhr ) {

    },
    // called when loading has errors
    handleLoadError
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

    if(roattedRoomGroup)
    {
        //group.rotation.y += 0.01;
    }

    if(chairGroup)
    {
        animateChair(chairGroup, clock);
        //chairGroup.rotation.y += 0.01;
    }

    if(animatingRoom)
    {
        if(rightFlick)
        {
            roomRotation += 0.1;
            roattedRoomGroup.rotation.y = roomRotation;
        }
        if (leftFlick)
        {
            roomRotation -= 0.1;
            roattedRoomGroup.rotation.y = roomRotation;
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

    renderer.setSize( window.innerWidth, window.innerHeight );
    
    let newAspect = window.innerWidth / window.innerHeight;
    camera.left = -newAspect * frustumSize / 2;
    camera.right = newAspect * frustumSize  / 2;

    camera.updateProjectionMatrix();
}

renderer.setAnimationLoop( animate );