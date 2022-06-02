/* global THREE */

var orthoCam, fixedPerspCam, perspCam, camera;

var scene, renderer;

var clock, delta;

// Objects
var planet, rocket, rocketGroup, trash, trashQuad1, trashQuad2, trashQuad3, trashQuad4, trashToRemove, trashRemoved;

const scale = 1, rotationFactor = Math.PI / 5, trashNumber = 30;

// Objects Scales
const planetRadius = 36, rocketWingspan = planetRadius / 12, trashWingspan = planetRadius / 20, objectOrbit = planetRadius * 1.2;

class ObjectCollision extends THREE.Object3D {
    //Constructor
    constructor(radius) {
        super();

        this.radius = 0;
        this.theta = 0;
        this.phi = 0;
        
        this.hitboxRadius = radius;

        let material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        let geometry = new THREE.SphereGeometry(radius, 10 * scale, 10 * scale);
        let mesh = new THREE.Mesh(geometry, material);
        mesh.material.transparent = true;
        mesh.material.opacity = 0.5;
        mesh.visible = false;
        this.hitbox = mesh;

        this.add(this.hitbox);
    }

    //Methods
    hitboxVisible() {
        this.hitbox.visible = !this.hitbox.visible;
    }

    sphericalSet(radius, theta, phi) {
        this.radius = radius;
        this.theta = theta;
        this.phi = phi;

        let x = radius * Math.cos(theta) * Math.sin(phi);
        let z = radius * Math.sin(theta) * Math.sin(phi);
        let y = radius * Math.cos(phi);
        
        this.position.set(x, y, z);
    }

    collisionCheck(object) {
        return (this.hitboxRadius + object.hitboxRadius) ** 2 >= (this.position.x - object.position.x) ** 2 + (this.position.y - object.position.y) ** 2 + (this.position.z - object.position.z) ** 2;
    }
}

function randomAngle() {
    return Math.random() * 2 * Math.PI;
}

function createPlanet() {
    'use strict';

    planet = new THREE.Object3D();
    
    //const texture = new THREE.TextureLoader().load('./assets/earthmap1k.jpg');
    let material = new THREE.MeshBasicMaterial({ color: 0x4fd0e7, wireframe: true });
    let geometry = new THREE.SphereGeometry(planetRadius * scale, 30 * scale, 30 * scale);
    let mesh = new THREE.Mesh(geometry, material); 
    mesh.position.set(0, 0, 0);
    
    planet.add(mesh);  
    scene.add(planet);
}

function createRocket() {
    'use strict';

    rocket = new THREE.Object3D();
    
    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    let geometry = new THREE.CylinderGeometry(0.1 * scale, (rocketWingspan / 6) * scale, (rocketWingspan / 3) * scale, 10 * scale);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, ((rocketWingspan / 3 + 2 * rocketWingspan / 6) / 2) * scale, 0);
    rocket.add(mesh);  

    material = new THREE.MeshBasicMaterial({ color: 0xdc143c, wireframe: true });
    geometry = new THREE.CylinderGeometry((rocketWingspan / 6) * scale, (rocketWingspan / 6) * scale, (2 * rocketWingspan / 3) * scale, 10 * scale);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -((rocketWingspan / 3) / 2) * scale, 0);
    rocket.add(mesh); 

    material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    geometry = new THREE.CapsuleGeometry((rocketWingspan / 12) * scale, (rocketWingspan / 3 - rocketWingspan / 6) * scale, 10 * scale, 10 * scale);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set((rocketWingspan / 6) * scale, -((2 * rocketWingspan / 3) / 2) * scale, 0)
    rocket.add(mesh);

    material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    geometry = new THREE.CapsuleGeometry((rocketWingspan / 12) * scale, (rocketWingspan / 3 - rocketWingspan / 6) * scale, 10 * scale, 10 * scale);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-(rocketWingspan / 6) * scale, -((2 * rocketWingspan / 3) / 2) * scale, 0);
    rocket.add(mesh); 

    material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    geometry = new THREE.CapsuleGeometry((rocketWingspan / 12) * scale, (rocketWingspan / 3 - rocketWingspan / 6) * scale, 10 * scale, 10 * scale);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -((2 * rocketWingspan / 3) / 2) * scale, (rocketWingspan / 6) * scale);
    rocket.add(mesh);

    material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    geometry = new THREE.CapsuleGeometry((rocketWingspan / 12) * scale, (rocketWingspan / 3 - rocketWingspan / 6) * scale, 10 * scale, 10 * scale);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -((2 * rocketWingspan / 3) / 2) * scale, -(rocketWingspan / 6) * scale);
    rocket.add(mesh); 
    
    rocketGroup = new ObjectCollision((rocketWingspan / 2) * scale);
    rocketGroup.userData = {factorLong: 0, factorLat: 0, factorInvert: 1};
    rocketGroup.add(rocket);
    rocketGroup.sphericalSet(objectOrbit * scale, 0, Math.PI / 2);

    scene.add(rocketGroup);
    rocketGroup.lookAt(scene.position);
}

