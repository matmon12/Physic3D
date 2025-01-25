import { BufferGeometry, BufferAttribute } from "three";
import { Trimesh, ConvexPolyhedron } from "cannon-es";

const createTrimesh = (geometry) => {
  const vertices = geometry.attributes.position.array;
  const indices = Object.keys(vertices).map(Number);
  return new Trimesh(vertices, indices);
};

export default createTrimesh;
