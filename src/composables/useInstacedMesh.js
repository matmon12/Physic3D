import { watch } from "vue";
import { Object3D, MathUtils, MeshStandardMaterial } from "three";
import { Vec3 } from "cannon-es";
import { randomTwoRange } from "@/utils";
import { useControlsStore } from "@/stores/controls";
import { MATERIALS } from "@/constants";

const { randFloatSpread: rndFS } = MathUtils;

export function useInstancedMesh(imesh, env) {
  const dummy = new Object3D();

  const controlsStore = useControlsStore();

  const updatePosMesh = () => {
    imesh.value.userData.bodies.forEach((body, i) => {
      dummy.position.copy(body.position);
      dummy.quaternion.copy(body.quaternion);
      dummy.scale.set(body.scale, body.scale, body.scale);
      dummy.updateMatrix();
      imesh.value.setMatrixAt(i, dummy.matrix);
    });
    imesh.value.instanceMatrix.needsUpdate = true;
  };

  const getPosition = () => {
    return new Vec3(randomTwoRange([-6, -5], [5, 6]), rndFS(2), rndFS(2));
  };

  const resetPosition = () => {
    if (!imesh.value?.userData?.bodies.length) return;

    imesh.value.userData.bodies.forEach((body) => {
      body.position.copy(getPosition());
    });
  };

  const changeMaterial = (newTypeMaterial) => {
    const material = MATERIALS[newTypeMaterial];
    const newMaterial = new MeshStandardMaterial({
      ...material,
      envMap: controlsStore.envMap,
    });
    imesh.value.material = newMaterial;

    imesh.value.material.needsUpdate = true;
  };

  // change envMap of new material
  watch(
    () => controlsStore.env,
    () => {
      imesh.value.material.envMap = controlsStore.envMap;
      imesh.value.material.needsUpdate = true;
    }
  );

  return { updatePosMesh, getPosition, resetPosition, changeMaterial };
}
