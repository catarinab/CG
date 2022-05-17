/* global THREE */

var perspectiveCamera, orthoCamera1, orthoCamera2, orthoCamera3, camera;

var scene, renderer, material

var scale;

var foundation, base, tower, roof, doorRectangle, doorSemicircle, skylight, pivot, 
    leftRod, rightRod, topRod, bottomRod, leftSail, rightSail, topSail, bottomSail;

var pivotGroup, towerGroup, baseGroup, foundationGroup;

var clock, delta;

var wireframeFlag = true;

function createDoor(x, y, z) {
    'use strict';

    doorRectangle = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x615750, wireframe: wireframeFlag });
    let geometryRectangle = new THREE.BoxGeometry(0.5 * scale, 3 * scale, 2 * scale);
    let meshRectangle = new THREE.Mesh(geometryRectangle, material);

    doorRectangle.add(meshRectangle);
    doorRectangle.position.set(x, y, z);

    doorSemicircle = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x615750, wireframe: wireframeFlag });
    let geometrySemicircle = new THREE.CylinderGeometry(1 * scale, 1 * scale, 0.5 * scale, 20, 1, false, 0, Math.PI);
    let meshSemicircle = new THREE.Mesh(geometrySemicircle, material);

    doorSemicircle.add(meshSemicircle);
    doorSemicircle.position.set(x, y + 1.5 * scale, z);
    doorSemicircle.rotateZ(Math.PI/2);
}

function createSkylight(x, y, z) {
    'use strict';

    skylight = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x615750, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(Math.sqrt(2) * scale, Math.sqrt(2) * scale, 0.1 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    skylight.add(mesh);
    skylight.position.set(x, y, z);

    skylight.rotateY(Math.PI/2);
    skylight.rotateZ(Math.PI/4);
}

function createVerticalSail(sail, x, y, z) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xfaecd8, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(0.1 * scale, 5 * scale, 1 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    sail.add(mesh);
    sail.position.set(x, y, z);
}

function createHorizontalSail(sail, x, y, z) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xfaecd8, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(0.1 * scale, 1 * scale, 5 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    sail.add(mesh);
    sail.position.set(x, y, z);
}

function createVerticalRod(rod, x, y, z) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(0.5 * scale, 6 * scale, 0.5 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    rod.add(mesh);
    rod.position.set(x, y, z);
}

function createHorizontalRod(rod, x, y, z) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(0.5 * scale, 0.5 * scale, 6 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    rod.add(mesh);
    rod.position.set(x, y, z);
}

function createPivot(x, y, z) {
    'use strict';

    pivot = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(1 * scale, 1 * scale, 1 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    pivot.add(mesh);
    pivot.position.set(x, y, z);
}

function createRoof(x, y, z) {
    'use strict';

    roof = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xc4bfc5, wireframe: wireframeFlag });
    let geometry = new THREE.CylinderGeometry(0.1 * scale, 4.25 * scale, 3 * scale, 4);
    let mesh = new THREE.Mesh(geometry, material);


    roof.add(mesh);
    roof.position.set(x, y, z);
    roof.rotateY(Math.PI/4);
}

function createTower(x, y, z) {
    'use strict';

    tower = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xfbe5bc, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(6 * scale, 14 * scale, 6 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    tower.add(mesh);
    tower.position.set(x, y, z);
}

function createBase(x, y, z) {
    'use strict';

    base = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xdbd1bf, wireframe: wireframeFlag });
    let geometry = new THREE.CylinderGeometry(6 * scale, 6 * scale, 8 * scale, 20 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    base.add(mesh);
    base.position.set(x, y, z);
}

