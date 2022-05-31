/* global THREE */

var perspCamera, orthoCamera, camera;

var scene, renderer, material

var clock, delta;

// Objects
var planet, rocket, trash;

const scale = 1, rotationFactor = 1;

// Objects Scales
const planetRadius = 36, rocketWingspan = planetRadius / 12, trashWingspan = planetRadius / 20, objectOrbit = planetRadius * 1.2;

class ObjectCollision extends THREE.Object3D {
    //Constructor
    constructor(radius) {
        super();
        
        this.hitboxRadius = radius;

        material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        let geometry = new THREE.SphereGeometry(radius * scale, 30 * scale, 30 * scale);
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
        let x = radius * Math.cos(theta) * Math.sin(phi);
        let z = radius * Math.sin(theta) * Math.sin(phi);
        let y = radius * Math.cos(phi);
        
        this.position.set(x, y, z);
    }

    collisionCheck(object) {
        return this.hitboxRadius + object.hitboxRadius() < this.position.distanceTo(other.position);
    }
}

function randomAngle() {
    return Math.random() * 2 * Math.PI;
}

function createPlanet() {
    'use strict';
    
    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.SphereGeometry(planetRadius * scale, 30 * scale, 30 * scale);
    let mesh = new THREE.Mesh(geometry, material); 
    
    planet = new THREE.Object3D();
    planet.add(mesh);
    planet.position.set(0, 0, 0);   
    
    scene.add(planet);
}

function createRocket() {}

function createDodecahedron() {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.DodecahedronBufferGeometry((trashWingspan / 2) * scale);
    let mesh = new THREE.Mesh(geometry, material);

    var dodecahedron = new ObjectCollision((trashWingspan / 2) * scale);
    dodecahedron.add(mesh);
    dodecahedron.sphericalSet(objectOrbit, randomAngle(), randomAngle());  
    
    trash.push(dodecahedron);
    scene.add(dodecahedron);
}

function createIcosahedron() {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.IcosahedronBufferGeometry((trashWingspan / 2) * scale);
    let mesh = new THREE.Mesh(geometry, material);

    var icosahedron = new ObjectCollision((trashWingspan / 2) * scale);
    icosahedron.add(mesh);
    icosahedron.sphericalSet(objectOrbit, randomAngle(), randomAngle());  
    
    trash.push(icosahedron);
    scene.add(icosahedron);
}

function createOctahedron() {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.OctahedronBufferGeometry((trashWingspan / 2) * scale);
    let mesh = new THREE.Mesh(geometry, material);;    

    var octahedron = new ObjectCollision((trashWingspan / 2) * scale);
    octahedron.add(mesh);
    octahedron.sphericalSet(objectOrbit, randomAngle(), randomAngle());  

    trash.push(octahedron);
    scene.add(octahedron);
}

function createSphere() {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.SphereBufferGeometry((trashWingspan / 2) * scale, 10 * scale, 10 * scale);
    let mesh = new THREE.Mesh(geometry, material);   

    var sphere = new ObjectCollision((trashWingspan / 2) * scale);
    sphere.add(mesh);
    sphere.sphericalSet(objectOrbit, randomAngle(), randomAngle());  

    trash.push(sphere);
    scene.add(sphere);
}

function createBox() {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xedb381, wireframe: true });
    let geometry = new THREE.BoxBufferGeometry(trashWingspan * scale, trashWingspan * scale, trashWingspan * scale);
    let mesh = new THREE.Mesh(geometry, material);   

    var box = new ObjectCollision(trashWingspan * scale);
    box.add(mesh);
    box.sphericalSet(objectOrbit, randomAngle(), randomAngle());  

    trash.push(box);
    scene.add(box);
}

function createTrash() {
    for (let i = 0; i < 6; i++) {
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

    scene.add(new THREE.AxesHelper(10));

    createPlanet();
    createRocket();
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
            camera.position.x = 30 * scale;
            camera.position.y = 0;
            camera.position.z = 0;
            camera.lookAt(scene.position);
            camera.position.y = 15 * scale;
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
            break;
        
        case 39: // right arrow, Move Rocket Longitudinally
            break;
        case 37: // left arrow, Move Rocket Longitudinally
            break;
        case 38: //up arrow, Move Rocket Latitudinally
            break;
        case 40: //down arrow, Move Rocket Latitudinally
            break;
    }
}

function onKeyUp(e) {
    'use strict';

    switch(e.keyCode) {

        case 39: // right arrow
        case 37: // left arrow
            break;
        case 38: //up arrow
        case 40: //down arrow
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

    trash = [];
    createScene();

    createCameras();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}
