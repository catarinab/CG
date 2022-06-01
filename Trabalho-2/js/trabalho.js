/* global THREE */

var perspCamera, orthoCamera, camera;

var scene, renderer;

var clock, delta;

// Objects
var planet, rocket, trash;

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
        return (this.hitboxRadius + object.hitboxRadius()) ** 2 > (this.position.x - object.position.x) ** 2 + (this.position.y - object.position.y) ** 2 + (this.position.z - object.position.z) ** 2;
    }
}

function randomAngle() {
    return Math.random() * 2 * Math.PI;
}

function createPlanet() {
    'use strict';

    planet = new THREE.Object3D();
    
    let material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.SphereGeometry(planetRadius * scale, 30 * scale, 30 * scale);
    let mesh = new THREE.Mesh(geometry, material); 
    mesh.position.set(0, 0, 0);
    
    planet.add(mesh);  
    scene.add(planet);
}

function createRocket() {
    'use strict';

    rocket = new ObjectCollision((rocketWingspan / 2) * scale);
    rocket.userData = {movingLong: false, movingLat: false, incrementFactor: rotationFactor};
    
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
    
    rocket.sphericalSet(objectOrbit * scale, 0, Math.PI / 2);

    scene.add(rocket);
}

function createDodecahedron() {
    'use strict';

    let material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.DodecahedronBufferGeometry((trashWingspan / 2) * scale);
    let mesh = new THREE.Mesh(geometry, material);

    var dodecahedron = new ObjectCollision((trashWingspan / 2) * scale);
    dodecahedron.add(mesh);
    dodecahedron.sphericalSet(objectOrbit * scale, randomAngle(), randomAngle());  
    
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
    perspCamera = new THREE.PerspectiveCamera(70, 
        window.innerWidth / window.innerHeight, 1, 1000);
    perspCamera.position.x = 80 * scale;
    perspCamera.position.y = 0;
    perspCamera.position.z = 0;
    perspCamera.lookAt(scene.position);
    
    orthoCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, 
        window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    orthoCamera.zoom = 7 / scale;
    orthoCamera.updateProjectionMatrix();
    orthoCamera.position.x = 50 * scale;
    orthoCamera.position.y = 0;
    orthoCamera.position.z = 0;
    orthoCamera.lookAt(scene.position);

    camera = orthoCamera;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10 * scale));

    createPlanet();

    createRocket();
    rocket.add(new THREE.AxesHelper(1 * scale));

    createTrash();
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
        case 49: //1, Orthographic Camera
            camera = orthoCamera;
            break;
        case 50: //2, Persp Fixed Camera
            camera = perspCamera;
            break;
        case 51: //3, Persp Moving Camera
            break;

        case 52: //4, Wireframe
            scene.traverse(function(node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
        case 53: //5, Hitboxes
            rocket.hitboxVisible();
            for (let i = 0; i < trashNumber; i++) {
                trash[i].hitboxVisible();
            }
            break;
        
        case 39: // right arrow, Move Rocket Longitudinally
            if (rocket.userData.movingLong == false) {
                rocket.userData.movingLong = true;
                rocket.userData.incrementFactor = -rotationFactor;
            }
            break;
        case 37: // left arrow, Move Rocket Longitudinally
            if (rocket.userData.movingLong == false) {
                rocket.userData.movingLong = true;
                rocket.userData.incrementFactor = rotationFactor;
            }
            break;
        case 38: //up arrow, Move Rocket Latitudinally
            if (rocket.userData.movingLat == false) {
                rocket.userData.movingLat = true;
                rocket.userData.incrementFactor = -rotationFactor;
            }
            break;
        case 40: //down arrow, Move Rocket Latitudinally
            if (rocket.userData.movingLat == false) {
                rocket.userData.movingLat = true;
                rocket.userData.incrementFactor = rotationFactor;
            }
            break;
    }
}

function onKeyUp(e) {
    'use strict';

    switch(e.keyCode) {

        case 39: // right arrow
        case 37: // left arrow
            rocket.userData.movingLong = false;
            break;
        case 38: //up arrow
        case 40: //down arrow
            rocket.userData.movingLat = false;
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

    if (rocket.userData.movingLong) {
        let step = rocket.userData.incrementFactor * delta;
        rocket.sphericalSet(rocket.radius, rocket.theta + step, rocket.phi);
    }
    if (rocket.userData.movingLat) {
        let step = rocket.userData.incrementFactor * delta;
        rocket.sphericalSet(rocket.radius, rocket.theta, rocket.phi + step);
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

    trash = [];
    createScene();

    createCameras();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}