function selectTrashQuad(object) {
    if (object.position.y + object.hitboxRadius > 0) {
        if (object.position.z + object.hitboxRadius > 0) {
            trash = trashQuad2;
        }
        else {
            trash = trashQuad1;
        }
    }
    else {
        if (object.position.z + object.hitboxRadius > 0) {
            trash = trashQuad3;
        }
        else {
            trash = trashQuad4;
        }
    }
}

function createDodecahedron() {
    'use strict';

    let material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.DodecahedronBufferGeometry((trashWingspan / 2) * scale);
    let mesh = new THREE.Mesh(geometry, material);

    var dodecahedron = new ObjectCollision((trashWingspan / 2) * scale);
    dodecahedron.add(mesh); 
    
    dodecahedron.sphericalSet(objectOrbit * scale, randomAngle(), randomAngle());
    selectTrashQuad(dodecahedron);
    trash.push(dodecahedron);

    scene.add(dodecahedron);
}

function createIcosahedron() {
    'use strict';

    let material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.IcosahedronBufferGeometry((trashWingspan / 2) * scale);
    let mesh = new THREE.Mesh(geometry, material);

    var icosahedron = new ObjectCollision((trashWingspan / 2) * scale);
    icosahedron.add(mesh);
    
    icosahedron.sphericalSet(objectOrbit * scale, randomAngle(), randomAngle());
    selectTrashQuad(icosahedron);
    trash.push(icosahedron);

    scene.add(icosahedron);
}

function createOctahedron() {
    'use strict';

    let material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.OctahedronBufferGeometry((trashWingspan / 2) * scale);
    let mesh = new THREE.Mesh(geometry, material);;    

    var octahedron = new ObjectCollision((trashWingspan / 2) * scale);
    octahedron.add(mesh);

    octahedron.sphericalSet(objectOrbit * scale, randomAngle(), randomAngle());
    selectTrashQuad(octahedron);
    trash.push(octahedron);

    scene.add(octahedron);
}

function createSphere() {
    'use strict';

    let material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.SphereBufferGeometry((trashWingspan / 2) * scale, 10 * scale, 10 * scale);
    let mesh = new THREE.Mesh(geometry, material);   

    var sphere = new ObjectCollision((trashWingspan / 2) * scale);
    sphere.add(mesh); 

    sphere.sphericalSet(objectOrbit * scale, randomAngle(), randomAngle());
    selectTrashQuad(sphere);
    trash.push(sphere);

    scene.add(sphere);
}

function createBox() {
    'use strict';

    let material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.BoxBufferGeometry(trashWingspan * scale, trashWingspan * scale, trashWingspan * scale);
    let mesh = new THREE.Mesh(geometry, material);   

    var box = new ObjectCollision(trashWingspan * scale);
    box.add(mesh);

    box.sphericalSet(objectOrbit * scale, randomAngle(), randomAngle());
    selectTrashQuad(box);
    trash.push(box);

    scene.add(box);
}

function createTrash() {
    for (let i = 0; i < trashNumber / 5; i++) {
        createDodecahedron();
        createIcosahedron();
        createOctahedron();
        createSphere();
        createBox();
    }
}

function createCameras() {
    'use strict';
    
    orthoCam = new THREE.OrthographicCamera(window.innerWidth / - 2, 
        window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    orthoCam.zoom = 7 / scale;
    orthoCam.updateProjectionMatrix();
    orthoCam.position.x = 50 * scale;
    orthoCam.position.y = 0;
    orthoCam.position.z = 0;
    orthoCam.lookAt(scene.position);

    fixedPerspCam = new THREE.PerspectiveCamera(70, 
        window.innerWidth / window.innerHeight, 1, 1000);
    fixedPerspCam.position.x = 80 * scale;
    fixedPerspCam.position.y = 0;
    fixedPerspCam.position.z = 0;
    fixedPerspCam.lookAt(scene.position);

    perspCam = new THREE.PerspectiveCamera(70, 
        window.innerWidth / window.innerHeight, 1, 1000);
    perspCam.position.x = 0;
    perspCam.position.y = -5 * scale;
    perspCam.position.z = -5 * scale;
    perspCam.lookAt(scene.position);
    rocket.add(perspCam);

    camera = orthoCam;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10 * scale));

    createPlanet();

    createRocket();
    rocketGroup.add(new THREE.AxesHelper(1 * scale));

    createTrash();
}

function deleteTrash() {
    for (let i = 0; i < trashToRemove.length; i++) {
        trashToRemove[i].removeFromParent();
        trashRemoved.push(trashToRemove[i]);
    }
    trashToRemove = [];
}

function collisionsRocket() {
    selectTrashQuad(rocketGroup);
    for (let i = 0; i < trash.length; i++) {
        if (rocketGroup.collisionCheck(trash[i])) {
            trashToRemove.push(trash[i]);
            trash.splice(i, 1);
        }
    }
}

