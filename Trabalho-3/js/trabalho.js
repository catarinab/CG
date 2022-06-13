/* global THREE */

var orthoCam, perspCam, vrCam, camera, dirLight, spotLightZ, spotLightX, spotLightC, ambientLight;

var scene, renderer;

var clock, delta;

// Objects
var floor, podium, steps;

// Constants
const scale = 1, perspCamY = 11;

// Objects Scales
const floorWidth = 14, floorLength = 14, podiumWidth = 7, podiumHeight = 2, podiumDepth = 7,
        stepWidth = 1, stepDepth = 0.5;

function createLights() {
    'use strict';

    // Directional Light
    dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, perspCamY, 0);
    dirLight.target.position.set(0, 0, -5);
    scene.add(dirLight);

    // Spot Lights

    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
}

function createSteps() {
    'use strict';

    steps = new THREE.Object3D();
    
    // Gouraud Shading
    let lambertMaterialBig = new THREE.MeshLambertMaterial({ color: 0x55342b, wireframe: false });
    let lambertMaterialSmall = new THREE.MeshLambertMaterial({ color: 0x55342b, wireframe: false });
    // Phong Shading
    let phongMaterialBig = new THREE.MeshPhongMaterial({ color: 0x55342b, wireframe: false });
    let phongMaterialSmall = new THREE.MeshPhongMaterial({ color: 0x55342b, wireframe: false });

    let bigStepGeometry = new THREE.BoxGeometry(stepWidth * scale, (2 * podiumHeight / 3) * scale, stepDepth * scale);
    let bigStepMesh = new THREE.Mesh(bigStepGeometry, lambertMaterialBig); 
    bigStepMesh.position.set(0, 0, 0);
    
    let smallStepGeometry = new THREE.BoxGeometry(stepWidth * scale, (podiumHeight / 3) * scale, stepDepth * scale);
    let smallStepMesh = new THREE.Mesh(smallStepGeometry, lambertMaterialSmall); 
    smallStepMesh.position.set(0, - (podiumHeight / 6) * scale, stepDepth * scale);

    steps.userData = {altMaterial: [phongMaterialBig, phongMaterialSmall], meshes: [bigStepMesh, smallStepMesh]};

    steps.add(smallStepMesh); 
    steps.add(bigStepMesh);
    steps.translateY((podiumHeight / 3) * scale);
    steps.translateZ((podiumDepth / 2 + stepDepth / 2) * scale);

    scene.add(steps);
}

function createPodium() {
    'use strict';

    podium = new THREE.Object3D();
    
    // Gouraud Shading
    let lambertMaterial = new THREE.MeshLambertMaterial({ color: 0x55342b, wireframe: false });
    // Phong Shading
    let phongMaterial = new THREE.MeshPhongMaterial({ color: 0x55342b, wireframe: false });

    let geometry = new THREE.BoxGeometry(podiumWidth * scale, podiumHeight * scale, podiumDepth * scale);
    let mesh = new THREE.Mesh(geometry, lambertMaterial); 
    mesh.position.set(0, 0, 0);

    podium.userData = {altMaterial: phongMaterial};
    
    podium.add(mesh);  
    podium.translateY(podiumHeight/2 * scale);

    scene.add(podium);
}

function createFloor() {
    'use strict';

    floor = new THREE.Object3D();
    
    // Gouraud Shading
    let lambertMaterial = new THREE.MeshLambertMaterial({ color: 0x711324, wireframe: false });
    // Phong Shading
    let phongMaterial = new THREE.MeshPhongMaterial({ color: 0x711324, wireframe: false });

    let geometry = new THREE.PlaneGeometry(floorWidth * scale, floorLength * scale);
    let mesh = new THREE.Mesh(geometry, lambertMaterial); 
    mesh.position.set(0, 0, 0);

    floor.userData = {altMaterial: phongMaterial};
    
    floor.add(mesh);
    floor.rotateX(-Math.PI/2);

    scene.add(floor);
}

function createCameras() {
    'use strict';
    
    perspCam = new THREE.PerspectiveCamera(70, 
        window.innerWidth / window.innerHeight, 1, 100);
    perspCam.position.x = -10 * scale;
    perspCam.position.y = 15 * scale;
    perspCam.position.z = 10 * scale;
    perspCam.lookAt(scene.position);
    
    orthoCam = new THREE.OrthographicCamera(window.innerWidth / - 2, 
        window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    orthoCam.zoom = 40 / scale;
    orthoCam.updateProjectionMatrix();
    orthoCam.position.x = 0;
    orthoCam.position.y = 0;
    orthoCam.position.z = (floorWidth * 5) * scale;
    orthoCam.lookAt(scene.position);
    orthoCam.position.y = podiumHeight * scale;

    camera = perspCam;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10 * scale));

    createFloor();
    createPodium();
    createSteps();
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        if (camera == perspCam) {
            console.log("hey puta\n");
            camera.aspect = renderer.getSize().width / renderer.getSize().height;
            camera.updateProjectionMatrix();
        }
        else {
            console.log("wtf\n");
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
        case 49: //1, Persp Camera
            camera = perspCam;
            break;
        case 50: //2, Orthographic Fixed Camera
            camera = orthoCam;
            break;
        case 51: //3, Wireframe
            scene.traverse(function(node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
    }
}

function onKeyUp(e) {
    'use strict';
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
    createLights();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}
