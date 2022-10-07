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
    scene.scale.set(0.2, 0.2, 0.2)
    scene.position.set(0, 0, 0)
    scene.rotation.set(0, -Math.PI / 3, 0)
  }, [])

  useEffect(() => {
    actions['Take 001'] && actions['Take 001'].play()
  }, [mixer, actions])

  useFrame((state, delta) => {
    mixer.update(delta)

    vec.set(0, 0, 6)

    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 47, 0.05)
    state.camera.position.lerp(vec, 0.1)
    state.camera.lookAt(0, 0.75, 0)
    state.camera.updateProjectionMatrix()
  })

  return <primitive ref={group} object={scene} dispose={null} />
}

useGLTF.preload('/gltf/cubes.gltf')
