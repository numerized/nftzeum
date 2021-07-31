import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-aframe-museum',
  styleUrl: 'app-aframe-museum.css',
})
export class AppAframeMuseum {
  render() {
    return (
      <a-scene
        renderer="
      colorManagement: true;
      sortObjects: true;
      physicallyCorrectLights: true;"
      >
        <a-gltf-model
          id="sculpture"
          scale="2 2 2"
          src="../assets/models/k7.glb"
          position="2.6 2 -18.5"
          cube-env-map="path: ../../assets/cubemaps/blue/;
                 extension: png;"
        ></a-gltf-model>

        <a-gltf-model
          id="sculpture"
          src="../assets/models/trumpunk1.glb"
          scale="2 2 2"
          rotation="0 0"
          position="7 2.5 -18.5"
          cube-env-map="path: ../../assets/cubemaps/blue/;
                 extension: png;"
        ></a-gltf-model>

        {/* <a-entity id="rig" movement-controls rotation="0 -90 0">
          <a-entity id="camera" camera position="0 5.5 0" look-controls="pointerLockEnabled: true"></a-entity>
        </a-entity> */}

        {/* <a-entity id="rig" movement-controls="constrainToNavMesh: true; controls: keyboard">
          <a-entity camera position="12 5.5 -16.5" ></a-entity>
        </a-entity>  */}

        <a-entity id="rig" movement-controls kinematic-body>
          <a-entity camera position="0 2 10" look-controls="pointerLockEnabled: true"></a-entity>
        </a-entity>

        {/* <a-entity id="navmesh-Hello" gltf-model="../assets/models/navmesh.gltf" visible="true" nav-mesh></a-entity>

       */}

        <a-assets>
          <a-asset-item id="tree" src="../assets/models/NFTZ_Test_0.3.gltf"></a-asset-item>

          {/* <a-asset-item id="tree-obj" src="../assets/models/3_collide.obj"></a-asset-item> */}

          {/* <a-asset-item id="sculpture" src="../assets/models/sculpture.glb"></a-asset-item> */}
        </a-assets>

        {/* <a-gltf-model src="#sculpture" position="2.6 1.4 -18.5"></a-gltf-model> */}

        <a-entity environment="preset: yavapai; skyType: gradient; skyColor: #fdfa99; horizonColor: #fdfa99; lighting: distant; lightPosition: 0.5 10 0; fog: 0.9; flatShading: false; playArea: 1; ground: hills; groundYScale: 9.76; groundTexture: walkernoise; groundColor: #C66344; groundColor2: #c96b4b; dressing: pyramids; dressingAmount: 1; dressingColor: #C66344; dressingScale: 50; dressingVariance: 0 0 0; dressingUniformScale: false; dressingOnPlayArea: 10; grid: none; gridColor: #239893; shadow: true; shadowSize:10"></a-entity>

        <a-entity gltf-model="#tree"></a-entity>

        {/* <a-entity obj-model="obj: #tree-obj"></a-entity> */}

        {/* <a-grid static-body></a-grid> */}

        {/* <a-box color="#39BB82"
             width="15" height="0.4" depth="3"
             position="8 0 -5"
             static-body></a-box> */}

        {/* 
        
        */}
      </a-scene>
    );
  }
}
