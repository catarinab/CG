/* global THREE */

var perspCamera, orthoCamera, camera;

var scene, renderer, material

var clock, delta;

// Objects
var planet, dodecahedron1, icosahedron1, octahedron1, sphere1, box1;

const scale = 1;

const movingFactor = 5, rotationFactor = 1;

// Objects Scales
const planetRadius = 36, rocketWingspan = planetRadius / 12, trashWingspan = planetRadius / 20, objectOrbit = planetRadius * 1.2;

function sphericalSet(object, radius, theta, phi) {
    let x = radius * Math.cos(theta) * Math.sin(phi);
    let z = radius * Math.sin(theta) * Math.sin(phi);
    let y = radius * Math.cos(phi);
    
    object.position.set(x, y, z);
}

function createDodecahedron(object) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.DodecahedronBufferGeometry((trashWingspan / 2) * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0 * scale, 2 * scale, 0 * scale);    

    object.add(mesh);
}

function createIcosahedron(object) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.IcosahedronBufferGeometry((trashWingspan / 2) * scale);
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0 * scale, 4 * scale, 0 * scale);    

    object.add(mesh);
}

function createOctahedron(object) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.OctahedronBufferGeometry((trashWingspan / 2) * scale);
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0 * scale, 6 * scale, 0 * scale);    

    object.add(mesh);
}

function createSphere(object) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.SphereBufferGeometry((trashWingspan / 2) * scale, 10 * scale, 10 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0 * scale, 8 * scale, 0 * scale);    

    object.add(mesh);
}

function createBox(object) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.BoxBufferGeometry(trashWingspan * scale, trashWingspan * scale, trashWingspan * scale);
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0 * scale, 10 * scale, 0 * scale);    

    object.add(mesh);
}

function createPlanet(object) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.SphereGeometry(planetRadius * scale, 30 * scale, 30 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0 * scale, 10 * scale, 0 * scale);    

    object.add(mesh);
}

function createCameras() {
    'use strict';
    perspCamera = new THREE.PerspectiveCamera(70, 
        window.innerWidth / window.innerHeight, 1, 1000);
    
    orthoCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, 
        window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    orthoCamera.zoom = 15 / scale;
    orthoCamera.updateProjectionMatrix();

    camera = perspCamera;
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));

    planet = new THREE.Object3D();
    createPlanet(planet);
    scene.add(planet);

    dodecahedron1 = new THREE.Object3D();
    createDodecahedron(dodecahedron1);
    scene.add(dodecahedron1);

    icosahedron1 = new THREE.Object3D();
    createIcosahedron(icosahedron1);
    scene.add(icosahedron1);

    octahedron1 = new THREE.Object3D();
    createOctahedron(octahedron1);
    scene.add(octahedron1);

    sphere1 = new THREE.Object3D();
    createSphere(sphere1);
    scene.add(sphere1);

    box1 = new THREE.Object3D();
    createBox(box1);
    scene.add(box1);
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        if (camera == perspCamera) {
            camera.aspect = renderer.getSize().width / renderer.getSize().height;
            camera.updateProjectionMatrix();
        }
        else {
            camera.left = window.innerWidth / -2;
            camera.right = window.innerWidth / 2;
            camera.bottom = window.innerHeight / -2;
            camera.top = window.innerHeight / 2;
            camera.updateProjectionMatrix();
        }
    }
}

function onKeyDown(e) {
    'use strict';

    switch(e.keyCode) {
        case 49: //1, Orthographic Camera
            camera = orthoCamera;
            camera.position.x = 30 * scale;
            camera.position.y = 0;
            camera.position.z = 0;
            camera.lookAt(scene.position);
            camera.position.y = 15 * scale;
            break;
        case 50: //2, Persp Fixed Camera
            camera = perspCamera;
            break;
        case 51: //3, Persp Moving Camera
            break;

        case 52: //4, Wireframe
            scene.traverse(function(node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
        
        case 39: // right arrow, Move Rocket Longitudinally
            break;
        case 37: // left arrow, Move Rocket Longitudinally
            break;
        case 38: //up arrow, Move Rocket Latitudinally
            break;
        case 40: //down arrow, Move Rocket Latitudinally
            break;
    }
}

function onKeyUp(e) {
    'use strict';

    switch(e.keyCode) {

        case 39: // right arrow
        case 37: // left arrow
            break;
        case 38: //up arrow
        case 40: //down arrow
            break;
    }
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function animate() {
    'use strict';

    delta = clock.getDelta();

    render();

    requestAnimationFrame(animate);
}

function init() {
    'use strict';

    clock = new THREE.Clock();
    delta = 0

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();

    createCameras();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}