function moveRocket() {
    let step;

    let newPhi = rocketGroup.phi;
    let newTheta = rocketGroup.theta;
    if (rocketGroup.userData.factorLat != 0) {
        step = rocketGroup.userData.factorLat * delta;
        newPhi += step;
        if (newPhi > 2 * Math.PI) {
            newPhi -= 2 * Math.PI;
        }
        else if (newPhi < 0) {
            newPhi += 2 * Math.PI;
        }
        if ((rocketGroup.phi < Math.PI && newPhi >= Math.PI) || (rocketGroup.phi > Math.PI && newPhi <= Math.PI)) {
            rocketGroup.userData.factorInvert = -rocketGroup.userData.factorInvert;
            rocketGroup.up.multiplyScalar(-1);
        }
    }

    if (rocketGroup.userData.factorLong != 0) {
        step = rocketGroup.userData.factorInvert * rocketGroup.userData.factorLong * delta;
        newTheta += step;
        if (newTheta > 2 * Math.PI) {
            newTheta -= 2 * Math.PI;
        }
        else if (newTheta < 0) {
            newTheta += 2 * Math.PI;
        }
    }

    rocketGroup.sphericalSet(rocketGroup.radius, newTheta, newPhi);
    rocketGroup.lookAt(scene.position);
    if (rocketGroup.userData.factorLat < 0 && rocketGroup.userData.factorLong < 0) {
        rocket.rotation.z = Math.PI / 4;
    }
    else if (rocketGroup.userData.factorLat < 0 && rocketGroup.userData.factorLong > 0) {
        rocket.rotation.z = - Math.PI / 4;
    }
    else if (rocketGroup.userData.factorLat > 0 && rocketGroup.userData.factorLong < 0) {
        rocket.rotation.z = Math.PI - Math.PI / 4;
    }
    else if (rocketGroup.userData.factorLat > 0 && rocketGroup.userData.factorLong > 0) {
        rocket.rotation.z = Math.PI + Math.PI / 4;
    }
    else if (rocketGroup.userData.factorLat < 0) {
        rocket.rotation.z = 0;
    }
    else if (rocketGroup.userData.factorLat > 0) {
        rocket.rotation.z = Math.PI;
    }
    else if (rocketGroup.userData.factorLong < 0) {
        rocket.rotation.z = Math.PI / 2;
    }
    else if (rocketGroup.userData.factorLong > 0) {
        rocket.rotation.z = - Math.PI / 2;
    }
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
        case 49: //1, Orthographic Camera
            camera = orthoCam;
            break;
        case 50: //2, Persp Fixed Camera
            camera = fixedPerspCam;
            break;
        case 51: //3, Persp Moving Camera
            camera = perspCam;
            break;

        case 52: //4, Wireframe
            scene.traverse(function(node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
        case 53: //5, Hitboxes
            rocketGroup.hitboxVisible();
            for (let i = 0; i < trashQuad1.length; i++) {
                trashQuad1[i].hitboxVisible();
            }
            for (let i = 0; i < trashQuad2.length; i++) {
                trashQuad2[i].hitboxVisible();
            }
            for (let i = 0; i < trashQuad3.length; i++) {
                trashQuad3[i].hitboxVisible();
            }
            for (let i = 0; i < trashQuad4.length; i++) {
                trashQuad4[i].hitboxVisible();
            }
            break;
        
        case 39: // right arrow, Move Rocket Longitudinally
            if (rocketGroup.userData.factorLong == 0) {
                rocketGroup.userData.factorLong = -rotationFactor;
            }
            break;
        case 37: // left arrow, Move Rocket Longitudinally
            if (rocketGroup.userData.factorLong == 0) {
                rocketGroup.userData.factorLong = rotationFactor;
            }
            break;
        case 38: //up arrow, Move Rocket Latitudinally
            if (rocketGroup.userData.factorLat == 0) {
                rocketGroup.userData.factorLat = -rotationFactor;
            }
            break;
        case 40: //down arrow, Move Rocket Latitudinally
            if (rocketGroup.userData.factorLat == 0) {
                rocketGroup.rotation.x = Math.PI;
                rocketGroup.userData.factorLat = rotationFactor;
            }
            break;
    }
}

function onKeyUp(e) {
    'use strict';

    switch(e.keyCode) {

        case 39: // right arrow
        case 37: // left arrow
            rocketGroup.userData.factorLong = 0;
            break;
        case 38: //up arrow
        case 40: //down arrow
            rocketGroup.userData.factorLat = 0;
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

    deleteTrash();
    moveRocket();
    collisionsRocket();

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

    trashQuad1 = [];
    trashQuad2 = [];
    trashQuad3 = [];
    trashQuad4 = [];
    trashToRemove = [];
    trashRemoved = [];

    createScene();

    createCameras();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}
