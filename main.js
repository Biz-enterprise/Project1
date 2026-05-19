// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// 1. Setup Three.js Scene, Camera, and Renderer
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

// Add subtle atmospheric ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Add a directional light to create distinct shadows and highlights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Create the 3D Floating Geometry (Simulating abstract product shapes)
const geometryGroup = new THREE.Group();

// Object 1: Cylinder (like the product can in the video)
const cylGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.8, 32);
const material = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.2, metalness: 0.1 });
const cylinder = new THREE.Mesh(cylGeo, material);
cylinder.position.set(0, 0, 0);
geometryGroup.add(cylinder);

// Object 2: Flat box (simulating a product packet)
const boxGeo = new THREE.BoxGeometry(1.5, 2, 0.3);
const packet = new THREE.Mesh(boxGeo, material);
packet.position.set(-2.5, 1, -1);
packet.rotation.set(0.5, 0.5, 0);
geometryGroup.add(packet);

// Object 3: Small floating token
const tokenGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
const token = new THREE.Mesh(tokenGeo, material);
token.position.set(2.5, -1, 0);
token.rotation.x = Math.PI / 2;
geometryGroup.add(token);

scene.add(geometryGroup);

// 3. Animation Framework (GSAP + ScrollTrigger)
// This timeline animates the 3D objects step-by-step as you scroll down the page
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#content",
        start: "top top",
        end: "bottom bottom",
        scrub: 1 // Smoothly links animation progression to scroll momentum
    }
});

tl.to(geometryGroup.rotation, { x: 0.5, y: 2.5, z: 0.2 })
  .to(cylinder.position, { x: 1.5, y: 0.5, z: 1 }, 0)
  .to(packet.position, { x: 0, y: -0.5, z: 2 }, 0)
  .to(packet.rotation, { x: 2, y: 1 }, 0)
  
  // Dynamic transformations as we scroll into the middle sections
  .to(geometryGroup.position, { x: -1.5, y: 0.2 }, ">")
  .to(cylinder.rotation, { x: Math.PI * 2, y: 0 }, "<")
  
  // Final assembly movement for the checkout/contact panel
  .to(geometryGroup.position, { x: 0, y: 0, z: -2 }, ">")
  .to(cylinder.position, { x: 0, y: 1.2, z: 0 }, "<")
  .to(packet.position, { x: -0.8, y: -0.5, z: 0.5 }, "<")
  .to(token.position, { x: 0.8, y: -0.5, z: 0.5 }, "<");

// 4. Render Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();
    
    // Tiny background idle float effect so it feels alive even when resting
    geometryGroup.position.y += Math.sin(elapsedTime * 1.5) * 0.0015;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// 5. Handle Window Resizing gracefully
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
  
