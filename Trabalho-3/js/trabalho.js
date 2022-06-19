/* global THREE */

import { VRButton } from './VRButton.js';

var orthoCam, perspCam, pauseCamera, VRCamera, camera, dirLight, dirLightHelper, spotLight1, spotLight2, spotLight3, spotLightHelper1, spotLightHelper2, spotLightHelper3;
var origamiTexture;

var scene, renderer, isPause, isPhong, isBasic;

var clock, delta;

// Objects
var spotlight1, spotlight2, spotlight3, floor, stage, steps, origami1, origami2, origami3, pauseScreen;

// Objects Scales
const spotlightBase = 2, spotlightHeight = 2, floorWidth = 80, floorLength = 50, stageWidth = 60, stageHeight = 7, stageLength = 25, stepDepth = 2, paperLength = 7, offset = 1, pauseScreenWidth = 120, pauseScreenLength = 60;

// Constants
const scale = 1, perspCamX = 0, perspCamY = 40, perspCamZ = 40, orthoCamX = 0, orthoCamY = 0, orthoCamZ = (floorWidth * 5), pauseCameraX = orthoCamX, pauseCameraY = orthoCamY, pauseCameraZ = -orthoCamZ;

const rotationFactor = 1;

function createSpotlights() {
    let spotlight, spotLight, spotLightHelper;

    for (let i = 0; i < 3; i++) {
        if (i == 0) {
            spotlight1 = new THREE.Object3D();
            spotlight = spotlight1;
            spotLight1 = new THREE.SpotLight(0xffffff, 2, Math.sqrt((2 * perspCamY / 3 - stageHeight) ** 2 + (stageLength / 2) ** 2) * scale, Math.PI / 8, 1, 0);
            spotLight = spotLight1;
        }
        else if (i == 1) {
            spotlight2 = new THREE.Object3D();
            spotlight = spotlight2;
            spotLight2 = new THREE.SpotLight(0xffffff, 2, Math.sqrt((2 * perspCamY / 3 - stageHeight) ** 2 + (stageLength / 2) ** 2) * scale, Math.PI / 8, 1, 0);
            spotLight = spotLight2;
        }
        else {
            spotlight3 = new THREE.Object3D();
            spotlight = spotlight3;
            spotLight3 = new THREE.SpotLight(0xffffff, 2, Math.sqrt((2 * perspCamY / 3 - stageHeight) ** 2 + (stageLength / 2) ** 2) * scale, Math.PI / 8, 1, 0);
            spotLight = spotLight3;
        }

        // Gouraud Shading
        let lambertMaterialBase = new THREE.MeshLambertMaterial({ color: 0xfdf3c6, wireframe: false });
        let lambertMaterialHead = new THREE.MeshLambertMaterial({ color: 0x242526, wireframe: false });
        // Phong Shading
        let phongMaterialBase = new THREE.MeshPhongMaterial({ color: 0xfdf3c6, wireframe: false });
        let phongMaterialHead = new THREE.MeshPhongMaterial({ color: 0x242526, wireframe: false });
        // No Shading
        let basicMaterialBase = new THREE.MeshBasicMaterial({ color: 0xfdf3c6, wireframe: false });
        let basicMaterialHead = new THREE.MeshBasicMaterial({ color: 0x242526, wireframe: false });

        let geometryBase = new THREE.SphereGeometry((spotlightBase / 2) * scale, 10 * scale, 10 * scale);
        let meshBase = new THREE.Mesh(geometryBase, phongMaterialBase); 
        meshBase.position.set(0, 0, 0);
        spotlight.add(meshBase);
        let geometryHead = new THREE.CylinderGeometry(0.1 / scale, spotlightBase * scale, spotlightHeight * scale, 10);
        let meshHead = new THREE.Mesh(geometryHead, phongMaterialHead); 
        meshHead.position.set(0, (spotlightBase / 2) * scale, 0);
        spotlight.add(meshHead);

        spotlight.userData = {altMaterial: [lambertMaterialBase, lambertMaterialHead], basicMaterial: [basicMaterialBase, basicMaterialHead], mesh: [meshBase, meshHead]};
        spotlight.rotateX(Math.PI / 6);

        if (i == 0) {
            spotlight.position.set(-(stageWidth / 3) * scale, (2 * perspCamY / 3) * scale, (stageLength / 2) * scale);
            spotLight.position.set(-(stageWidth / 3) * scale, (2 * perspCamY / 3) * scale, (stageLength / 2) * scale);
            spotLight.target.position.set(-(stageWidth / 3) * scale, stageHeight * scale, 0);
            spotLight.target.updateMatrixWorld();
            spotLightHelper1 = new THREE.SpotLightHelper(spotLight);
            spotLightHelper = spotLightHelper1;
        }
        else if (i == 1) {
            spotlight.position.set(0, (2 * perspCamY / 3) * scale, (stageLength / 2) * scale);
            spotLight.position.set(0, (2 * perspCamY / 3) * scale, (stageLength / 2) * scale);
            spotLight.target.position.set(0, stageHeight * scale, 0);
            spotLight.target.updateMatrixWorld();
            spotLightHelper2 = new THREE.SpotLightHelper(spotLight);
            spotLightHelper = spotLightHelper2;
        }
        else {
            spotlight.position.set((stageWidth / 3) * scale, (2 * perspCamY / 3) * scale, (stageLength / 2) * scale);
            spotLight.position.set((stageWidth / 3) * scale, (2 * perspCamY / 3) * scale, (stageLength / 2) * scale);
            spotLight.target.position.set((stageWidth / 3) * scale, stageHeight * scale, 0);
            spotLight.target.updateMatrixWorld();
            spotLightHelper3 = new THREE.SpotLightHelper(spotLight);
            spotLightHelper = spotLightHelper3;
        }

        scene.add(spotlight);
        scene.add(spotLight);
        scene.add(spotLightHelper);
    }
}

