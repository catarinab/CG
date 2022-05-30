/* global THREE */

var perspCamera, orthoCamera, camera;

var scene, renderer, material

// objects
// var ;

var clock, delta;

// object scales
// const ;

const movingFactor = 5, rotationFactor = 1;

const scale = 1.5;

// deixado para referencia
/* function createPivot(object) { 
    'use strict';

    object.add(leftRod);
    object.add(rightRod);
    object.add(topRod);
    object.add(bottomRod);

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.BoxGeometry(pivotWidth * scale, pivotHeight * scale, pivotLength * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);

    object.add(mesh);
    object.position.set((towerWidth / 2 + pivotWidth / 2) * scale, (12 - towerHeight / 2 + pivotHeight / 2) * scale, 0);
} */

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

    // deixado para referencia
    /* pivot = new THREE.Object3D();
    pivot.userData = {rotating: false, incrementFactor: rotationFactor};
    createPivot(pivot); */

    // scene.add(foundation);
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
        case 49: //1, Front Orthographic Camera
            camera = orthoCamera;
            camera.position.x = 30 * scale;
            camera.position.y = 0;
            camera.position.z = 0;
            camera.lookAt(scene.position);
            camera.position.y = 15 * scale;
            break;
        case 50: //2, Side Orthographic Camera
            camera = orthoCamera;
            camera.position.x = 0;
            camera.position.y = 30 * scale;
            camera.position.z = 0;
            camera.lookAt(scene.position);
            camera.rotation.z = Math.PI / 2;
            break;
        case 51: //3, Top Orthographic Camera
            camera = orthoCamera;
            camera.position.x = 0
            camera.position.y = 0;
            camera.position.z = -30 * scale;
            camera.lookAt(scene.position);
            camera.position.y = 15 * scale;
            break;
        case 52: //4, Wireframe
            scene.traverse(function(node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
        case 53: //5, PerspectiveCamera
            camera = perspCamera;
            break;
        
        case 39: // right arrow, Move Articulated Object on X Axis Positively 
            // deixado para referencia
            /* if (foundation.userData.movingX == false) {
                foundation.userData.movingX = true;
                foundation.userData.incrementFactorX = movingFactor;
            } */
            break;
        case 37: // left arrow, Move Articulated Object on X Axis Negatively
            /* if () {
                ;
            } */
            break;
        case 38: //up arrow, Move Articulated Object on Y Axis Positively
            /* if () {
                ;
            } */
            break;
        case 40: //down arrow, Move Articulated Object on Y Axis Negatively
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