function createFoundation(x, y, z) {
    'use strict';

    foundation = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xc4bfc5, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(14 * scale, 2 * scale, 14 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    foundation.add(mesh);
    foundation.position.set(x, y, z);
}

function createCameras() {
    'use strict';
    perspectiveCamera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight, 1, 1000);
    perspectiveCamera.position.x = 50;
    perspectiveCamera.position.y = 50;
    perspectiveCamera.position.z = 50;
    perspectiveCamera.lookAt(scene.position);
    
    orthoCamera1 = new THREE.OrthographicCamera(window.innerWidth / - 2, 
        window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    orthoCamera1.position.x = 0;
    orthoCamera1.position.y = 0;
    orthoCamera1.position.z = 0;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));

    pivotGroup = new THREE.Group();
    createPivot(3.5 * scale, 21.5 * scale, 0 * scale);
    pivotGroup.add(pivot);
    leftRod = new THREE.Object3D();
    createHorizontalRod(leftRod, 3.5 * scale, 21.5 * scale, 3.5 * scale);
    pivotGroup.add(leftRod);
    rightRod = new THREE.Object3D();
    createHorizontalRod(rightRod, 3.5 * scale, 21.5 * scale, -3.5 * scale);
    pivotGroup.add(rightRod);
    topRod = new THREE.Object3D();
    createVerticalRod(topRod, 3.5 * scale, 25 * scale, 0 * scale);
    pivotGroup.add(topRod);
    bottomRod = new THREE.Object3D();
    createVerticalRod(bottomRod, 3.5 * scale, 18 * scale, 0 * scale);
    pivotGroup.add(bottomRod);
    leftSail = new THREE.Object3D();
    createHorizontalSail(leftSail, 3.5 * scale, 20.75 * scale, 3.5 * scale);
    pivotGroup.add(leftSail);
    rightSail = new THREE.Object3D();
    createHorizontalSail(rightSail, 3.5 * scale, 22.25 * scale, -3.5 * scale);
    pivotGroup.add(rightSail);
    topSail = new THREE.Object3D();
    createVerticalSail(topSail, 3.5 * scale, 25 * scale, 0.75 * scale);
    pivotGroup.add(topSail);
    bottomSail = new THREE.Object3D();
    createVerticalSail(bottomSail, 3.5 * scale, 18 * scale, -0.75 * scale);
    pivotGroup.add(bottomSail);

    towerGroup = new THREE.Group();
    towerGroup.add(pivotGroup);
    createTower(0 * scale, 16 * scale, 0 * scale);
    towerGroup.add(tower);
    createRoof(0 * scale, 24.5 * scale, 0 * scale);
    towerGroup.add(roof);
    createDoor(3.25 * scale, 10.5 * scale, 0 * scale);
    towerGroup.add(doorRectangle);
    towerGroup.add(doorSemicircle);
    createSkylight(3 * scale, 15 * scale, 0 * scale);
    towerGroup.add(skylight);

    baseGroup = new THREE.Group();
    baseGroup.add(towerGroup);
    createBase(0 * scale, 5 * scale, 0 * scale);
    baseGroup.add(base);

    foundationGroup = new THREE.Group();
    foundationGroup.add(baseGroup)
    createFoundation(0 * scale, 0 * scale, 0 * scale);
    foundationGroup.add(foundation);

    scene.add(foundationGroup);
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (camera == perspectiveCamera) {
        if (window.innerHeight > 0 && window.innerWidth > 0) {
            camera.aspect = renderer.getSize().width / renderer.getSize().height;
            camera.updateProjectionMatrix();
        }
    }
    else {
        if (window.innerHeight > 0 && window.innerWidth > 0) {
            camera.left = window.innerWidth / - 2;
            camera.right = window.innerWidth / 2;
            camera.bottom = window.innerHeight / -2;
            camera.bottom = window.innerHeight / 2;
            camera.updateProjectionMatrix();
        }
    }
}

function onKeyDown(e) {
    'use strict';

    switch(e.keyCode) {
        case 49: //1
            camera = orthoCamera1;
            break;
        case 50: //2
            camera = orthoCamera2;
            break;
        case 51: //3
            camera = orthoCamera3;
            break;
        case 52: //4
            scene.traverse(function(node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
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

    scale = 1.5;

    clock = new THREE.Clock();
    delta = 0

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();

    createCameras();
    camera = perspectiveCamera;

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
}
