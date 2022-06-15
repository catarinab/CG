/* global THREE */

import { VRButton } from './VRButton.js';

var orthoCam, perspCam, pauseCamera, camera, lastCamera, dirLight, dirLightHelper, spotLight1, spotLight2, spotLight3, spotLightHelper1, spotLightHelper2, spotLightHelper3;

var scene, renderer, isPause, isPhong;

var clock, delta;

// Objects
var spotlight1, spotlight2, spotlight3, floor, stage, steps, origami1, origami2, origami3, pauseScreen;

// Objects Scales
const spotlightBase = 2, spotlightHeight = 2, floorWidth = 80, floorLength = 50, stageWidth = 60, stageHeight = 7, stageLength = 25, stepDepth = 2, paperLength = 7, offset = 1, pauseScreenWidth = 90, pauseScreenLength = 80;

// Constants
const scale = 1, perspCamX = 0, perspCamY = 40, perspCamZ = 40, orthoCamX = 0, orthoCamY = 0, orthoCamZ = (floorWidth * 5), pauseCameraX = 0, pauseCameraY = 90, pauseCameraZ = - orthoCamZ;

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

        let geometryBase = new THREE.SphereGeometry((spotlightBase / 2) * scale, 10 * scale, 10 * scale);
        let meshBase = new THREE.Mesh(geometryBase, phongMaterialBase); 
        meshBase.position.set(0, 0, 0);
        spotlight.add(meshBase);
        let geometryHead = new THREE.CylinderGeometry(0.1 / scale, spotlightBase * scale, spotlightHeight * scale, 10);
        let meshHead = new THREE.Mesh(geometryHead, phongMaterialHead); 
        meshHead.position.set(0, (spotlightBase / 2) * scale, 0);
        spotlight.add(meshHead);

        spotlight.userData = {altMaterial: [lambertMaterialBase, lambertMaterialHead], mesh: [meshBase, meshHead]};
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

function createSteps() {
    'use strict';

    steps = new THREE.Object3D();
    
    // Gouraud Shading
    let lambertMaterialBig = new THREE.MeshLambertMaterial({ color: 0x55342b, wireframe: false });
    let lambertMaterialSmall = new THREE.MeshLambertMaterial({ color: 0x55342b, wireframe: false });
    // Phong Shading
    let phongMaterialBig = new THREE.MeshPhongMaterial({ color: 0x55342b, wireframe: false });
    let phongMaterialSmall = new THREE.MeshPhongMaterial({ color: 0x55342b, wireframe: false });

    let bigStepGeometry = new THREE.BoxGeometry(stageWidth * scale, (2 * stageHeight / 3) * scale, stepDepth * scale, 10, 10, 10);
    let bigStepMesh = new THREE.Mesh(bigStepGeometry, phongMaterialBig); 
    bigStepMesh.position.set(0, 0, 0);
    
    let smallStepGeometry = new THREE.BoxGeometry(stageWidth, (stageHeight / 3) * scale, stepDepth * scale, 10, 10, 10);
    let smallStepMesh = new THREE.Mesh(smallStepGeometry, phongMaterialSmall); 
    smallStepMesh.position.set(0, - (stageHeight / 6) * scale, stepDepth * scale);

    steps.userData = {altMaterial: [lambertMaterialBig, lambertMaterialSmall], mesh: [bigStepMesh, smallStepMesh]};

    steps.add(smallStepMesh); 
    steps.add(bigStepMesh);
    steps.translateY((stageHeight / 3) * scale);
    steps.translateZ((stageLength / 2 + stepDepth / 2) * scale);

    scene.add(steps);
}

function createStage() {
    'use strict';

    stage = new THREE.Object3D();
    
    // Gouraud Shading
    let lambertMaterial = new THREE.MeshLambertMaterial({ color: 0x55342b, wireframe: false });
    // Phong Shading
    let phongMaterial = new THREE.MeshPhongMaterial({ color: 0x55342b, wireframe: false });

    let geometry = new THREE.BoxGeometry(stageWidth * scale, stageHeight * scale, stageLength * scale, 10, 10, 10);
    let mesh = new THREE.Mesh(geometry, phongMaterial); 
    mesh.position.set(0, 0, 0);

    stage.userData = {altMaterial: [lambertMaterial], mesh: [mesh]};
    
    stage.add(mesh);  
    stage.translateY(stageHeight/2 * scale);

    scene.add(stage);
}

