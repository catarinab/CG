/* global THREE */

var orthoCam, perspCam, vrCam, camera, dirLight, dirLightHelper, spotLight1, spotLight2, spotLight3, spotLightHelper1, spotLightHelper2, spotLightHelper3;

var scene, renderer;

var clock, delta;

// Objects
var floor, stage, steps, spotlight1, spotlight2, spotlight3;

// Constants
const scale = 1, perspCamX = 0, perspCamY = 40, perspCamZ = 40;

// Objects Scales
const spotlightBase = 2, spotlightHeight = 2, floorWidth = 80, floorLength = 50, stageWidth = 60, stageHeight = 7, stageDepth = 25, stepDepth = 2;

function createSpotlights() {
    let spotlight, spotLight, spotLightHelper;

    for (let i = 0; i < 3; i++) {
        if (i == 0) {
            spotlight1 = new THREE.Object3D();
            spotlight = spotlight1;
            spotLight1 = new THREE.SpotLight(0xffffff, 2, (perspCamY / 2 - stageHeight) * scale, Math.PI / 4, 1, 0);
            spotLight = spotLight1;
        }
        else if (i == 1) {
            spotlight2 = new THREE.Object3D();
            spotlight = spotlight2;
            spotLight2 = new THREE.SpotLight(0xffffff, 2, (perspCamY / 2 - stageHeight) * scale, Math.PI / 4, 1, 0);
            spotLight = spotLight2;
        }
        else {
            spotlight3 = new THREE.Object3D();
            spotlight = spotlight3;
            spotLight3 = new THREE.SpotLight(0xffffff, 2, (perspCamY / 2 - stageHeight) * scale, Math.PI / 4, 1, 0);
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
        let geometryHead = new THREE.CylinderGeometry(0.1 / scale, spotlightBase * scale, spotlightHeight * scale, 4);
        let meshHead = new THREE.Mesh(geometryHead, phongMaterialHead); 
        meshHead.position.set(0, (spotlightBase / 2) * scale, 0);
        spotlight.add(meshHead);

        spotlight.userData = {altMaterial: [lambertMaterialBase, lambertMaterialHead], mesh: [meshBase, meshHead]};
        
        if (i == 0) {
            spotlight.position.set(-(stageWidth / 3) * scale, (perspCamY / 2) * scale, 0);
            spotLight.position.set(-(stageWidth / 3) * scale, (perspCamY / 2) * scale, 0);
            spotLight.target.position.set(-(stageWidth / 3) * scale, stageHeight * scale, 0);
            spotLight.target.updateMatrixWorld();
            spotLightHelper1 = new THREE.SpotLightHelper(spotLight);
            spotLightHelper = spotLightHelper1;
        }
        else if (i == 1) {
            spotlight.position.set(0, (perspCamY / 2) * scale, 0);
            spotLight.position.set(0, (perspCamY / 2) * scale, 0);
            spotLight.target.position.set(0, stageHeight * scale, 0);
            spotLight.target.updateMatrixWorld();
            spotLightHelper2 = new THREE.SpotLightHelper(spotLight);
            spotLightHelper = spotLightHelper2;
        }
        else {
            spotlight.position.set((stageWidth / 3) * scale, (perspCamY / 2) * scale, 0);
            spotLight.position.set((stageWidth / 3) * scale, (perspCamY / 2) * scale, 0);
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

function createThreeShape(v1, v2, v3) {
    let geom = new THREE.Geometry();

    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);

    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );

    var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );
    return object;
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

    let bigStepGeometry = new THREE.BoxGeometry(stageWidth * scale, (2 * stageHeight / 3) * scale, stepDepth * scale);
    let bigStepMesh = new THREE.Mesh(bigStepGeometry, phongMaterialBig); 
    bigStepMesh.position.set(0, 0, 0);
    
    let smallStepGeometry = new THREE.BoxGeometry(stageWidth, (stageHeight / 3) * scale, stepDepth * scale);
    let smallStepMesh = new THREE.Mesh(smallStepGeometry, phongMaterialSmall); 
    smallStepMesh.position.set(0, - (stageHeight / 6) * scale, stepDepth * scale);

    steps.userData = {altMaterial: [lambertMaterialBig, lambertMaterialSmall], mesh: [bigStepMesh, smallStepMesh]};

    steps.add(smallStepMesh); 
    steps.add(bigStepMesh);
    steps.translateY((stageHeight / 3) * scale);
    steps.translateZ((stageDepth / 2 + stepDepth / 2) * scale);

    scene.add(steps);
}

function createStage() {
    'use strict';

    stage = new THREE.Object3D();
    
    // Gouraud Shading
    let lambertMaterial = new THREE.MeshLambertMaterial({ color: 0x55342b, wireframe: false });
    // Phong Shading
    let phongMaterial = new THREE.MeshPhongMaterial({ color: 0x55342b, wireframe: false });

    let geometry = new THREE.BoxGeometry(stageWidth * scale, stageHeight * scale, stageDepth * scale);
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

    let geometry = new THREE.PlaneGeometry(floorWidth * scale, floorLength * scale);
    let mesh = new THREE.Mesh(geometry, phongMaterial); 
    mesh.position.set(0, 0, 0);

    floor.userData = {altMaterial: [lambertMaterial], mesh: [mesh]};
    
    floor.add(mesh);
    floor.rotateX(-Math.PI/2);

    scene.add(floor);
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
    orthoCam.position.z = (floorWidth * 5) * scale;
    orthoCam.lookAt(scene.position);
    orthoCam.position.y = stageHeight * scale;

    camera = perspCam;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10 * scale));

    createFloor();
    createStage();
    createSteps();
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

    let objects = [floor, stage, steps, spotlight1, spotlight2, spotlight3];
    objects.forEach(function (item1, index1) {
        item1.userData.mesh.forEach(function (item2, index2) {
            let auxMaterial = item1.userData.altMaterial[index2];
            item1.userData.altMaterial[index2] = item2.material;
            item2.material = auxMaterial;
        });
    });
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
        case 65: // A
        case 97: // a, Alternate Materials
            alternateMaterials();
            break;

        case 68: // D
        case 100: // d, Directional Light
            dirLight.visible = !dirLight.visible;
            break;
        case 90: // Z
        case 122: // z, Spot Light 1
            spotLight1.visible = !spotLight1.visible;
            break;
        case 88: // Z
        case 120: // z, Spot Light 2
            spotLight2.visible = !spotLight2.visible;
            break;
        case 67: // C
        case 99: // c, Spot Light 3
            spotLight3.visible = !spotLight3.visible;
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
    createLights();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
}
