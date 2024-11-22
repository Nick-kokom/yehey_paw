import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';


/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const rockTextures = [
    textureLoader.load('/public/rock1.jpg'), // Replace with actual URL for rock texture 1
    textureLoader.load('/public/rock2.jpg'), // Replace with actual URL for rock texture 2
    textureLoader.load('/public/rock3.jpg'), // Replace with actual URL for rock texture 3
];

const earthTexture = textureLoader.load('/public/island.jpeg'); // Replace with your Earth texture URL

// Load background texture
const backgroundTexture = textureLoader.load('/public/try.jpg'); // Replace with your background image URL
scene.background = backgroundTexture; // Set the background texture

/**
 * Earth (Sphere)
 */
const sphereGeometry = new THREE.SphereGeometry(2, 40, 40);
const sphereMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

/**
 * Rock Ring
 */
const rockRing = new THREE.Group(); // Group to hold all rocks

const rockCount = 300; // Number of rocks
const innerRadius = 3.5; // Inner radius of the ring
const outerRadius = 5; // Outer radius of the ring

for (let i = 0; i < rockCount; i++) {
    // Create each rock
    const rockGeometry = new THREE.SphereGeometry(Math.random() * 0.1 + 0.05, 8, 8); // Random size
    const randomTexture = rockTextures[Math.floor(Math.random() * rockTextures.length)]; // Randomly pick a texture
    const rockMaterial = new THREE.MeshStandardMaterial({
        map: randomTexture,
        roughness: 1,
        metalness: 0,
    });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);

    // Random position in the ring
    const angle = Math.random() * Math.PI * 3; // Random angle
    const distance = THREE.MathUtils.lerp(innerRadius, outerRadius, Math.random()); // Random distance between inner and outer radius
    rock.position.set(Math.cos(angle) * distance, Math.random() * 0.1 - 0.08, Math.sin(angle) * distance); // Small random Y offset

    // Random rotation
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    // Add to the group
    rockRing.add(rock);
}

// Add the ring to the scene
scene.add(rockRing);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0x0b6a3c, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x1b8a52, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Rotate the rock ring
    rockRing.rotation.y = elapsedTime * 0.1;

    // Rotate the sphere continuously
    sphere.rotation.y += 0.001; // Adjust the speed of rotation as needed
    sphere.rotation.x += 0.005; // Optional, rotate on X-axis as well

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
