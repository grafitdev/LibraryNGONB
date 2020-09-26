var Map = function ()
{
    var _this = this;
	
    this.camera = null;
    this.scene = null;
    this.renderer = null;
	
	this.mtlLoader = null;
    this.raycaster = null;
    this.manager = null;
    this.loader = null;
    this.font = null;
	
	this.offsetX = 0;    
	this.offsetY = 0;
	
	this.mouseX = null;    
	this.mouseY = null;	
	
	this.floors =
		[
			{file:  'models/Floor1.obj'},
			{file:  'models/Floor2.obj'},
			{file:  'models/Floor3.obj'},
			{file:  'models/objON.obj', texture: 'models/objON.mtl'},
		];

	this.directionalLight = null;
	
    this.init = function ()
    {		
        _this.raycaster = new THREE.Raycaster();
        _this.manager = new THREE.LoadingManager();
		
        _this.loader = new THREE.OBJLoader( _this.manager );
		_this.mtlLoader = new THREE.MTLLoader( _this.manager );		
		_this.mtlLoader.setPath( location.href.split("/").slice(0, -1).join("/") + "/" );
		
        _this.renderer = new THREE.WebGLRenderer({ alpha: true } );
        _this.renderer.setPixelRatio( window.devicePixelRatio);		
        _this.renderer.setSize( window.innerWidth, window.innerHeight );
        _this.renderer.setClearColor( 0x000000, 0 );
		
        $("body")[0].appendChild( _this.renderer.domElement );

        _this.scene = new THREE.Scene();
        _this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 3000 );
		_this.directionalLight = new THREE.DirectionalLight( 0xffffff );
		
        _this.directionalLight.position.set( 10, 100, 40 );
        _this.directionalLight.target.position.set(0, -200, 0);

        _this.scene.add( _this.directionalLight );		

		for (var i = 0; i < _this.floors.length; i ++)
		{
			_this.loadNextFloor(i);
		}
		
		_this.camera.position.set(0, 600, 400);
		_this.controls = new THREE.OrbitControls( _this.camera, _this.renderer.domElement );
		
		_this.toTop();

		$("body")[0].addEventListener( 'mousemove', _this.onDocumentMouseMove, false );		
        $("canvas")[0].addEventListener("click", _this.findObject);		
        window.addEventListener( 'resize', _this.onWindowResize, false );		
		
		_this.animate();
    };

    this.loadNextFloor = function (floor)
    {
        if (_this.floors[floor])
        {
            var loadModel = function ()
			{
				_this.loader.load( _this.floors[floor].file, function ( object ) {
					object.position.set(0, -80 + floor * 220/ _this.floors.length , 0);
					object.rotation.set(0, Math.PI, 0);

					_this.scene.add( object );
					_this.floors[floor].mesh = object;     				
				});				
			};
			//loadModel();
			if (_this.floors[floor].texture)
			{
				_this.mtlLoader.load(_this.floors[floor].texture, function (material) 
				{
					material.preload();

					_this.loader.setMaterials( material );
					loadModel();
				});
			}
			else 
			{
				loadModel ();
			}
		}
	};
	
	this.toTop = function ()
	{		
		_this.controls.noRotate = true;
		$(_this.camera.position).animate({x: 0, y: 600, z: 0}, 1000);
	}

    this.animate = function() {
        _this.render();
        _this.renderer.render(_this.scene, _this.camera);
        requestAnimationFrame( _this.animate );
    };
	
    this.render = function () {
		_this.controls.update();		
	};
	
    this.selectFloor = function (floor)
    {
        for (var i in _this.floors)
        {
            if (floor != -1)
            {
                if (i < floor)
                    $(_this.floors[i].mesh.position).animate({y: -180 - (floor - i) * 220 / _this.floors.length});
                if (i > floor)
                    $(_this.floors[i].mesh.position).animate({y: 70 + (i - floor) * 220 / _this.floors.length});
                if (i ==  floor)
                    $(_this.floors[i].mesh.position).animate({y: -80});
            }
            else
            {
                $(_this.floors[i].mesh.position).animate({y: -80 + i * 220/ _this.floors.length});
            }
        }	
	}
	
    this.onDocumentMouseMove = function ( event ) 
	{
        _this.offsetX = _this.mouseX - event.clientX;
        _this.offsetY = _this.mouseY - event.clientY;
    };	
	
    this.findObject = function (event) {
        event.preventDefault();

        var br = event.target.getBoundingClientRect();

        var mouseX = (event.clientX - br.left) /  $("canvas")[0].offsetWidth * 2 - 1;
        var mouseY = 1 - (event.clientY - br.top) /  $("canvas")[0].offsetHeight * 2;

        var vector = new THREE.Vector3(mouseX, mouseY, 0).unproject(_this.camera);

        _this.raycaster.set(_this.camera.position, vector.sub( _this.camera.position ).normalize());
        var intersects = _this.raycaster.intersectObject(_this.scene, true);

        if (intersects.length > 0)
        {
            var id = _this.getFloorID(intersects[0].object);
            if (id)
            {
				_this.selectFloor(id);
            }
        }
        else
        {
			_this.mouseX = event.clientX;
			_this.mouseY = event.clientY;

            _this.selectFloor(-1);
        }
    };	
	
    this.getFloorID = function (obj)
    {
        var result = null;

        for (var i in _this.floors)
        {
            if (_this.floors[i].mesh.uuid == obj.parent.uuid)
            {
                result = i;
                break;
            }
        }

        return result;
    };
	
    this.onWindowResize = function () {
        _this.camera.aspect = window.innerWidth / window.innerHeight;
        _this.camera.updateProjectionMatrix();

        _this.renderer.setSize( window.innerWidth, window.innerHeight );
    };	
};

var a = new Map();
a.init();