function createLights() {
    'use strict';

    // Directional Light
    dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(20 * scale, 40 * scale, 20 * scale);
    dirLight.target.position.set(0, stageHeight * scale, 0);
    dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
    scene.add(dirLight);
    scene.add(dirLightHelper);

    // Spot Lights
    createSpotlights();
}

function createFloor() {
    'use strict';

    floor = new THREE.Object3D();

    let floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1.5 * scale, 1.5 * scale);

    let floorBumpMap = new THREE.TextureLoader().load('images/floorBump.jpg');
    floorBumpMap.wrapS = THREE.RepeatWrapping;
    floorBumpMap.wrapT = THREE.RepeatWrapping;
    
    // Gouraud Shading
    let lambertMaterial = new THREE.MeshLambertMaterial({ map: floorTexture, bumpMap: floorBumpMap, bumpScale: 0.1, color: 0xf8baba, wireframe: false });
    // Phong Shading
    let phongMaterial = new THREE.MeshPhongMaterial({ map: floorTexture, bumpMap: floorBumpMap, bumpScale: 0.1, color: 0xf8baba, wireframe: false });
    // No Shading
    let basicMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, bumpMap: floorBumpMap, bumpScale: 0.1, color: 0xf8baba, wireframe: false });

    let geometry = new THREE.PlaneGeometry(floorWidth * scale, floorLength * scale, 10, 10);
    let mesh = new THREE.Mesh(geometry, phongMaterial); 
    mesh.position.set(0, 0, 0);

    floor.userData = {altMaterial: [lambertMaterial], basicMaterial: [basicMaterial], mesh: [mesh]};
    
    floor.add(mesh);
    floor.rotateX(-Math.PI/2);

    scene.add(floor);
}

