import { Vec3, ConvexPolyhedron } from "cannon-es";
import { DodecahedronGeometry } from "three";

const t = (1 + Math.sqrt(5)) / 2;
const r = 1 / t;
const scaleFactor = 0.5;

const vertices = [
  new Vec3(-1, -1, -1).scale(scaleFactor),
  new Vec3(-1, -1, 1).scale(scaleFactor),
  new Vec3(-1, 1, -1).scale(scaleFactor),
  new Vec3(-1, 1, 1).scale(scaleFactor),
  new Vec3(1, -1, -1).scale(scaleFactor),
  new Vec3(1, -1, 1).scale(scaleFactor),
  new Vec3(1, 1, -1).scale(scaleFactor),
  new Vec3(1, 1, 1).scale(scaleFactor),
  new Vec3(0, -r, -t).scale(scaleFactor),
  new Vec3(0, -r, t).scale(scaleFactor),
  new Vec3(0, r, -t).scale(scaleFactor),
  new Vec3(0, r, t).scale(scaleFactor),
  new Vec3(-r, -t, 0).scale(scaleFactor),
  new Vec3(-r, t, 0).scale(scaleFactor),
  new Vec3(r, -t, 0).scale(scaleFactor),
  new Vec3(r, t, 0).scale(scaleFactor),
  new Vec3(-t, 0, -r).scale(scaleFactor),
  new Vec3(t, 0, -r).scale(scaleFactor),
  new Vec3(-t, 0, r).scale(scaleFactor),
  new Vec3(t, 0, r).scale(scaleFactor),
];

const indices = [
  [3, 11, 7],
  [3, 7, 15],
  [3, 15, 13],
  [7, 19, 17],
  [7, 17, 6],
  [7, 6, 15],
  [17, 4, 8],
  [17, 8, 10],
  [17, 10, 6],
  [8, 0, 16],
  [8, 16, 2],
  [8, 2, 10],
  [0, 12, 1],
  [0, 1, 18],
  [0, 18, 16],
  [6, 10, 2],
  [6, 2, 13],
  [6, 13, 15],
  [2, 16, 18],
  [2, 18, 3],
  [2, 3, 13],
  [18, 1, 9],
  [18, 9, 11],
  [18, 11, 3],
  [4, 14, 12],
  [4, 12, 0],
  [4, 0, 8],
  [11, 9, 5],
  [11, 5, 19],
  [11, 19, 7],
  [19, 5, 14],
  [19, 14, 4],
  [19, 4, 17],
  [1, 12, 14],
  [1, 14, 5],
  [1, 5, 9],
];

const createBody = () => {
  const dodecahedronGeometry = new DodecahedronGeometry(0.1, 0);
  const position = dodecahedronGeometry.attributes.position.array;
  const dodecahedronPoints = [];
  for (let i = 0; i < position.length; i += 3) {
    dodecahedronPoints.push(
      new Vec3(position[i], position[i + 1], position[i + 2])
    );
  }

  const dodecahedronFaces = [];
  for (let i = 0; i < position.length / 3; i += 3) {
    dodecahedronFaces.push([i, i + 1, i + 2]);
  }

  const dodecahedronShape = new ConvexPolyhedron({
    vertices: vertices,
    faces: indices,
  });

  return dodecahedronShape;
};

export default createBody;
