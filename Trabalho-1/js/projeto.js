/* global THREE */

var camera, scene, renderer, material, foundation, base, tower, roof, pivot, scale, 
    leftRod, rightRod, topRod, bottomRod, leftSail, rightSail, topSail, bottomSail, heart,
    doorRectangle, doorSemicircle;

var wireframeFlag = false;

var clock = new THREE.Clock();
var delta = 0;

function createDoor(x, y, z) {
    'use strict';

    doorRectangle = new THREE.Object3D();
    doorSemicircle = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x615750, wireframe: wireframeFlag });
    let geometryRectangle = new THREE.BoxGeometry(0.5 * scale, 3 * scale, 2 * scale);
    // let geometrySemicircle = new THREE.CylinderGeometry(1 * scale, 20, Math.PI, Math.PI);
    let geometrySemicircle = new THREE.CylinderGeometry(1 * scale, 1 * scale, 0.5 * scale, 20, 1, false, 0, Math.PI);
    let meshRectangle = new THREE.Mesh(geometryRectangle, material);
    let meshSemicircle = new THREE.Mesh(geometrySemicircle, material);

    doorRectangle.add(meshRectangle);
    doorSemicircle.add(meshSemicircle);

    doorRectangle.position.set(x, y, z);
    doorSemicircle.position.set(x, y + 1.5 * scale, z);

    doorSemicircle.rotateZ(Math.PI/2);

    scene.add(doorRectangle);
    scene.add(doorSemicircle);
}

function createHeart(x, y, z) {
    'use strict';

    heart = new THREE.Object3D();

    const shape = new THREE.Shape();
    /* x = -2.5;
    y = -5; */
    shape.moveTo(x - 2.5, y - 2.5);
    shape.bezierCurveTo(x - 2.5, y - 2.5, x - 2, y, x, y);
    shape.bezierCurveTo(x + 3, y, x + 3, y - 3.5, x + 3, y - 3.5);
    shape.bezierCurveTo(x + 3, y - 5.5, x + 1.5, y - 7.7, x - 2.5, y - 9.5);
    shape.bezierCurveTo(x - 6, y - 7.7, x - 8, y - 4.5, x - 8, y - 3.5);
    shape.bezierCurveTo(x - 8, y - 3.5, x - 8, y, x - 5, y);
    shape.bezierCurveTo(x - 3.5, y, x - 2.5, y - 2.5, x - 2.5, y - 2.5);

    const extrudeSettings = {
        steps: 2,  // ui: steps
        depth: 2,  // ui: depth
        bevelEnabled: true,  // ui: bevelEnabled
        bevelThickness: 1,  // ui: bevelThickness
        bevelSize: 1,  // ui: bevelSize
        bevelSegments: 2,  // ui: bevelSegments
    };

    material = new THREE.MeshBasicMaterial({ color: 0xF26800, wireframe: wireframeFlag });
    let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    let mesh = new THREE.Mesh(geometry, material);

    heart.add(mesh);
    heart.position.set(x, y, z);

    heart.scale.set(0.3, 0.3, 0.3);
    heart.rotateY(Math.PI/2);

    scene.add(heart);
}

function createVerticalSail(sail, x, y, z) {
    'use strict';

    sail = new THREE.Object3D();
    /* sail.userData = { jumping: true, step: 0 }; */

    material = new THREE.MeshBasicMaterial({ color: 0xfaecd8, wireframe: wireframeFlag });
    // let geometry = new THREE.PlaneGeometry(1 * scale, 5 * scale);
    let geometry = new THREE.BoxGeometry(0.1 * scale, 5 * scale, 1 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    sail.add(mesh);
    sail.position.set(x, y, z);

    scene.add(sail);
}

function createHorizontalSail(sail, x, y, z) {
    'use strict';

    sail = new THREE.Object3D();
    /* sail.userData = { jumping: true, step: 0 }; */

    material = new THREE.MeshBasicMaterial({ color: 0xfaecd8, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(0.1 * scale, 1 * scale, 5 * scale);
    // let geometry = new THREE.PlaneGeometry(1 * scale, 5 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    sail.add(mesh);
    sail.position.set(x, y, z);

    scene.add(sail);
}

function createVerticalRod(rod, x, y, z) {
    'use strict';

    rod = new THREE.Object3D();
    /* rod.userData = { jumping: true, step: 0 }; */

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
    /* rod.userData = { jumping: true, step: 0 }; */

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
    /* pivot.userData = { jumping: true, step: 0 }; */

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
    /* roof.userData = { jumping: true, step: 0 }; */

    material = new THREE.MeshBasicMaterial({ color: 0xc4bfc5, wireframe: wireframeFlag });
    let geometry = new THREE.CylinderGeometry(0.1 * scale, 4.25 * scale, 3 * scale, 4);
    // let geometry = new THREE.TetrahedronGeometry(5, 0);
    let mesh = new THREE.Mesh(geometry, material);


    roof.add(mesh);
    roof.position.set(x, y, z);
    
    roof.rotateX(0.0);
    roof.rotateY(Math.PI/4);
    roof.rotateZ(0.0);

    scene.add(roof);
}

function createTower(x, y, z) {
    'use strict';

    tower = new THREE.Object3D();
    /* tower.userData = { jumping: true, step: 0 }; */

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
    /* base.userData = { jumping: true, step: 0 }; */

    material = new THREE.MeshBasicMaterial({ color: 0xdbd1bf, wireframe: wireframeFlag });
    // let geometry = new THREE.BoxGeometry(10, 8, 10);
    let geometry = new THREE.CylinderGeometry(6 * scale, 6 * scale, 8 * scale, 20 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    base.add(mesh);
    base.position.set(x, y, z);

    scene.add(base);
}

function createFoundation(x, y, z) {
    'use strict';

    foundation = new THREE.Object3D();
    /* foundation.userData = { jumping: true, step: 0 }; */

    material = new THREE.MeshBasicMaterial({ color: 0xc4bfc5, wireframe: wireframeFlag });
    let geometry = new THREE.BoxGeometry(14 * scale, 2 * scale, 14 * scale);
    let mesh = new THREE.Mesh(geometry, material);

    foundation.add(mesh);
    foundation.position.set(x, y, z);

    scene.add(foundation);
}

/* function addTableTop(obj, x, y, z) {
    'use strict';

    let geometry = new THREE.BoxGeometry(60, 2, 20);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    obj.add(mesh);
}

function addTableLeg(obj, x, y, z) {
    'use strict';

    let geometry = new THREE.BoxGeometry(2 * scale, 6 * scale, 2 * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);

    obj.add(mesh);
} */

function render() {
    'use strict';
    renderer.render(scene, camera);
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
    createHeart(0 * scale, 21.7 * scale, 0 * scale);
    createDoor(3.25 * scale, 10.5 * scale, 0 * scale);
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
        case 83: // S
        case 115: // s
            /* ball.userData.jumping = !ball.userData.jumping; */
            break;
    }
}

function animate() {
    'use strict';

    /* var clock = new THREE.Clock();
    var delta = 0; */

    delta = clock.getDelta();

    /* if (ball.userData.jumping) {
        ball.userData.step += 5 * delta;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    } */
    render();

    requestAnimationFrame(animate);

}

function init() {
    'use strict';

    scale = 1.5;

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
}