function createStage() {
    'use strict';

    stage = new THREE.Object3D();

    let stageTexture = new THREE.TextureLoader().load('images/stage.jpg');
    stageTexture.wrapS = THREE.RepeatWrapping;
    stageTexture.wrapT = THREE.RepeatWrapping;
    stageTexture.repeat.set(1 * scale, 1 * scale);

    let stageBumpMap = new THREE.TextureLoader().load('images/stageBump.jpg');
    stageBumpMap.wrapS = THREE.RepeatWrapping;
    stageBumpMap.wrapT = THREE.RepeatWrapping;
    
    // Gouraud Shading
    let lambertMaterial = new THREE.MeshLambertMaterial({ map: stageTexture, bumpMap: stageBumpMap, bumpScale: 0.5, color: 0x55342b, wireframe: false });
    // Phong Shading
    let phongMaterial = new THREE.MeshPhongMaterial({ map: stageTexture, bumpMap: stageBumpMap, bumpScale: 0.5, color: 0x55342b, wireframe: false });
    // No Shading
    let basicMaterial = new THREE.MeshBasicMaterial({ map: stageTexture, bumpMap: stageBumpMap, bumpScale: 0.5, color: 0x55342b, wireframe: false });

    let geometry = new THREE.BoxGeometry(stageWidth * scale, stageHeight * scale, stageLength * scale, 10, 10, 10);
    let mesh = new THREE.Mesh(geometry, phongMaterial); 
    mesh.position.set(0, 0, 0);

    stage.userData = {altMaterial: [lambertMaterial], basicMaterial: [basicMaterial], mesh: [mesh]};
    
    stage.add(mesh);  
    stage.translateY(stageHeight/2 * scale);

    scene.add(stage);
}

function createSteps() {
    'use strict';

    steps = new THREE.Object3D();

    let stepsTexture = new THREE.TextureLoader().load('images/steps.jpg');
    stepsTexture.wrapS = THREE.RepeatWrapping;
    stepsTexture.wrapT = THREE.RepeatWrapping;
    stepsTexture.repeat.set(5 * scale, 5 * scale);

    let stepsBumpMap = new THREE.TextureLoader().load('images/stepsBump.jpg');
    stepsBumpMap.wrapS = THREE.RepeatWrapping;
    stepsBumpMap.wrapT = THREE.RepeatWrapping;
    
    // Gouraud Shading
    let lambertMaterialBig = new THREE.MeshLambertMaterial({ map: stepsTexture, bumpMap: stepsBumpMap, bumpScale: 0.5, color: 0x55342b, wireframe: false });
    let lambertMaterialSmall = new THREE.MeshLambertMaterial({ map: stepsTexture, bumpMap: stepsBumpMap, bumpScale: 0.5, color: 0x55342b, wireframe: false });
    // Phong Shading
    let phongMaterialBig = new THREE.MeshPhongMaterial({ map: stepsTexture, bumpMap: stepsBumpMap, bumpScale: 0.5, color: 0x55342b, wireframe: false });
    let phongMaterialSmall = new THREE.MeshPhongMaterial({ map: stepsTexture, bumpMap: stepsBumpMap, bumpScale: 0.5, color: 0x55342b, wireframe: false });
    // No Shading
    let basicMaterialBig = new THREE.MeshBasicMaterial({ map: stepsTexture, bumpMap: stepsBumpMap, bumpScale: 0.5, color: 0x55342b, wireframe: false });
    let basicMaterialSmall = new THREE.MeshBasicMaterial({ map: stepsTexture, bumpMap: stepsBumpMap, bumpScale: 0.5, color: 0x55342b, wireframe: false });

    let bigStepGeometry = new THREE.BoxGeometry(stageWidth * scale, (2 * stageHeight / 3) * scale, stepDepth * scale, 10, 10, 10);
    let bigStepMesh = new THREE.Mesh(bigStepGeometry, phongMaterialBig); 
    bigStepMesh.position.set(0, 0, 0);
    
    let smallStepGeometry = new THREE.BoxGeometry(stageWidth, (stageHeight / 3) * scale, stepDepth * scale, 10, 10, 10);
    let smallStepMesh = new THREE.Mesh(smallStepGeometry, phongMaterialSmall); 
    smallStepMesh.position.set(0, - (stageHeight / 6) * scale, stepDepth * scale);

    steps.userData = {altMaterial: [lambertMaterialBig, lambertMaterialSmall], basicMaterial: [basicMaterialBig, basicMaterialSmall], mesh: [bigStepMesh, smallStepMesh]};

    steps.add(smallStepMesh); 
    steps.add(bigStepMesh);
    steps.translateY((stageHeight / 3) * scale);
    steps.translateZ((stageLength / 2 + stepDepth / 2) * scale);

    scene.add(steps);
}

function createTriangles(vertices) {
    let geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(vertices, 3));

    geometry.computeVertexNormals();

   return geometry;
}

