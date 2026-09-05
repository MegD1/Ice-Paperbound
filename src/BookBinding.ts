import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

type BindingOptions = {
  thickness: number;
  height: number;
  width: number;
  spineZ: number;
  color: string;
  cover: THREE.Texture;
  inside: THREE.Texture;
  endpaper: THREE.Texture;
  bump: THREE.Texture;
};

export function createBookBinding(options: BindingOptions) {
  const { thickness, height, width, spineZ, color, cover, inside, endpaper, bump } = options;
  const group = new THREE.Group();
  group.name = "binding";
  const boardThickness = 4;
  const boardEdge = new THREE.MeshStandardMaterial({ color, roughness: 0.96, bumpMap: bump, bumpScale: 0.12 });
  const paper = new THREE.MeshStandardMaterial({ color: "#eee6d5", roughness: 1 });
  const lining = new THREE.MeshStandardMaterial({ map: endpaper, roughness: 1 });
  const jacket = new THREE.MeshStandardMaterial({ map: cover, roughness: 0.94, bumpMap: bump, bumpScale: 0.2 });

  const pageBlock = new THREE.Mesh(new THREE.BoxGeometry(thickness - 12, height - 14, width - 14), paper);
  pageBlock.name = "page-block";
  pageBlock.position.z = spineZ - width / 2;
  pageBlock.castShadow = true;
  pageBlock.receiveShadow = true;
  group.add(pageBlock);

  const pageGeometry = new THREE.PlaneGeometry(width - 14, height - 14, 28, 2);
  const pagePositions = pageGeometry.attributes.position;
  for (let i = 0; i < pagePositions.count; i += 1) {
    const u = (pagePositions.getX(i) + (width - 14) / 2) / (width - 14);
    pagePositions.setZ(i, Math.sin(u * Math.PI) * 1.2);
  }
  pageGeometry.computeVertexNormals();
  const pageFace = new THREE.Mesh(
    pageGeometry,
    new THREE.MeshStandardMaterial({ map: inside, roughness: 1, alphaTest: 0.08 }),
  );
  pageFace.name = "title-page";
  pageFace.rotation.y = Math.PI / 2;
  pageFace.position.set(thickness / 2 - 5.8, 0, spineZ - width / 2);
  pageFace.receiveShadow = true;
  group.add(pageFace);

  const backCover = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, boardThickness, 2, 1.2),
    [boardEdge, boardEdge, boardEdge, boardEdge, lining, boardEdge],
  );
  backCover.name = "back-cover";
  backCover.rotation.y = Math.PI / 2;
  backCover.position.set(-thickness / 2, 0, spineZ - width / 2);
  backCover.castShadow = true;
  group.add(backCover);

  // The cover pivots around its binding edge, not around the center of the artwork.
  const hinge = new THREE.Group();
  hinge.name = "cover-hinge";
  hinge.position.set(thickness / 2, 0, spineZ);
  hinge.rotation.y = Math.PI / 2;
  const frontCover = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, boardThickness, 2, 1.2),
    [boardEdge, boardEdge, boardEdge, boardEdge, jacket, lining],
  );
  frontCover.name = "front-cover";
  frontCover.position.x = width / 2;
  frontCover.castShadow = true;
  frontCover.receiveShadow = true;
  hinge.add(frontCover);
  group.add(hinge);

  const edges: number[] = [];
  for (let x = -thickness / 2 + 7; x < thickness / 2 - 6; x += 1.7) {
    for (const y of [-height / 2 + 6.8, height / 2 - 6.8]) {
      edges.push(x, y, spineZ - 7, x, y, spineZ - width + 7);
    }
    edges.push(x, -height / 2 + 7, spineZ - width + 6.8, x, height / 2 - 7, spineZ - width + 6.8);
  }
  const edgeGeometry = new THREE.BufferGeometry();
  edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(edges, 3));
  const leaves = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: "#b9ad96", transparent: true, opacity: 0.5 }));
  leaves.name = "individual-page-edges";
  group.add(leaves);

  return { group, hinge, frontCover, pageFace, width };
}

export type BookBinding = ReturnType<typeof createBookBinding>;
