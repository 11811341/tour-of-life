import * as THREE from 'three';

export class Renderer2D{

  private scene;
  private camera;
  // private camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );
  private renderer;

  private width: number;
  private height: number;

  private wheel_down: boolean = false;

  private dev_mode: boolean = false;
  private zoomMode: boolean = true;

  constructor(width: number, height: number) {
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    this.camera.position.z = 5;
    this.camera.lookAt(new THREE.Vector3(-200,-55000,-50));

    const that = this;
    document.addEventListener( 'wheel', (event) => {
      if(((that.camera.position.z < 20 && event.deltaY>0) || (that.camera.position.z > 2 && event.deltaY<0) || that.dev_mode) && that.zoomMode)
        that.camera.position.z += Math.sign(event.deltaY)*0.5;
    }, false);

    document.addEventListener('mousedown', function(e){
      if(e.button == 1)
        that.wheel_down = true;
    }, false);

    document.addEventListener('mousemove', function(e){
      if(that.wheel_down){
        if(!that.dev_mode)
          that.camera.position.set(Math.min(Math.max(that.camera.position.x - e.movementX/that.getScale(), -10), 10), Math.min(Math.max(that.camera.position.y + e.movementY/that.getScale(), -10), 10), that.camera.position.z);
        else
          that.camera.position.set(that.camera.position.x - e.movementX/that.getScale(), that.camera.position.y + e.movementY/that.getScale(), that.camera.position.z);
      }
    }, false);

    document.addEventListener('mouseup', function(e){
      if(e.button == 1)
        that.wheel_down = false;
    }, false);

    this.setSize(width, height);
  }

  public devMode(){
    this.dev_mode = !this.dev_mode;
    if(!this.dev_mode)
      this.camera.position.set(0, 0, 5);
  }

  public getRenderer() {
    return this.renderer.domElement;
  }


  public getCamera(){
    return this.camera;
  }

  public setSize(width: number, height: number): void{
    this.width = width;
    this.height = height;
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private getScale() {
    const fov = this.camera.fov * Math.PI / 180;
    const scale_height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const scale = this.height / scale_height;
    return scale;
  }

  public disableZoom(){
    this.zoomMode = !this.zoomMode;
  }

  public render(scene: THREE.Scene): void{
    this.scene = scene;
    this.renderer.render(this.scene, this.camera);
  }

}
