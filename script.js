// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a rotating cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Add interactivity (mouse movement to rotate the cube)
document.addEventListener('mousemove', (event) => {
  cube.rotation.x = event.clientY / window.innerHeight * Math.PI;
  cube.rotation.y = event.clientX / window.innerWidth * Math.PI;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01; // Keeps the cube rotating slowly
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