function createFloor() {
    'use strict';

    floor = new THREE.Object3D();
    
    // Gouraud Shading
    let lambertMaterial = new THREE.MeshLambertMaterial({ color: 0x711324, wireframe: false });
    // Phong Shading
    let phongMaterial = new THREE.MeshPhongMaterial({ color: 0x711324, wireframe: false });

    let geometry = new THREE.PlaneGeometry(floorWidth * scale, floorLength * scale, 10, 10);
    let mesh = new THREE.Mesh(geometry, phongMaterial); 
    mesh.position.set(0, 0, 0);

    floor.userData = {altMaterial: [lambertMaterial], mesh: [mesh]};
    
    floor.add(mesh);
    floor.rotateX(-Math.PI/2);

    scene.add(floor);
}

function createTriangle(v1, v2, v3) {
    let geometry = new THREE.Geometry(); 

    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);

    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.computeFaceNormals();

   return geometry;
}

function createSquare(v1, v2, v3, v4) {
    let geometry = new THREE.Geometry(); 

    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.vertices.push(v4);

    geometry.faces.push(new THREE.Face4(0, 1, 2, 3));
    geometry.computeFaceNormals();

   return geometry;
}

function createOrigami1() {
    'use strict';

    origami1 = new THREE.Object3D();

    //const texture = new THREE.TextureLoader().load('flowers.png'); // { map: texture, ... }

    // Gouraud Shading
    let lambertMaterialRight = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialLeft = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    // Phong Shading
    let phongMaterialRight = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialLeft = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });

    // Inner Degree of Paper 157.5 Degrees (14 * Math.PI / 16 Rad)
    let geometryRight = createTriangle(new THREE.Vector3(0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0), new THREE.Vector3(0, (Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0), new THREE.Vector3(-4.82 * scale, 0, 1.37 * scale));
    let meshRight = new THREE.Mesh(geometryRight, phongMaterialRight); 

    let geometryLeft = createTriangle(new THREE.Vector3(0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0), new THREE.Vector3(0, (Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0), new THREE.Vector3(4.82 * scale, 0, 1.37 * scale));
    let meshLeft = new THREE.Mesh(geometryLeft, phongMaterialLeft); 

    origami1.userData = {altMaterial: [lambertMaterialRight, lambertMaterialLeft], mesh: [meshRight, meshLeft], rotating: 0};
    
    origami1.add(meshRight);
    origami1.add(meshLeft);
    origami1.position.set(-(stageWidth / 3) * scale, (stageHeight + Math.sqrt(2 * (paperLength ** 2)) / 2 + offset) * scale, 0);

    scene.add(origami1);
}

function createOrigami2() {
    'use strict';

    origami2 = new THREE.Object3D();

    // Gouraud Shading
    let lambertMaterialTopRight = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialTopLeft = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialMidRight = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialMidLeft = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialBotRight = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialBotLeft = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    // Phong Shading
    let phongMaterialTopRight = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialTopLeft = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialMidRight = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialMidLeft = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialBotRight = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialBotLeft = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });

    // Inner Degree of Paper 157.5 Degrees (14 * Math.PI / 16 Rad)
    let geometryTopRight = createTriangle(new THREE.Vector3(0, (Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0), new THREE.Vector3(0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0), new THREE.Vector3(1.61 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 1.65) * scale, -0.97 * scale));
    let meshTopRight = new THREE.Mesh(geometryTopRight, phongMaterialTopRight); 

    let geometryTopLeft = createTriangle(new THREE.Vector3(0, (Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0), new THREE.Vector3(0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0), new THREE.Vector3(-1.61 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 1.65) * scale, -0.97 * scale));
    let meshTopLeft = new THREE.Mesh(geometryTopLeft, phongMaterialTopLeft);

    let geometryMidRight = createTriangle(new THREE.Vector3(0.1 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.35) * scale, 0.89 * scale), new THREE.Vector3(1.61 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 1.65) * scale, -0.97 * scale), new THREE.Vector3(1.43 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.93) * scale, -0.82 * scale));
    let meshMidRight = new THREE.Mesh(geometryMidRight, phongMaterialMidRight); 

    let geometryMidLeft = createTriangle(new THREE.Vector3(-0.1 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.35) * scale, 0.89 * scale), new THREE.Vector3(-1.61 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 1.65) * scale, -0.97 * scale), new THREE.Vector3(-1.43 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.93) * scale, -0.82 * scale));
    let meshMidLeft = new THREE.Mesh(geometryMidLeft, phongMaterialMidLeft); 

    let geometryBotRight = createTriangle(new THREE.Vector3(0.1 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.35) * scale, 0.89 * scale), new THREE.Vector3(1.43 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.93) * scale, -0.82 * scale), new THREE.Vector3(0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0));
    let meshBotRight = new THREE.Mesh(geometryBotRight, phongMaterialBotRight); 

    let geometryBotLeft = createTriangle(new THREE.Vector3(-0.1 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.35) * scale, 0.89 * scale), new THREE.Vector3(-1.43 * scale, (Math.sqrt(2 * (paperLength ** 2)) / 2 - 2.93) * scale, -0.82 * scale), new THREE.Vector3(0, -(Math.sqrt(2 * (paperLength ** 2)) / 2) * scale, 0));
    let meshBotLeft = new THREE.Mesh(geometryBotLeft, phongMaterialBotLeft); 

    origami2.userData = {altMaterial: [lambertMaterialTopRight, lambertMaterialTopLeft, lambertMaterialMidRight, lambertMaterialMidLeft, lambertMaterialBotRight, lambertMaterialBotLeft], mesh: [meshTopRight, meshTopLeft, meshMidRight, meshMidLeft, meshBotRight, meshBotLeft], rotating: 0};

    origami2.add(meshTopRight);
    origami2.add(meshTopLeft);
    origami2.add(meshMidRight);
    origami2.add(meshMidLeft);
    origami2.add(meshBotRight);
    origami2.add(meshBotLeft);
    origami2.position.set(0, (stageHeight + Math.sqrt(2 * (paperLength ** 2)) / 2 + offset) * scale, 0);

    scene.add(origami2);
}

