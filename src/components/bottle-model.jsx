import { useRef, useEffect, useState } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

export function BottleModel({ frontLabelImg, backLabelImg, modelType = "wine" }) {
  const modelPath = modelType === "wine" ? "/bottle-app/models/wine.gltf" : "/bottle-app/models/whiskey.gltf"
  const { scene } = useGLTF(modelPath, true)
  const [modelLoaded, setModelLoaded] = useState(false)
  
  const wineFrontLabelRef = useRef(null)
  const wineBackLabelRef = useRef(null)

  const whiskeyFrontLabelRef = useRef(null)
  const whiskeyBackLabelRef = useRef(null)
  
  // Find and store references to the label meshes
  useEffect(() => {
    try {
      scene.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material = child.material.clone();
            
            // For standard materials
            if (child.material.metalness !== undefined) {
              child.material.metalness = Math.min(child.material.metalness, 0.8);
              child.material.roughness = Math.max(child.material.roughness, 0.2);
            }
            
            // Ensure material receives light
            child.material.needsUpdate = true;
          }
          if (child.name === "printarea-1_3") {
            wineFrontLabelRef.current = child
          }
          if (child.name === "printarea-2_5") {
            wineBackLabelRef.current = child
          }

          if (child.name === "Object_15") {
            whiskeyFrontLabelRef.current = child
          }
          if (child.name === "Object_13") {
            whiskeyBackLabelRef.current = child
          }
        }
      })
      setModelLoaded(true)
    } catch (error) {
      console.error("Error traversing scene:", error)
    }
  }, [scene])

  // Update the front label texture when frontLabelImg changes
  useEffect(() => {
    if (!frontLabelImg || !modelLoaded) return
    
    const frontLabelRef = modelType === "wine" ? wineFrontLabelRef : whiskeyFrontLabelRef
    if (!frontLabelRef.current) return

    const textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = "anonymous"
    textureLoader.load(frontLabelImg, (texture) => {
      if (frontLabelRef.current) {
        try {
          // Clone the material to avoid affecting other instances
          frontLabelRef.current.material = wineFrontLabelRef.current.material.clone()
          // Apply the new texture
          frontLabelRef.current.material.map = texture
          // Important for the texture to appear correctly
          texture.flipY = true
          texture.needsUpdate = true
          frontLabelRef.current.material.needsUpdate = true
        } catch (error) {
          console.error("Error applying front label texture:", error)
        }
      }
    })
  }, [frontLabelImg, modelLoaded, modelType])

  // Update the back label texture when backLabelImg changes
  useEffect(() => {
    if (!backLabelImg || !modelLoaded) return
    
    const backLabelRef = modelType === "wine" ? wineBackLabelRef : whiskeyBackLabelRef
    if (!backLabelRef.current) return

    const textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = "anonymous"
    textureLoader.load(backLabelImg, (texture) => {
      if (backLabelRef.current) {
        try {
          // Clone the material to avoid affecting other instances
          backLabelRef.current.material = backLabelRef.current.material.clone()
          // Apply the new texture
          backLabelRef.current.material.map = texture
          // Important for the texture to appear correctly
          texture.flipY = true
          texture.needsUpdate = true
          backLabelRef.current.material.needsUpdate = true
        } catch (error) {
          console.error("Error applying back label texture:", error)
        }
      }
    })
  }, [backLabelImg, modelLoaded, modelType])
  console.log(modelType)
  return <primitive object={scene} scale={modelType === 'wine' ? 0.01 : 0.55} position={[0, 0, 0]} />
}

// Preload the model to avoid loading issues
useGLTF.preload("/bottle-app/models/wine.gltf")
useGLTF.preload("/bottle-app/models/whiskey.gltf")