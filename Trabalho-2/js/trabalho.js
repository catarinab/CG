/* global THREE */

var perspCamera, orthoCamera, camera;

var scene, renderer, material

// Objects
var torus1, dodecahedron1, icosahedron1, octahedron1, sphere1, box1;

var clock, delta;

// Object Scales
// const ;

const movingFactor = 5, rotationFactor = 1;

const scale = 1.5;

function createTorus(object) {
    'use strict';

    const radius = 0.45 * scale;
    const tubeRadius = 0.2 * scale;
    const radialSegments = 8;
    const tubularSegments = 24;

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.TorusBufferGeometry(radius, tubeRadius, radialSegments, tubularSegments);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0 * scale, 0 * scale, 0 * scale);    

    object.add(mesh);
    // object.position.set(0 * scale, 0 * scale, 0 * scale);
}

/* 
function createCapsule(object) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.CapsuleGeometry( 1, 1, 4, 8 );
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0 * scale, 10 * scale, 0 * scale);    

    object.add(mesh);
    // object.position.set(0 * scale, 0 * scale, 0 * scale);
} */

function createDodecahedron(object) {
    'use strict';

    const radius = 0.45 * scale;

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.DodecahedronBufferGeometry(radius);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0 * scale, 2 * scale, 0 * scale);    

    object.add(mesh);
    // object.position.set(0 * scale, 2 * scale, 0 * scale);
}

function createIcosahedron(object) {
    'use strict';

    const radius = 0.45 * scale;

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.IcosahedronBufferGeometry(radius);
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0 * scale, 4 * scale, 0 * scale);    

    object.add(mesh);
    // object.position.set(0 * scale, 0 * scale, 0 * scale);
}

function createOctahedron(object) {
    'use strict';

    const radius = 0.45 * scale;

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.OctahedronBufferGeometry(radius);
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0 * scale, 6 * scale, 0 * scale);    

    object.add(mesh);
    // object.position.set(0 * scale, 0 * scale, 0 * scale);
}

function createSphere(object) {
    'use strict';

    const radius = 0.45 * scale;
    const widthSegments = 12;
    const heightSegments = 8;

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0 * scale, 8 * scale, 0 * scale);    

    object.add(mesh);
    // object.position.set(0 * scale, 0 * scale, 0 * scale);
}

function createBox(object) {
    'use strict';

    const width = 0.9 * scale;
    const height = 0.9 * scale;
    const depth = 0.9 * scale;

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.BoxBufferGeometry(width, height, depth);
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0 * scale, 10 * scale, 0 * scale);    

    object.add(mesh);
    // object.position.set(0 * scale, 0 * scale, 0 * scale);
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

    scene.add(new THREE.AxisHelper(10));

    torus1 = new THREE.Object3D();
    // torus1.userData = {rotating: false, incrementFactor: rotationFactor};
    createTorus(torus1);
    scene.add(torus1);

    dodecahedron1 = new THREE.Object3D();
    // dodecahedron1.userData = {rotating: false, incrementFactor: rotationFactor};
    createDodecahedron(dodecahedron1);
    scene.add(dodecahedron1);

    icosahedron1 = new THREE.Object3D();
    // icosahedron1.userData = {rotating: false, incrementFactor: rotationFactor};
    createIcosahedron(icosahedron1);
    scene.add(icosahedron1);

    octahedron1 = new THREE.Object3D();
    // octahedron1.userData = {rotating: false, incrementFactor: rotationFactor};
    createOctahedron(octahedron1);
    scene.add(octahedron1);

    sphere1 = new THREE.Object3D();
    // sphere1.userData = {rotating: false, incrementFactor: rotationFactor};
    createSphere(sphere1);
    scene.add(sphere1);

    box1 = new THREE.Object3D();
    // box1.userData = {rotating: false, incrementFactor: rotationFactor};
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
        // deixado para referencia
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
            // Reference
            /* if (foundation.userData.movingX == false) {
                foundation.userData.movingX = true;
                foundation.userData.incrementFactorX = movingFactor;
            } */
            break;
        case 37: // left arrow, Move Rocket Longitudinally
            /* if () {
                ;
            } */
            break;
        case 38: //up arrow, Move Rocket Latitudinally
            /* if () {
                ;
            } */
            break;
        case 40: //down arrow, Move Rocket Latitudinally
            /* if () {
                ;
            } */
            break;
    }
}

function onKeyUp(e) {
    'use strict';

    switch(e.keyCode) {

        case 39: // right arrow
        case 37: // left arrow
            // foundation.userData.movingX = false;
            break;
        case 38: //up arrow
        case 40: //down arrow
            // foundation.userData.movingY  = false;
            break;
        case 68: //D
        case 100: //d
        case 67: //C
        case 99: //c
            // foundation.userData.movingZ  = false;
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

    // deixado para referencia
    /* if (pivot.userData.rotating) {
        let step = pivot.userData.incrementFactor * delta;
        pivot.rotateX(step);
    } */

    /* if (foundation.userData.movingX) {
        let step = foundation.userData.incrementFactorX * delta;
        foundation.translateX(step);
    } */

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