function createOrigami3Tail(origami3) {
    'use strict';

    // Gouraud Shading
    let lambertMaterialTail1Right = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialTail1Left = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialTail2Right = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialTail2Left = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    // Phong Shading
    let phongMaterialTail1Right  = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialTail1Left = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialTail2Right  = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialTail2Left = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });

    let geometryTail1Right = createTriangle(new THREE.Vector3(2.4 * scale, -1.38 * scale, 0), new THREE.Vector3(-2.4 * scale, -0.47 * scale, 0), new THREE.Vector3(1.63 * scale, -2.31 * scale, 0.43 * scale));
    let meshTail1Right = new THREE.Mesh(geometryTail1Right, phongMaterialTail1Right);

    let geometryTail1Left = createTriangle(new THREE.Vector3(-2.4 * scale, -0.47 * scale, 0), new THREE.Vector3(-1.1 * scale, -2.27 * scale, 0.63 * scale), new THREE.Vector3(1.63 * scale, -2.31 * scale, 0.43 * scale));
    let meshTail1Left = new THREE.Mesh(geometryTail1Left, phongMaterialTail1Left);

    let geometryTail2Right = createTriangle(new THREE.Vector3(2.4 * scale, -1.38 * scale, 0), new THREE.Vector3(-2.4 * scale, -0.47 * scale, 0), new THREE.Vector3(1.63 * scale, -2.31 * scale, -0.43 * scale));
    let meshTail2Right = new THREE.Mesh(geometryTail2Right, phongMaterialTail2Right);

    let geometryTail2Left = createTriangle(new THREE.Vector3(-2.4 * scale, -0.47 * scale, 0), new THREE.Vector3(-1.1 * scale, -2.27 * scale, -0.63 * scale), new THREE.Vector3(1.63 * scale, -2.31 * scale, -0.43 * scale));
    let meshTail2Left = new THREE.Mesh(geometryTail2Left, phongMaterialTail2Left);

    origami3.userData.altMaterial.push(lambertMaterialTail1Right);
    origami3.userData.altMaterial.push(lambertMaterialTail1Left);
    origami3.userData.altMaterial.push(lambertMaterialTail2Right);
    origami3.userData.altMaterial.push(lambertMaterialTail2Left);
    origami3.userData.mesh.push(meshTail1Right);
    origami3.userData.mesh.push(meshTail1Left);
    origami3.userData.mesh.push(meshTail2Right);
    origami3.userData.mesh.push(meshTail2Left);
    origami3.add(meshTail1Right);
    origami3.add(meshTail1Left);
    origami3.add(meshTail2Right);
    origami3.add(meshTail2Left);
}

