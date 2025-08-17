const socket = io();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const players = {};

socket.on("player-joined", (id) => {
  if (!players[id]) {
    const newCube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));
    scene.add(newCube);
    players[id] = newCube;
  }
});

socket.on("player-moved", ({ id, position }) => {
  if (players[id]) {
    players[id].position.set(position.x, position.y, position.z);
  }
});

socket.on("player-left", (id) => {
  if (players[id]) {
    scene.remove(players[id]);
    delete players[id];
  }
});

let pos = { x: 0, y: 0, z: 0 };
document.addEventListener("keydown", (e) => {
  if (e.key ===
