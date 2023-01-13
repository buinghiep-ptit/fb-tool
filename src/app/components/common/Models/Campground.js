import { useEffect, useRef } from 'react'

import { useAnimations } from '@react-three/drei/core/useAnimations'
import { useGLTF } from '@react-three/drei/core/useGLTF'

import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Campground({ ...props }) {
  const group = useRef(null)

  const { scene, animations } = useGLTF('assets/models/camp/camp.glb', true)
  const { actions, mixer } = useAnimations(animations, group)
  const vec = new THREE.Vector3()

  useEffect(() => {
    scene.scale.set(0.3, 0.3, 0.3)
    scene.position.set(0, 0, 0)
    scene.rotation.set(0, -Math.PI / 3, 0)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    actions['Animation'] && actions['Animation'].play()
  }, [mixer, actions])

  useFrame((state, delta) => {
    mixer.update(delta)

    vec.set(0, 0, 6)

    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 47, 0.05)
    state.camera.position.lerp(vec, 0.2)
    state.camera.lookAt(0, 0.45, 0)
    state.camera.updateProjectionMatrix()
  })

  return <primitive ref={group} object={scene} dispose={null} />
}

useGLTF.preload('/gltf/cubes.gltf')
