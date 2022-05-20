/* global THREE */

var perspCamera, orthoCamera, camera;

var scene, renderer, material

var foundation, base, tower, roof, openings, pivot, leftRod, rightRod, topRod, 
    bottomRod, leftSail, rightSail, topSail, bottomSail;

var clock, delta;

const foundationWidth = 14, foundationHeight = 2, foundationLength = 14, 
    baseRadius = 6, baseHeight = 8, towerWidth = 6, towerHeight = 14, 
    towerLength = 6, roofHeight = 3, pivotWidth = 3, pivotHeight = 1, 
    pivotLength = 1, doorWidth = 0.5, doorHeight = 4, doorLength = 2, 
    skylightWidth = 0.5, skylightHeight = 2, rodWidth = 0.5, rodHeight = 0.5, 
    rodLength = 6, sailWidth = 0.1, sailHeight = 1, sailLength = 5;

const leftFlag = 0, rightFlag = 1, topFlag = 0, bottomFlag = 1;

const sailRotationLimit = Math.PI / 4;

const movingFactor = 5, rotationFactor = 1;

const scale = 1.5;

function createHorizontalSail(object, flag) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xfaecd8, wireframe: true });
    let geometry = new THREE.BoxGeometry(sailWidth * scale, sailHeight * scale, sailLength * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, Math.pow(-1, flag) * (rodHeight / 2 + sailHeight / 2) * scale, 0);

    object.add(mesh);
}

function createVerticalSail(object, flag) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xfaecd8, wireframe: true });
    let geometry = new THREE.BoxGeometry(sailWidth * scale, sailLength * scale, sailHeight * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, Math.pow(-1, flag) * (rodHeight / 2 + sailHeight / 2) * scale);

    object.add(mesh);
}

function createHorizontalRod(object, flag) {
    'use strict';

    if (flag == leftFlag) {
        object.add(leftSail);
    }
    else {
        object.add(rightSail);
    }

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.BoxGeometry(rodWidth * scale, rodHeight * scale, rodLength * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);

    object.add(mesh);
    object.position.set((pivotWidth / 2 - 0.5 - rodWidth / 2) * scale, 0, -Math.pow(-1, flag) * (pivotHeight / 2 + rodLength / 2) * scale);
}

function createVerticalRod(object, flag) {
    'use strict';

    if (flag == topFlag) {
        object.add(topSail);
    }
    else {
        object.add(bottomSail);
    }

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.BoxGeometry(rodWidth * scale, rodLength * scale, rodHeight * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);

    object.add(mesh);
    object.position.set((pivotWidth / 2 - 0.5 - rodWidth / 2) * scale, Math.pow(-1, flag) * (pivotHeight / 2 + rodLength / 2) * scale, 0);
}

function createPivot(object) {
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
}

function createRoof(object) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xc4bfc5, wireframe: true });
    let geometry = new THREE.CylinderGeometry(0.1 * scale, (Math.sqrt(2 * towerWidth * towerLength) / 2) * scale, roofHeight * scale, 4);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotateY(Math.PI/4);
    mesh.position.set(0, (towerHeight / 2 + roofHeight / 2) * scale, 0);

    object.add(mesh);
}

function createTower(object) {
    'use strict';

    object.add(pivot);

    material = new THREE.MeshBasicMaterial({ color: 0xfbe5bc, wireframe: true });
    let geometry = new THREE.BoxGeometry(towerWidth * scale, towerHeight * scale, towerLength * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);

    object.add(mesh);
    object.position.set(0, (baseHeight / 2 + towerHeight / 2) * scale, 0);
}

function createSkylight(object) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0x615750, wireframe: true });
    let geometry = new THREE.BoxGeometry(Math.sqrt(skylightHeight) * scale, Math.sqrt(skylightHeight) * scale, skylightWidth * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotateY(Math.PI/2);
    mesh.rotateZ(Math.PI/4);
    mesh.position.set(0, (1 + doorHeight / 2 + skylightHeight / 2) * scale, 0);

    object.add(mesh);
}

function createDoor(object) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0x615750, wireframe: true });
    let geometryRectangle = new THREE.BoxGeometry(doorWidth * scale, (doorHeight - doorLength / 2) * scale, doorLength * scale);
    let meshRectangle = new THREE.Mesh(geometryRectangle, material);
    meshRectangle.position.set(0, - (doorLength / 4) * scale, 0);
    
    material = new THREE.MeshBasicMaterial({ color: 0x615750, wireframe: true });
    let geometrySemicircle = new THREE.CylinderGeometry((doorLength / 2) * scale, (doorLength / 2) * scale, doorWidth * scale, 20, 1, false, 0, Math.PI);
    let meshSemicircle = new THREE.Mesh(geometrySemicircle, material);
    meshSemicircle.rotateZ(Math.PI/2);
    meshSemicircle.position.set(0, ((doorHeight - doorLength / 2) / 2 - doorLength / 4) * scale, 0);

    object.add(meshRectangle);
    object.add(meshSemicircle);
    object.position.set((towerWidth / 2 + doorWidth / 2) * scale, (baseHeight / 2 + doorHeight / 2) * scale, 0);
}

