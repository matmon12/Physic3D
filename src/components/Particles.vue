<template>
  <InstancedMesh :count="COUNT" @created="initIMesh">
    <DodecahedronGeometry :radius="0.1" />
    <StandardMaterial
      :props="{
        envMap: env,
        ...MATERIALS[controlsStore.material],
      }"
    />
  </InstancedMesh>
</template>

<script setup>
import { ref, defineProps, defineModel, watch } from "vue";
import { InstancedMesh, StandardMaterial, DodecahedronGeometry } from "troisjs";
import { Object3D, MathUtils } from "three";
import { Sphere, Body } from "cannon-es";
import { COUNT, SCALE, DAMPING, MASS_INDEX, MATERIALS } from "@/constants";
import { useInstancedMesh } from "@/composables/useInstacedMesh";
import { useControlsStore } from "@/stores/controls";

const imesh = defineModel();

const { randFloat: rnd } = MathUtils;
const { getPosition, changeMaterial } = useInstancedMesh(imesh);
const controlsStore = useControlsStore();

const props = defineProps({
  env: {
    type: Object,
    required: true,
  },
});

const initIMesh = (instancedMesh) => {
  imesh.value = instancedMesh;

  const bodies = new Array(COUNT);
  const dummy = new Object3D();

  for (let i = 0; i < COUNT; i++) {
    const scale = rnd(SCALE[0], SCALE[1]);
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);

    // физическое тело (кастомная форма)
    bodies[i] = createBody(scale);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.userData.bodies = bodies;
};

const createBody = (scale) => {
  const body = new Body({
    mass: scale * MASS_INDEX,
    linearDamping: DAMPING,
    angularDamping: 0,
    shape: new Sphere(0.1 * scale),
    position: getPosition(),
    sleepSpeedLimit: 1,
  });
  body.scale = scale;
  return body;
};

// change material
watch(
  () => controlsStore.material,
  (newTypeMaterial) => {
    changeMaterial(newTypeMaterial);
  }
);
</script>

<style lang="scss" scoped></style>