function createOrigami3Wings(origami3) {
    'use strict';

    // Gouraud Shading
    let lambertMaterialWing1 = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialWing2 = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    // Phong Shading
    let phongMaterialWing1 = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialWing2 = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });

    let geometryWing1 = createTriangle(new THREE.Vector3(-1.1 * scale, -2.27 * scale, 0.63 * scale), new THREE.Vector3(0.18 * scale, -2.29 * scale, 0.53 * scale), new THREE.Vector3(-0.14 * scale, -0.94 * scale, 0.46 * scale));
    let meshWing1 = new THREE.Mesh(geometryWing1, phongMaterialWing1);

    let geometryWing2 = createTriangle(new THREE.Vector3(-1.1 * scale, -2.27 * scale, -0.63 * scale), new THREE.Vector3(0.18 * scale, -2.29 * scale, -0.53 * scale), new THREE.Vector3(-0.14 * scale, -0.94 * scale, -0.46 * scale));
    let meshWing2 = new THREE.Mesh(geometryWing2, phongMaterialWing2);

    origami3.userData.altMaterial.push(lambertMaterialWing1);
    origami3.userData.mesh.push(meshWing1);
    origami3.userData.altMaterial.push(lambertMaterialWing2);
    origami3.userData.mesh.push(meshWing2);
    origami3.add(meshWing1);
    origami3.add(meshWing2);
}

function createOrigami3Torso(origami3) {
    'use strict';

    // Gouraud Shading
    let lambertMaterialTorso1Right = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialTorso1Left = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialTorso2Right = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialTorso2Left = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    // Phong Shading
    let phongMaterialTorso1Right  = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialTorso1Left = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialTorso2Right  = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialTorso2Left = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });

    let geometryTorso1Right = createTriangle(new THREE.Vector3(-0.14 * scale, -0.94 * scale, 0.46 * scale), new THREE.Vector3(1.63 * scale, -2.31 * scale, 0.43 * scale), new THREE.Vector3(2.4 * scale, -1.38 * scale, 0));
    let meshTorso1Right = new THREE.Mesh(geometryTorso1Right, phongMaterialTorso1Right);

    let geometryTorso1Left = createTriangle(new THREE.Vector3(0.18 * scale, -2.29 * scale, 0.53 * scale), new THREE.Vector3(-0.14 * scale, -0.94 * scale, 0.46 * scale), new THREE.Vector3(1.63 * scale, -2.31 * scale, 0.43 * scale));
    let meshTorso1Left = new THREE.Mesh(geometryTorso1Left, phongMaterialTorso1Left);

    let geometryTorso2Right = createTriangle(new THREE.Vector3(-0.14 * scale, -0.94 * scale, -0.46 * scale), new THREE.Vector3(1.63 * scale, -2.31 * scale, -0.43 * scale), new THREE.Vector3(2.4 * scale, -1.38 * scale, 0));
    let meshTorso2Right = new THREE.Mesh(geometryTorso2Right, phongMaterialTorso2Right);

    let geometryTorso2Left = createTriangle(new THREE.Vector3(0.18 * scale, -2.29 * scale, -0.53 * scale), new THREE.Vector3(-0.14 * scale, -0.94 * scale, -0.46 * scale), new THREE.Vector3(1.63 * scale, -2.31 * scale, -0.43 * scale));
    let meshTorso2Left = new THREE.Mesh(geometryTorso2Left, phongMaterialTorso2Left);

    origami3.userData.altMaterial.push(lambertMaterialTorso1Right);
    origami3.userData.altMaterial.push(lambertMaterialTorso1Left);
    origami3.userData.altMaterial.push(lambertMaterialTorso2Right);
    origami3.userData.altMaterial.push(lambertMaterialTorso2Left);
    origami3.userData.mesh.push(meshTorso1Right);
    origami3.userData.mesh.push(meshTorso1Left);
    origami3.userData.mesh.push(meshTorso2Right);
    origami3.userData.mesh.push(meshTorso2Left);
    origami3.add(meshTorso1Right);
    origami3.add(meshTorso1Left);
    origami3.add(meshTorso2Right);
    origami3.add(meshTorso2Left);
}