function createBase(object) {
    'use strict';

    object.add(openings);
    object.add(tower);

    material = new THREE.MeshBasicMaterial({ color: 0xdbd1bf, wireframe: true });
    let geometry = new THREE.CylinderGeometry(baseRadius * scale, baseRadius * scale, baseHeight * scale, 20 * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);

    object.add(mesh);
    object.position.set(0, (foundationHeight / 2 + baseHeight / 2) * scale, 0);
}

function createFoundation(object) {
    'use strict';

    object.add(base);

    material = new THREE.MeshBasicMaterial({ color: 0xc4bfc5, wireframe: true });
    let geometry = new THREE.BoxGeometry(foundationWidth * scale, foundationHeight * scale, foundationLength * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);

    object.add(mesh);
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

    leftSail = new THREE.Object3D();
    leftSail.userData = {rotating: false, limit: sailRotationLimit, incrementFactor: rotationFactor, angleZ: 0};
    createHorizontalSail(leftSail, leftFlag);
    leftRod = new THREE.Object3D();
    createHorizontalRod(leftRod, leftFlag);

    rightSail = new THREE.Object3D();
    rightSail.userData = {rotating: false, limit: sailRotationLimit, incrementFactor: rotationFactor, angleZ: 0};
    createHorizontalSail(rightSail, rightFlag);
    rightRod = new THREE.Object3D();
    createHorizontalRod(rightRod, rightFlag);
    
    topSail = new THREE.Object3D();
    topSail.userData = {rotating: false, limit: sailRotationLimit, incrementFactor: rotationFactor, angleY: 0};
    createVerticalSail(topSail, topFlag);
    topRod = new THREE.Object3D();
    createVerticalRod(topRod, topFlag);

    bottomSail = new THREE.Object3D();
    bottomSail.userData = {rotating: false, limit: sailRotationLimit, incrementFactor: rotationFactor, angleY: 0};
    createVerticalSail(bottomSail, bottomFlag);
    bottomRod = new THREE.Object3D();
    createVerticalRod(bottomRod, bottomFlag);

    pivot = new THREE.Object3D();
    pivot.userData = {rotating: false, incrementFactor: rotationFactor};
    createPivot(pivot);

    tower = new THREE.Object3D();
    createRoof(tower);
    createTower(tower);

    openings = new THREE.Object3D();
    createSkylight(openings);
    createDoor(openings);

    base = new THREE.Object3D();
    base.userData = {rotating: false, incrementFactor: rotationFactor};
    createBase(base);

    foundation = new THREE.Object3D();
    foundation.userData = {movingX: false, movingY: false, movingZ: false, incrementFactorX: movingFactor, incrementFactorY: movingFactor, incrementFactorZ: movingFactor};
    createFoundation(foundation);

    scene.add(foundation);
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

        case 81: // Q
        case 113: // q, Rotate Base Positively
            if (base.userData.rotating == false) {
                base.userData.rotating = true;
                base.userData.incrementFactor = rotationFactor;
            }
            break;
        case 87: // W
        case 119: // w, Rotate Base Negatively
            if (base.userData.rotating == false) {
                base.userData.rotating = true;
                base.userData.incrementFactor = -rotationFactor;
            }
            break;
        case 65: // A
        case 97: // a, Rotate Pivot Positively
            if (pivot.userData.rotating == false) {
                pivot.userData.rotating = true;
                pivot.userData.incrementFactor = rotationFactor;
            }
            break;
        case 83: // S
        case 115: // s, Rotate Pivot Negatively
            if (pivot.userData.rotating == false) {
                pivot.userData.rotating = true;
                pivot.userData.incrementFactor = -rotationFactor;
            }
            break;
        case 90: // Z
        case 122: // z, Rotate Sails Starting Positively
            if (leftSail.userData.rotating == false) {
                leftSail.userData.rotating = true;
                leftSail.userData.incrementFactor = rotationFactor;
            }
            if (rightSail.userData.rotating == false) {
                rightSail.userData.rotating = true;
                rightSail.userData.incrementFactor = -rotationFactor;
            }
            if (topSail.userData.rotating == false) {
                topSail.userData.rotating = true;
                topSail.userData.incrementFactor = -rotationFactor;
            }
            if (bottomSail.userData.rotating == false) {
                bottomSail.userData.rotating = true;
                bottomSail.userData.incrementFactor = rotationFactor;
            }
            break;
        case 88: // X
        case 120: // x, Rotate Sails Starting Negatively
            if (leftSail.userData.rotating == false) {
                leftSail.userData.rotating = true;
                leftSail.userData.incrementFactor = -rotationFactor;
            }
            if (rightSail.userData.rotating == false) {
                rightSail.userData.rotating = true;
                rightSail.userData.incrementFactor = rotationFactor;
            }
            if (topSail.userData.rotating == false) {
                topSail.userData.rotating = true;
                topSail.userData.incrementFactor = rotationFactor;
            }
            if (bottomSail.userData.rotating == false) {
                bottomSail.userData.rotating = true;
                bottomSail.userData.incrementFactor = -rotationFactor;
            }
            break;
        
        case 39: // right arrow, Move Articulated Object on X Axis Positively 
            if (foundation.userData.movingX == false) {
                foundation.userData.movingX = true;
                foundation.userData.incrementFactorX = movingFactor;
            }
            break;
        case 37: // left arrow, Move Articulated Object on X Axis Negatively
            if (foundation.userData.movingX == false) {
                foundation.userData.movingX = true;
                foundation.userData.incrementFactorX = -movingFactor;
            }
            break;
        case 38: //up arrow, Move Articulated Object on Y Axis Positively
            if (foundation.userData.movingY == false) {
                foundation.userData.movingY  = true;
                foundation.userData.incrementFactorY = movingFactor;
            }
            break;
        case 40: //down arrow, Move Articulated Object on Y Axis Negatively
            if (foundation.userData.movingY  == false) {
                foundation.userData.movingY = true;
                foundation.userData.incrementFactorY = -movingFactor;
            }
            break;
        case 68: //D
        case 100: //d, Move Articulated Object on Z Axis Positively
            if (foundation.userData.movingZ  == false) {
                foundation.userData.movingZ = true;
                foundation.userData.incrementFactorZ = movingFactor;
            }
            break;
        case 67: //C
        case 99: //c, Move Articulated Object on Z Axis Negatively
            if (foundation.userData.movingZ  == false) {
                foundation.userData.movingZ = true;
                foundation.userData.incrementFactorZ = -movingFactor;
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
            base.userData.rotating = false;
            break;
        case 65: // A
        case 97: // a
        case 83: // S
        case 115: // s
            pivot.userData.rotating = false;
            break;
        case 90: // Z
        case 122: // z
        case 88: // X
        case 122: // x
            leftSail.userData.rotating = false;
            rightSail.userData.rotating = false;
            topSail.userData.rotating = false;
            bottomSail.userData.rotating = false;
            break;
            
        case 39: // right arrow
        case 37: // left arrow
            foundation.userData.movingX = false;
            break;
        case 38: //up arrow
        case 40: //down arrow
            foundation.userData.movingY  = false;
            break;
        case 68: //D
        case 100: //d
        case 67: //C
        case 99: //c
            foundation.userData.movingZ  = false;
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

    if (leftSail.userData.rotating) {
        if (leftSail.userData.limit <= leftSail.userData.angleZ) {
            leftSail.userData.incrementFactor = -1;
        }
        else if (-leftSail.userData.limit >= leftSail.userData.angleZ) {
            leftSail.userData.incrementFactor = 1;
        }
        let step = leftSail.userData.incrementFactor * delta;
        leftSail.userData.angleZ += step;
        leftSail.rotateZ(step);
    }
    if (rightSail.userData.rotating) {
        if (rightSail.userData.limit <= rightSail.userData.angleZ) {
            rightSail.userData.incrementFactor = -1;
        }
        else if (-rightSail.userData.limit >= rightSail.userData.angleZ) {
            rightSail.userData.incrementFactor = 1;
        }
        let step = rightSail.userData.incrementFactor * delta;
        rightSail.userData.angleZ += step;
        rightSail.rotateZ(step);
    }
    if (topSail.userData.rotating) {
        if (topSail.userData.limit <= topSail.userData.angleY) {
            topSail.userData.incrementFactor = -1;
        }
        else if (-topSail.userData.limit >= topSail.userData.angleY) {
            topSail.userData.incrementFactor = 1;
        }
        let step = topSail.userData.incrementFactor * delta;
        topSail.userData.angleY += step;
        topSail.rotateY(step);
    }
    if (bottomSail.userData.rotating) {
        if (bottomSail.userData.limit <= bottomSail.userData.angleY) {
            bottomSail.userData.incrementFactor = -1;
        }
        else if (-bottomSail.userData.limit >= bottomSail.userData.angleY) {
            bottomSail.userData.incrementFactor = 1;
        }
        let step = bottomSail.userData.incrementFactor * delta;
        bottomSail.userData.angleY += step;
        bottomSail.rotateY(step);
    }

    if (pivot.userData.rotating) {
        let step = pivot.userData.incrementFactor * delta;
        pivot.rotateX(step);
    }

    if (base.userData.rotating) {
        let step = base.userData.incrementFactor * delta;
        base.rotateY(step);
    }

    if (foundation.userData.movingX) {
        let step = foundation.userData.incrementFactorX * delta;
        foundation.translateX(step);
    }
    if (foundation.userData.movingY) {
        let step = foundation.userData.incrementFactorY * delta;
        foundation.translateY(step);
    }
    if (foundation.userData.movingZ) {
        let step = foundation.userData.incrementFactorZ * delta;
        foundation.translateZ(step);
    }

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