function createOrigami1() {
    'use strict';

    origami1 = new THREE.Object3D();

    // Gouraud Shading
    let lambertMaterial = new THREE.MeshLambertMaterial({ map: origamiTexture, color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    // Phong Shading
    let phongMaterial = new THREE.MeshPhongMaterial({ map: origamiTexture, color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    // No Shading
    let basicMaterial = new THREE.MeshBasicMaterial({ map: origamiTexture, color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });

    // Inner Degree of Paper 157.5 Degrees (14 * Math.PI / 16 Rad)
    const vertices = new Float32Array([
        // Right
        0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0,
        0, (Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0,
        -4.82 * scale, 0, 1.37 * scale,

        // Left
        0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0,
        0, (Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0,
        4.82 * scale, 0, 1.37 * scale
    ]);
    let geometry = createTriangles(vertices);
    let mesh = new THREE.Mesh(geometry, phongMaterial);

    origami1.userData = {altMaterial: [lambertMaterial], basicMaterial: [basicMaterial], mesh: [mesh], rotating: 0};
    
    origami1.add(mesh);
    origami1.position.set(-(stageWidth / 3) * scale, (stageHeight + Math.sqrt(2 * (paperLength ** 2)) / 2 + offset) * scale, 0);

    scene.add(origami1);
}

function createOrigami2() {
    'use strict';

    origami2 = new THREE.Object3D();

    // Gouraud Shading
    let lambertMaterialFront = new THREE.MeshLambertMaterial({ map: origamiTexture, color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialBack = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    // Phong Shading
    let phongMaterialFront = new THREE.MeshPhongMaterial({ map: origamiTexture, color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialBack = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    // No Shading
    let basicMaterialFront = new THREE.MeshBasicMaterial({ map: origamiTexture, color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let basicMaterialBack = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });

    // Inner Degree of Paper 157.5 Degrees (14 * Math.PI / 16 Rad)
    const verticesFront = new Float32Array([
        // Top Right
        0, (Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0,
        0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0,
        1.68 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 1.65) * scale, -0.32 * scale,

        // Top Left
        0, (Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0,
        0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0,
        -1.68 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 1.65) * scale, -0.32 * scale,

        // Bot Right
        0.15 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.35) * scale, 0.28 * scale,
        1.47 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.93) * scale, -0.29 * scale,
        0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0,

        // Bot Left
        -0.15 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.35) * scale, 0.28 * scale,
        -1.47 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.93) * scale, -0.29 * scale,
        0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0
    ]);
    let geometryFront = createTriangles(verticesFront);
    let meshFront = new THREE.Mesh(geometryFront, phongMaterialFront);

    const verticesBack = new Float32Array([
        // Mid Right
        0.15 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.35) * scale, 0.28 * scale,
        1.68 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 1.65) * scale, -0.32 * scale,
        1.47 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.93) * scale, -0.29 * scale,

        // Mid Left
        -0.15 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.35) * scale, 0.28 * scale,
        -1.68 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 1.65) * scale, -0.32 * scale,
        -1.47 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.93) * scale, -0.29 * scale
    ]);
    let geometryBack = createTriangles(verticesBack);
    let meshBack = new THREE.Mesh(geometryBack, phongMaterialBack);

    origami2.userData = {altMaterial: [lambertMaterialFront, lambertMaterialBack], basicMaterial: [basicMaterialFront, basicMaterialBack], mesh: [meshFront, meshBack], rotating: 0};

    origami2.add(meshFront);
    origami2.add(meshBack);    
    origami2.position.set(0, (stageHeight + Math.sqrt(2 * (paperLength ** 2)) / 2 + offset) * scale, 0);

    scene.add(origami2);
}