function createOrigami3Neck(origami3) {
    'use strict';

    // Gouraud Shading
    let lambertMaterialNeck1Right = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialNeck1Left = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialNeck2Right = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialNeck2Left = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    // Phong Shading
    let phongMaterialNeck1Right  = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialNeck1Left = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialNeck2Right  = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialNeck2Left = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    
    let geometryNeck1Right = createTriangle(new THREE.Vector3(1.63 * scale, -2.31 * scale, 0.43 * scale), new THREE.Vector3(2.4 * scale, -1.38 * scale, 0), new THREE.Vector3(1.3 * scale, 2.22 * scale, 0));
    let meshNeck1Right = new THREE.Mesh(geometryNeck1Right, phongMaterialNeck1Right);
    
    let geometryNeck1Left = createTriangle(new THREE.Vector3(1.63 * scale, -2.31 * scale, 0.43 * scale), new THREE.Vector3(1.09 * scale, 2.22 * scale, 0.09 * scale), new THREE.Vector3(1.3 * scale, 2.22 * scale, 0));
    let meshNeck1Left = new THREE.Mesh(geometryNeck1Left, phongMaterialNeck1Left);
    
    let geometryNeck2Right = createTriangle(new THREE.Vector3(1.63 * scale, -2.31 * scale, -0.43 * scale), new THREE.Vector3(2.4 * scale, -1.38 * scale, 0), new THREE.Vector3(1.3 * scale, 2.22 * scale, 0));
    let meshNeck2Right = new THREE.Mesh(geometryNeck2Right, phongMaterialNeck2Right);
    
    let geometryNeck2Left = createTriangle(new THREE.Vector3(1.63 * scale, -2.31 * scale, -0.43 * scale), new THREE.Vector3(1.09 * scale, 2.22 * scale, -0.09 * scale), new THREE.Vector3(1.3 * scale, 2.22 * scale, 0));
    let meshNeck2Left = new THREE.Mesh(geometryNeck2Left, phongMaterialNeck2Left);
    
    origami3.userData.altMaterial.push(lambertMaterialNeck1Right);
    origami3.userData.altMaterial.push(lambertMaterialNeck1Left);
    origami3.userData.altMaterial.push(lambertMaterialNeck2Right);
    origami3.userData.altMaterial.push(lambertMaterialNeck2Left);
    origami3.userData.mesh.push(meshNeck1Right);
    origami3.userData.mesh.push(meshNeck1Left);
    origami3.userData.mesh.push(meshNeck2Right);
    origami3.userData.mesh.push(meshNeck2Left);
    origami3.add(meshNeck1Right);
    origami3.add(meshNeck1Left);
    origami3.add(meshNeck2Right);
    origami3.add(meshNeck2Left);
}

function createOrigami3Head(origami3) {
    'use strict';

    // Gouraud Shading
    let lambertMaterialHead1 = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let lambertMaterialHead2 = new THREE.MeshLambertMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    // Phong Shading
    let phongMaterialHead1 = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });
    let phongMaterialHead2 = new THREE.MeshPhongMaterial({ color: 0xda5e64, wireframe: false, side: THREE.DoubleSide });

    let geometryHead1 = createTriangle(new THREE.Vector3(1.09 * scale, 2.22 * scale, 0.09 * scale), new THREE.Vector3(2.17 * scale, 2.22 * scale, 0), new THREE.Vector3(1.3 * scale, 2.4 * scale, 0));
    let meshHead1 = new THREE.Mesh(geometryHead1, phongMaterialHead1);

    let geometryHead2 = createTriangle(new THREE.Vector3(1.09 * scale, 2.22 * scale, -0.09 * scale), new THREE.Vector3(2.17 * scale, 2.22 * scale, 0), new THREE.Vector3(1.3 * scale, 2.4 * scale, 0));
    let meshHead2 = new THREE.Mesh(geometryHead2, phongMaterialHead2);

    origami3.userData.altMaterial.push(lambertMaterialHead1);
    origami3.userData.mesh.push(meshHead1);
    origami3.userData.altMaterial.push(lambertMaterialHead2);
    origami3.userData.mesh.push(meshHead2);
    origami3.add(meshHead1);
    origami3.add(meshHead2);
}

