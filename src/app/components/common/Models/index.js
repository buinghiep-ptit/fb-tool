import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera'
import { OrbitControls } from '@react-three/drei/core/OrbitControls'
import { CubeCamera } from '@react-three/drei/core/CubeCamera'

import { Campground } from './Campground'

function CarShow() {
  return (
    <>
      <OrbitControls
        target={[0, 1.25, 0]}
        maxPolarAngle={1.45}
        addEventListener={undefined}
        hasEventListener={undefined}
        removeEventListener={undefined}
        dispatchEvent={undefined}
      />
      <PerspectiveCamera
        makeDefault
        fov={47}
        position={[75, 50, 50]}
        key={undefined}
        attach={undefined}
        attachArray={undefined}
        attachObject={undefined}
        args={undefined}
        onUpdate={undefined}
        visible={undefined}
        type={undefined}
        id={undefined}
        uuid={undefined}
        name={undefined}
        parent={undefined}
        modelViewMatrix={undefined}
        normalMatrix={undefined}
        matrixWorld={undefined}
        matrixAutoUpdate={undefined}
        matrixWorldNeedsUpdate={undefined}
        castShadow={undefined}
        receiveShadow={undefined}
        frustumCulled={undefined}
        renderOrder={undefined}
        animations={undefined}
        userData={undefined}
        customDepthMaterial={undefined}
        customDistanceMaterial={undefined}
        isObject3D={undefined}
        onBeforeRender={undefined}
        onAfterRender={undefined}
        applyMatrix4={undefined}
        applyQuaternion={undefined}
        setRotationFromAxisAngle={undefined}
        setRotationFromEuler={undefined}
        setRotationFromMatrix={undefined}
        setRotationFromQuaternion={undefined}
        rotateOnAxis={undefined}
        rotateOnWorldAxis={undefined}
        rotateX={undefined}
        rotateY={undefined}
        rotateZ={undefined}
        translateOnAxis={undefined}
        translateX={undefined}
        translateY={undefined}
        translateZ={undefined}
        localToWorld={undefined}
        worldToLocal={undefined}
        lookAt={undefined}
        add={undefined}
        remove={undefined}
        clear={undefined}
        getObjectById={undefined}
        getObjectByName={undefined}
        getObjectByProperty={undefined}
        getWorldPosition={undefined}
        getWorldQuaternion={undefined}
        getWorldScale={undefined}
        getWorldDirection={undefined}
        raycast={undefined}
        traverse={undefined}
        traverseVisible={undefined}
        traverseAncestors={undefined}
        updateMatrix={undefined}
        updateMatrixWorld={undefined}
        updateWorldMatrix={undefined}
        toJSON={undefined}
        clone={undefined}
        copy={undefined}
        addEventListener={undefined}
        hasEventListener={undefined}
        removeEventListener={undefined}
        dispatchEvent={undefined}
        zoom={undefined}
        view={undefined}
        focus={undefined}
        near={undefined}
        far={undefined}
        updateProjectionMatrix={undefined}
        setViewOffset={undefined}
        clearViewOffset={undefined}
        matrixWorldInverse={undefined}
        projectionMatrix={undefined}
        projectionMatrixInverse={undefined}
        isCamera={undefined}
        isPerspectiveCamera={undefined}
        aspect={undefined}
        filmGauge={undefined}
        filmOffset={undefined}
        setFocalLength={undefined}
        getFocalLength={undefined}
        getEffectiveFOV={undefined}
        getFilmWidth={undefined}
        getFilmHeight={undefined}
        setLens={undefined}
      />

      <color args={[1, 1, 1]} attach="background" />

      <CubeCamera resolution={256} frames={Infinity}>
        {texture => (
          <>
            {/* <Environment map={texture} /> */}
            <Campground />
          </>
        )}
      </CubeCamera>

      <spotLight
        color={[1, 0.25, 0.7]}
        intensity={1.5}
        angle={0.6}
        penumbra={0.5}
        position={[5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
      <spotLight
        color={[0.14, 0.5, 1]}
        intensity={2}
        angle={0.6}
        penumbra={0.5}
        position={[-5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
    </>
  )
}

function Index() {
  return (
    <Suspense fallback={null}>
      <Canvas shadows>
        <CarShow />
      </Canvas>
    </Suspense>
  )
}

export default Index
