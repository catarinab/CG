/* global THREE */

var camera, scene, renderer, material

var scale;

var foundation, base, tower, roof, pivot, leftRod, rightRod, topRod, bottomRod, 
    leftSail, rightSail, topSail, bottomSail, doorRectangle, doorSemicircle, skylight;

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

    scene.add(doorRectangle);

    doorSemicircle = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x615750, wireframe: wireframeFlag });
    let geometrySemicircle = new THREE.CylinderGeometry(1 * scale, 1 * scale, 0.5 * scale, 20, 1, false, 0, Math.PI);
    let meshSemicircle = new THREE.Mesh(geometrySemicircle, material);

    doorSemicircle.add(meshSemicircle);
    doorSemicircle.position.set(x, y + 1.5 * scale, z);
    doorSemicircle.rotateZ(Math.PI/2);

    scene.add(doorSemicircle);
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

    scene.add(skylight);
}

function createVerticalSail(sail, x, y, z) {
    'use strict';

    sail = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xfaecd8, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(0.1 * scale, 5 * scale, 1 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    sail.add(mesh);
    sail.position.set(x, y, z);

    scene.add(sail);
}

function createHorizontalSail(sail, x, y, z) {
    'use strict';

    sail = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xfaecd8, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(0.1 * scale, 1 * scale, 5 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    sail.add(mesh);
    sail.position.set(x, y, z);

    scene.add(sail);
}

function createVerticalRod(rod, x, y, z) {
    'use strict';

    rod = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(0.5 * scale, 6 * scale, 0.5 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    rod.add(mesh);
    rod.position.set(x, y, z);

    scene.add(rod);
}

function createHorizontalRod(rod, x, y, z) {
    'use strict';

    rod = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(0.5 * scale, 0.5 * scale, 6 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    rod.add(mesh);
    rod.position.set(x, y, z);

    scene.add(rod);
}

function createPivot(x, y, z) {
    'use strict';

    pivot = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(1 * scale, 1 * scale, 1 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    pivot.add(mesh);
    pivot.position.set(x, y, z);

    scene.add(pivot);
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

    scene.add(roof);
}

function createTower(x, y, z) {
    'use strict';

    tower = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xfbe5bc, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(6 * scale, 14 * scale, 6 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    tower.add(mesh);
    tower.position.set(x, y, z);

    scene.add(tower);
}

function createBase(x, y, z) {
    'use strict';

    base = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xdbd1bf, wireframe: wireframeFlag });
    let geometry = new THREE.CylinderGeometry(6 * scale, 6 * scale, 8 * scale, 20 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    base.add(mesh);
    base.position.set(x, y, z);

    scene.add(base);
}

function createFoundation(x, y, z) {
    'use strict';

    foundation = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xc4bfc5, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(14 * scale, 2 * scale, 14 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    foundation.add(mesh);
    foundation.position.set(x, y, z);

    scene.add(foundation);
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);

    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));

    createFoundation(0 * scale, 0 * scale, 0 * scale);
    createBase(0 * scale, 5 * scale, 0 * scale);
    createTower(0 * scale, 16 * scale, 0 * scale);
    createRoof(0 * scale, 24.5 * scale, 0 * scale);
    createPivot(3.5 * scale, 21.5 * scale, 0 * scale);
    createHorizontalRod(leftRod, 3.5 * scale, 21.5 * scale, 3.5 * scale);
    createHorizontalRod(rightRod, 3.5 * scale, 21.5 * scale, -3.5 * scale);
    createVerticalRod(topRod, 3.5 * scale, 25 * scale, 0 * scale);
    createVerticalRod(bottomRod, 3.5 * scale, 18 * scale, 0 * scale);
    createHorizontalSail(leftSail, 3.5 * scale, 20.75 * scale, 3.5 * scale);
    createHorizontalSail(rightSail, 3.5 * scale, 22.25 * scale, -3.5 * scale);
    createVerticalSail(topSail, 3.5 * scale, 25 * scale, 0.75 * scale);
    createVerticalSail(bottomSail, 3.5 * scale, 18 * scale, -0.75 * scale);
    createDoor(3.25 * scale, 10.5 * scale, 0 * scale);
    createSkylight(3 * scale, 15 * scale, 0 * scale);
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = renderer.getSize().width / renderer.getSize().height;
        camera.updateProjectionMatrix();
    }
}

function onKeyDown(e) {
    'use strict';

    switch(e.keyCode) {
        case 65: // A
        case 97: // a
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
    createCamera();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
}
