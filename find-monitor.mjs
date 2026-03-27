// Read Object_21's NORMAL accessor min/max from JSON (available even with Draco compression)
// The dominant normal direction tells us which way the screen face points.
import { readFileSync } from 'fs'
import { resolve } from 'path'

const buf = readFileSync(resolve('public/portfolio-room.optimized.glb'))
const jsonChunkLen = buf.readUInt32LE(12)
const gltf = JSON.parse(buf.slice(20, 20 + jsonChunkLen).toString('utf8'))
const { nodes, meshes, accessors } = gltf

// Target meshes to inspect
const targets = ['Object_21', 'Mesh_0', 'Object_12']

for (const name of targets) {
  const mesh = meshes.find(m => m.name === name)
  if (!mesh) continue
  const prim    = mesh.primitives[0]
  const posAcc  = accessors[prim.attributes.POSITION]
  const normAcc = accessors[prim.attributes.NORMAL]

  console.log(`\n=== ${name} ===`)
  console.log('POSITION:')
  console.log('  min:', posAcc.min?.map(v => v.toFixed(4)))
  console.log('  max:', posAcc.max?.map(v => v.toFixed(4)))
  if (posAcc.min && posAcc.max) {
    const cx = (posAcc.min[0]+posAcc.max[0])/2
    const cy = (posAcc.min[1]+posAcc.max[1])/2
    const cz = (posAcc.min[2]+posAcc.max[2])/2
    const sx = posAcc.max[0]-posAcc.min[0]
    const sy = posAcc.max[1]-posAcc.min[1]
    const sz = posAcc.max[2]-posAcc.min[2]
    console.log(`  centre: [${cx.toFixed(4)}, ${cy.toFixed(4)}, ${cz.toFixed(4)}]`)
    console.log(`  size:   [${sx.toFixed(4)}, ${sy.toFixed(4)}, ${sz.toFixed(4)}]`)
  }

  if (normAcc) {
    console.log('NORMAL (tells us which way the face points):')
    console.log('  min:', normAcc.min?.map(v => v.toFixed(4)))
    console.log('  max:', normAcc.max?.map(v => v.toFixed(4)))
    if (normAcc.min && normAcc.max) {
      // The dominant axis in normals reveals the face direction
      const axes = ['X','Y','Z']
      for (let i = 0; i < 3; i++) {
        const lo = normAcc.min[i], hi = normAcc.max[i]
        const dom = Math.abs(lo) > Math.abs(hi) ? lo : hi
        console.log(`  ${axes[i]}-normals range: [${lo.toFixed(3)}, ${hi.toFixed(3)}]  dominant: ${dom.toFixed(3)}`)
      }
    }
  }
}

// Also show the original GLB for comparison (portfolio-room.glb — not optimized)
console.log('\n\n=== Checking ORIGINAL (non-optimized) GLB for Object_21 ===')
try {
  const origBuf = readFileSync(resolve('public/portfolio-room.glb'))
  const origJsonLen = origBuf.readUInt32LE(12)
  const origGltf = JSON.parse(origBuf.slice(20, 20 + origJsonLen).toString('utf8'))
  const origMesh = origGltf.meshes?.find(m => m.name === 'Object_21')
  if (origMesh) {
    const origNormAcc = origGltf.accessors[origMesh.primitives[0].attributes.NORMAL]
    const origPosAcc  = origGltf.accessors[origMesh.primitives[0].attributes.POSITION]
    console.log('POSITION min/max:', origPosAcc.min?.map(v=>v.toFixed(4)), origPosAcc.max?.map(v=>v.toFixed(4)))
    console.log('NORMAL   min/max:', origNormAcc?.min?.map(v=>v.toFixed(4)), origNormAcc?.max?.map(v=>v.toFixed(4)))
  } else {
    console.log('Object_21 not found in original GLB — names may differ')
    console.log('Available mesh names:', origGltf.meshes?.slice(0,20).map(m=>m.name))
  }
} catch(e) {
  console.log('Could not read original GLB:', e.message)
}