function createOrigami3() {
    'use strict';

    origami3 = new THREE.Object3D();

    // Gouraud Shading
    let lambertMaterialFront = new THREE.MeshLambertMaterial({ map: origamiTexture, color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialBack = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    // Phong Shading
    let phongMaterialFront = new THREE.MeshPhongMaterial({ map: origamiTexture, color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialBack = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    // No Shading
    let basicMaterialFront = new THREE.MeshBasicMaterial({ map: origamiTexture, color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let basicMaterialBack = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });

    const verticesFront = new Float32Array([
        // Tail 1 Right
        2.4 * scale, -1.38 * scale, 0,
        -2.4 * scale, -0.47 * scale, 0,
        1.63 * scale, -2.31 * scale, 0.43 * scale,

        // Tail 1 Left
        -2.4 * scale, -0.47 * scale, 0,
        -1.1 * scale, -2.27 * scale, 0.63 * scale,
        1.63 * scale, -2.31 * scale, 0.43 * scale,

        // Tail 2 Right
        2.4 * scale, -1.38 * scale, 0,
        -2.4 * scale, -0.47 * scale, 0,
        1.63 * scale, -2.31 * scale, -0.43 * scale,

        // Tail 2 Left
        -2.4 * scale, -0.47 * scale, 0,
        -1.1 * scale, -2.27 * scale, -0.63 * scale,
        1.63 * scale, -2.31 * scale, -0.43 * scale,

        // Torso 1 Right
        -0.14 * scale, -0.94 * scale, 0.46 * scale,
        1.63 * scale, -2.31 * scale, 0.43 * scale,
        2.4 * scale, -1.38 * scale, 0,

        // Torso 1 Left
        0.18 * scale, -2.29 * scale, 0.53 * scale,
        -0.14 * scale, -0.94 * scale, 0.46 * scale,
        1.63 * scale, -2.31 * scale, 0.43 * scale,

        // Torso 2 Right
        -0.14 * scale, -0.94 * scale, -0.46 * scale,
        1.63 * scale, -2.31 * scale, -0.43 * scale,
        2.4 * scale, -1.38 * scale, 0,

        // Torso 2 Left
        0.18 * scale, -2.29 * scale, -0.53 * scale,
        -0.14 * scale, -0.94 * scale, -0.46 * scale,
        1.63 * scale, -2.31 * scale, -0.43 * scale,

        // Neck 1 Right
        1.63 * scale, -2.31 * scale, 0.43 * scale,
        2.4 * scale, -1.38 * scale, 0,
        1.3 * scale, 2.22 * scale, 0,

        // Neck 1 Left
        1.63 * scale, -2.31 * scale, 0.43 * scale,
        1.09 * scale, 2.22 * scale, 0.09 * scale,
        1.3 * scale, 2.22 * scale, 0,

        // Neck 2 Right
        1.63 * scale, -2.31 * scale, -0.43 * scale,
        2.4 * scale, -1.38 * scale, 0,
        1.3 * scale, 2.22 * scale, 0,

        // Neck 2 Left
        1.63 * scale, -2.31 * scale, -0.43 * scale,
        1.09 * scale, 2.22 * scale, -0.09 * scale,
        1.3 * scale, 2.22 * scale, 0,

        // Head 1
        1.09 * scale, 2.22 * scale, 0.09 * scale,
        2.17 * scale, 2.22 * scale, 0,
        1.3 * scale, 2.4 * scale, 0,

        // Head 2
        1.09 * scale, 2.22 * scale, -0.09 * scale,
        2.17 * scale, 2.22 * scale, 0,
        1.3 * scale, 2.4 * scale, 0
    ]);
    let geometryFront = createTriangles(verticesFront);
    let meshFront = new THREE.Mesh(geometryFront, phongMaterialFront);

    const verticesBack = new Float32Array([
        // Wing 1
        -1.1 * scale, -2.27 * scale, 0.63 * scale,
        0.18 * scale, -2.29 * scale, 0.53 * scale,
        -0.14 * scale, -0.94 * scale, 0.46 * scale,

        // Wing 2
        -1.1 * scale, -2.27 * scale, -0.63 * scale,
        0.18 * scale, -2.29 * scale, -0.53 * scale,
        -0.14 * scale, -0.94 * scale, -0.46 * scale
    ]);
    let geometryBack = createTriangles(verticesBack);
    let meshBack = new THREE.Mesh(geometryBack, phongMaterialBack);

    origami3.userData = {altMaterial: [lambertMaterialFront, lambertMaterialBack], basicMaterial: [basicMaterialFront, basicMaterialBack], mesh: [meshFront, meshBack], rotating: 0};

    origami3.add(meshFront);
    origami3.add(meshBack);    
    origami3.position.set((stageWidth / 3) * scale, (stageHeight + 2.4 + offset) * scale, 0);

    scene.add(origami3);
}

function createOrigamis() {
    'use strict';

    origamiTexture = new THREE.TextureLoader().load('images/flowers.png');
    origamiTexture.wrapS = THREE.RepeatWrapping;
    origamiTexture.wrapT = THREE.RepeatWrapping;
    origamiTexture.repeat.set(0.1 * scale, 0.1 * scale);

    createOrigami1();
    createOrigami2();
    createOrigami3();
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10 * scale));

    createFloor();
    createStage();
    createSteps();
    createOrigamis();
}

function createCameras() {
    'use strict';
    
    perspCam = new THREE.PerspectiveCamera(70, 
        window.innerWidth / window.innerHeight, 1, 100);
    perspCam.position.x = perspCamX * scale;
    perspCam.position.y = perspCamY * scale;
    perspCam.position.z = perspCamZ * scale;
    perspCam.lookAt(scene.position);
    
    orthoCam = new THREE.OrthographicCamera(window.innerWidth / - 2, 
        window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    orthoCam.zoom = 12 / scale;
    orthoCam.updateProjectionMatrix();
    orthoCam.position.x = orthoCamX;
    orthoCam.position.y = orthoCamY;
    orthoCam.position.z = orthoCamZ * scale;
    orthoCam.lookAt(scene.position);
    orthoCam.position.y += stageHeight * scale;

    pauseCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, 
        window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    pauseCamera.zoom = 12 / scale;
    pauseCamera.updateProjectionMatrix();
    pauseCamera.position.x = pauseCameraX * scale;
    pauseCamera.position.y = pauseCameraY * scale;
    pauseCamera.position.z = pauseCameraZ * scale;
    pauseCamera.lookAt(scene.position);
    pauseCamera.position.y += stageHeight * scale;

    VRCamera = new THREE.StereoCamera();

    camera = perspCam;
}

function createPauseScreen() {
    'use strict';

    pauseScreen = new THREE.Object3D();
    let geometry = new THREE.PlaneGeometry(pauseScreenWidth * scale, pauseScreenLength * scale, 10, 10);

    const texture = new THREE.TextureLoader().load('images/pause.png');
    let material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff, wireframe: false ,transparent: true, opacity: 0.4 });
    let mesh = new THREE.Mesh(geometry, material);
    
    pauseScreen.add(mesh);
    pauseScreen.rotateY(Math.PI);
    pauseScreen.position.set(pauseCameraX * scale, (pauseCameraY + 7) * scale, (pauseCameraZ + 7) * scale);
    pauseScreen.visible = false;

    scene.add(pauseScreen);
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        if (camera == perspCam) {
            camera.aspect = window.innerWidth / window.innerHeight;
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

function alternateMaterials() {
    'use strict';

    isPhong = !isPhong;

    let objects = [floor, stage, steps, spotlight1, spotlight2, spotlight3, origami1, origami2, origami3];
    objects.forEach(function (item1, index1) {
        item1.userData.mesh.forEach(function (item2, index2) {
            let auxMaterial = item1.userData.altMaterial[index2];
            item1.userData.altMaterial[index2] = item2.material;
            item2.material = auxMaterial;
        });
    });
}

function basicMaterials() {
    'use strict';  
    isBasic = !isBasic;

    let objects = [floor, stage, steps, spotlight1, spotlight2, spotlight3, origami1, origami2, origami3];
    objects.forEach(function (item1, index1) {
        item1.userData.mesh.forEach(function (item2, index2) {
            let auxMaterial = item1.userData.basicMaterial[index2];
            item1.userData.basicMaterial[index2] = item2.material;
            item2.material = auxMaterial;
        });
    });
}

function resetScene() {
    'use strict';
    
    if (isPause) {
        togglePauseScreen();
    }

    // Reset Material
    if(!isPhong) alternateMaterials();

    // Reset Origami
    origami1.rotation.set(0, 0, 0);
    origami2.rotation.set(0, 0, 0);
    origami3.rotation.set(0, 0, 0);

    // Turn On Lights
    dirLight.visible = true;
    spotLight1.visible = true;
    spotLight2.visible = true;
    spotLight3.visible = true;

    camera = perspCam;
}

function togglePauseScreen() {
    'use strict';

    isPause = !isPause;
    pauseScreen.visible = !pauseScreen.visible;
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
            
        case 51: //3, Refresh
            resetScene();
            break;
        case 65: // A
        case 97: // a, Alternate Materials
            if (!isBasic) alternateMaterials();
            break;
        case 68: // D
        case 100: // d, Directional Light
            if (!isBasic) dirLight.visible = !dirLight.visible;
            break;
        case 32: //space, Pause
            togglePauseScreen();
            break;
        case 83: //s, BasicMaterial
            basicMaterials();
            break;
        case 90: // Z
        case 122: // z, Spot Light 1
            if (!isBasic) spotLight1.visible = !spotLight1.visible;
            break;
        case 88: // X
        case 120: // X, Spot Light 2
            if (!isBasic) spotLight2.visible = !spotLight2.visible;
            break;
        case 67: // C
        case 99: // c, Spot Light 3
            if (!isBasic) spotLight3.visible = !spotLight3.visible;
            break;

        case 81: // Q
        case 113: // q, Rotate Origami 1 Negatively
            if (origami1.userData.rotating == 0 && !isPause) {
                origami1.userData.rotating = -rotationFactor;
            } 
            break;
        case 87: // W
        case 119: // w, Rotate Origami 1 Positively
            if (origami1.userData.rotating == 0 && !isPause) {
                origami1.userData.rotating = rotationFactor;
            }
            break;
        case 69: // E
        case 101: // e, Rotate Origami 2 Negatively
            if (origami2.userData.rotating == 0 && !isPause) {
                origami2.userData.rotating = -rotationFactor;
            }
            break;
        case 82: // R
        case 114: // r, Rotate Origami 2 Positively
            if (origami2.userData.rotating == 0 && !isPause) {
                origami2.userData.rotating = rotationFactor;
            }
            break;
        case 84: // T
        case 116: // t, Rotate Origami 3 Negatively
            if (origami3.userData.rotating == 0 && !isPause) {
                origami3.userData.rotating = -rotationFactor;
            }
            break;
        case 89: // Y
        case 121: // y, Rotate Origami 3 Positively
            if (origami3.userData.rotating == 0 && !isPause) {
                origami3.userData.rotating = rotationFactor;
            }
            break;
    }
}

function onKeyUp(e) {
    'use strict';

    switch(e.keyCode) {
        case 81: // Q
        case 113: // q
        case 87: // W
        case 119: // w
            origami1.userData.rotating = 0;
            break;
        case 69: // E
        case 101: // e,
        case 82: // R
        case 114: // r,
            origami2.userData.rotating = 0;
            break;
        case 84: // T
        case 116: // t,
        case 89: // Y
        case 121: // y,
            origami3.userData.rotating = 0;
            break;
    }
}

function rotateOrigamis() {
    if (origami1.userData.rotating != 0) {
        let step = origami1.userData.rotating * delta;
        origami1.rotateY(step);
    }
    if (origami2.userData.rotating != 0) {
        let step = origami2.userData.rotating * delta;
        origami2.rotateY(step);
    }
    if (origami3.userData.rotating != 0) {
        let step = origami3.userData.rotating * delta;
        origami3.rotateY(step);
    }
}

function render() {
    //'use strict';
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera);
    if (isPause){
      renderer.clearDepth();
      renderer.render(pauseScreen, pauseCamera);
    }
}

export function animate() {
    'use strict';

    delta = clock.getDelta();

    rotateOrigamis();

    render();

    requestAnimationFrame(animate);
}

function initializeVR() {
    document.body.appendChild( VRButton.createButton( renderer ) );

    renderer.xr.enabled = true;
    renderer.setAnimationLoop( function () {
        renderer.render( scene, camera );
    } );
}

export function init() {
    'use strict';

    clock = new THREE.Clock();
    delta = 0
    
    isPhong = true;
    isPause = false;
    isBasic = false;
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();

    createCameras();
    createLights();
    initializeVR();
    createPauseScreen();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}
