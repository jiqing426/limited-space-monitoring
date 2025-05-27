'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei';
import { Suspense } from 'react';

function Model() {
  const { scene } = useGLTF('/mx1.glb');
  return <primitive object={scene} />;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function ThreeJSViewer() {
  return (
    <div className="threejs-container">
      <Canvas
        camera={{ position: [-15, 10, 25], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Suspense fallback={<LoadingFallback />}>
          <Center>
            <Model />
          </Center>
        </Suspense>
        
        <Environment preset="studio" />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={120}
          maxDistance={180}
          target={[-10, 0, 0]}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
} 