function createOrigami3() {
    'use strict';

    origami3 = new THREE.Object3D();
    origami3.userData = {altMaterial: [], mesh: [], rotating: 0};

    createOrigami3Tail(origami3);
    createOrigami3Wings(origami3);
    createOrigami3Torso(origami3);
    createOrigami3Neck(origami3);
    createOrigami3Head(origami3);

    origami3.position.set((stageWidth / 3) * scale, (stageHeight + 2.4 + offset) * scale, 0);

    scene.add(origami3);
}

function createOrigamis() {
    'use strict';

    createOrigami1();
    createOrigami2();
    createOrigami3();
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
    orthoCam.position.x = 0;
    orthoCam.position.y = 0;
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

    camera = perspCam;
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

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        if (camera == perspCam) {
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

function resetScene() {
    'use strict';
    
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


    if (isPause) removePauseScreen();

    camera = perspCam;
}

function drawPauseScreen() {
    'use strict';

    pauseScreen = new THREE.Object3D();
    let geometry = new THREE.PlaneGeometry(pauseScreenWidth * scale, pauseScreenLength * scale, 10, 10);

    const texture = new THREE.TextureLoader().load('pause.png');
    let material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff, wireframe: false, side: THREE.DoubleSide, transparent: true, opacity: 0.4});
    let mesh = new THREE.Mesh(geometry, material);
    
    pauseScreen.rotateY(Math.PI);
    pauseScreen.position.set(pauseCameraX, pauseCameraY, pauseCameraZ + 10);
    
    pauseScreen.visible = false;
    pauseScreen.add(mesh);
    scene.add(pauseScreen);
}

function activatePauseScreen() {
    'use strict';

    isPause = true;
    pauseScreen.visible = true;

    lastCamera = camera;
    camera = pauseCamera;
}

function removePauseScreen() {
    'use strict';

    isPause = false;
    pauseScreen.visible = false;

    camera = lastCamera;
}

function onKeyDown(e) {
    'use strict';

    switch(e.keyCode) {
        case 49: //1, Persp Camera
            if(!isPause) camera = perspCam;
            break;
        case 50: //2, Orthographic Fixed Camera
            if(!isPause) camera = orthoCam;
            break;
            
        case 51: //3, Refresh
            resetScene();
            break;
        case 65: // A
        case 97: // a, Alternate Materials
            alternateMaterials();
            break;
        case 68: // D
        case 100: // d, Directional Light
            dirLight.visible = !dirLight.visible;
            break;
        case 32: //space, Pause
            if (!isPause) activatePauseScreen();
            else removePauseScreen();
            break;
        case 90: // Z
        case 122: // z, Spot Light 1
            spotLight1.visible = !spotLight1.visible;
            break;
        case 88: // X
        case 120: // X, Spot Light 2
            spotLight2.visible = !spotLight2.visible;
            break;
        case 67: // C
        case 99: // c, Spot Light 3
            spotLight3.visible = !spotLight3.visible;
            break;

        case 81: // Q
        case 113: // q, Rotate Origami 1 Positively
            if (origami1.userData.rotating == 0) {
                origami1.userData.rotating = rotationFactor;
            } 
            break;
        case 87: // W
        case 119: // w, Rotate Origami 1 Negatively
            if (origami1.userData.rotating == 0) {
                origami1.userData.rotating = -rotationFactor;
            }
            break;
        case 69: // E
        case 101: // e, Rotate Origami 2 Positively
            if (origami2.userData.rotating == 0) {
                origami2.userData.rotating = rotationFactor;
            }
            break;
        case 82: // R
        case 114: // r, Rotate Origami 2 Negatively
            if (origami2.userData.rotating == 0) {
                origami2.userData.rotating = -rotationFactor;
            }
            break;
        case 84: // T
        case 116: // t, Rotate Origami 3 Positively
            if (origami3.userData.rotating == 0) {
                origami3.userData.rotating = rotationFactor;
            }
            break;
        case 89: // Y
        case 121: // y, Rotate Origami 3 Negatively
            if (origami3.userData.rotating == 0) {
                origami3.userData.rotating = -rotationFactor;
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
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();

    createCameras();
    initializeVR();
    createLights();
    drawPauseScreen();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

window.init = init;
