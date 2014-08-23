/**
 * because ant
 * @author Michael Christopher Hrstka
 * michael.christopher.hrstka@gmail.com
 */

var scene, camera, renderer,
    light, controls, container

var imageData;
var image = new Image();
image.src = "duc.png";

image.onload = function() {
    
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    imageData = context.getImageData(0, 0, image.width, image.height).data;
    init();
    animate();
};
    
function init() {
	
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 500, 3000);
    
    renderer = new THREE.WebGLRenderer({antialias: false, clearAlpha: 1});
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);
    
    window.addEventListener('resize', onWindowResize, false);
    
	var particles = image.width * image.height;

	var geometry = new THREE.BufferGeometry();

	var positions = new Float32Array( particles * 3 );
	var colors = new Float32Array( particles * 3 );
	var n = 1000, n2 = n / 2;
	var color = new THREE.Color();
	
	var imageDataIndex = 0;
	
	for(var height = 0, positionIndex = 0; height < image.height; height ++, positionIndex += 3){
		for(var width = 0; width < image.width; width ++, positionIndex += 3){
			
			var r = imageData[imageDataIndex];
			var g = imageData[imageDataIndex + 1];
			var b = imageData[imageDataIndex + 2];
			
			var gray = (r + g + b) / 3;

			positions[ positionIndex ]     = width - image.width / 2;
			positions[ positionIndex + 1 ] = gray; 
			positions[ positionIndex + 2 ] = height - image.height / 2;
			
			color.setRGB( r, g, b );

			colors[ positionIndex ]     = color.r / 255;
			colors[ positionIndex + 1 ] = color.g / 255;
			colors[ positionIndex + 2 ] = color.b / 255;
			
			imageDataIndex += 4;
		}
	}

	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

	geometry.computeBoundingSphere();

	var sprite = THREE.ImageUtils.loadTexture( "ball.png" );
	sprite.wrapS = sprite.wrapT = THREE.RepeatWrapping;
	
	var material = new THREE.PointCloudMaterial( { size: 10, map: sprite, vertexColors: THREE.VertexColors, transparent: true } );

	var particleSystem = new THREE.PointCloud( geometry, material );
	particleSystem.sortParticles = true;
	scene.add( particleSystem );
}

function render() {

    renderer.render(scene, camera);
}

function animate() {
    
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

	render();
}