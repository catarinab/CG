/* global THREE */

var orthoCam, perspCam, perspCam, camera, ambientLight, dirLight;

var scene, renderer;

var clock, delta;

// Objects
var floor, podium, smallStep, bigStep;

// Constants
const scale = 2, perspCamY = 11;

// Objects Scales
const floorWidth = 14, floorHeight = 14, podiumWidth = 7, podiumHeight = 2, podiumDepth = 7,
        stepWidth = 1, stepHeight = 1, stepDepth = 0.5;

function createLights() {
    'use strict';

    dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, perspCamY, 0);
    dirLight.target.position.set(0, 0, -5);

    ambientLight = new THREE.AmbientLight(0xffffff);

    scene.add(dirLight);
    //scene.add(ambientLight);
}

function createSteps() {
    'use strict';

    smallStep = new THREE.Object3D();
    bigStep = new THREE.Object3D();
    
    // Gouraud Shading
    let lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false });
    let lambertMaterial2 = new THREE.MeshLambertMaterial({ color: 0xfff34f, wireframe: false });
    // Phong Shading
    let phongMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false });

    let smallStepGeometry = new THREE.BoxGeometry(stepWidth * scale, stepHeight * scale, stepDepth * scale);
    let smallStepMesh = new THREE.Mesh(smallStepGeometry, lambertMaterial2); 
    smallStepMesh.position.set(0, 0, 0);

    let bigStepGeometry = new THREE.BoxGeometry(stepWidth * scale, stepHeight * 2 * scale, stepDepth * scale);
    let bigStepMesh = new THREE.Mesh(bigStepGeometry, lambertMaterial); 
    bigStepMesh.position.set(0, 0, 0);

    //podium.translateY(podiumHeight/2 * scale);

    smallStep.translateY(stepHeight/2 * scale);
    bigStep.translateY(stepHeight * scale);

    smallStep.translateZ(podiumDepth + stepDepth * 3);
    bigStep.translateZ(podiumDepth + stepDepth);
    
    smallStep.add(smallStepMesh); 
    bigStep.add(bigStepMesh); 

    scene.add(smallStep);
    scene.add(bigStep);
}

function createPodium() {
    'use strict';

    podium = new THREE.Object3D();
    
    // Gouraud Shading
    let lambertMaterial = new THREE.MeshLambertMaterial({ color: 0x404040, wireframe: false });
    // Phong Shading
    let phongMaterial = new THREE.MeshPhongMaterial({ color: 0x4fd0e7, wireframe: false });

    let geometry = new THREE.BoxGeometry(podiumWidth * scale, podiumHeight * scale, podiumDepth * scale);
    let mesh = new THREE.Mesh(geometry, lambertMaterial); 
    mesh.position.set(0, 0, 0);

    podium.translateY(podiumHeight/2 * scale);
    
    podium.add(mesh);  
    scene.add(podium);
}

function createFloor() {
    'use strict';

    floor = new THREE.Object3D();
    
    // Gouraud Shading
    let lambertMaterial = new THREE.MeshLambertMaterial({ color: 0x4fd0e7, wireframe: false });
    // Phong Shading
    let phongMaterial = new THREE.MeshPhongMaterial({ color: 0x4fd0e7, wireframe: false });

    let geometry = new THREE.PlaneGeometry(floorWidth * scale, floorHeight * scale);
    let mesh = new THREE.Mesh(geometry, lambertMaterial); 
    mesh.position.set(0, 0, 0);

    floor.rotateX(-Math.PI/2);
    
    floor.add(mesh);  
    scene.add(floor);
}

function createCameras() {
    'use strict';
    
    perspCam = new THREE.PerspectiveCamera(70, 
        window.innerWidth / window.innerHeight, 1, 100);
    perspCam.position.x = 0;
    perspCam.position.y = perspCamY * scale;
    perspCam.position.z = 0 * scale;
    perspCam.lookAt(scene.position);
    
    orthoCam = new THREE.OrthographicCamera(window.innerWidth / - 2, 
        window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    orthoCam.zoom = 40 / scale;
    orthoCam.updateProjectionMatrix();
    orthoCam.position.x = 0;
    orthoCam.position.y = perspCamY * scale;
    orthoCam.position.z = 0 * scale;
    /* orthoCam.position.x = 50 * scale;
    orthoCam.position.y = 0;
    orthoCam.position.z = 0; */
    orthoCam.lookAt(scene.position);

    camera = orthoCam;
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
        if (camera == fixedPerspCam || camera == perspCam) {
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
