<template>
  <div class="home">
    <Renderer
      ref="renderer"
      resize="window"
      pointer
      shadow
      antialias
      auto-clear
    >
      <Camera ref="camera" :fov="45" :position="{ x: 0, y: 0, z: 4 }" />
      <Scene ref="scene" :background="env">
        <Particles v-model="imesh" :env="env" />
      </Scene>
    </Renderer>
    <ControlsMenu />
    <transition name="slide-fade">
      <Loader v-if="loadingEnv || loadingText" />
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, shallowRef } from "vue";
import { Renderer, Camera, Scene } from "troisjs";
import { Vector3 } from "three";
import { useLoaderEnv } from "@/composables/loaders/loaderEnv";
import { useText } from "@/composables/useText";
import { World } from "cannon-es";
import { useInstancedMesh } from "@/composables/useInstacedMesh";
import { useControlsStore } from "@/stores/controls";
import { FONT } from "@/constants";

let world;
const delta = 1 / 60;
const imesh = shallowRef();
const scene = ref();
const camera = ref();
const renderer = ref();
const movingText = ref(true);

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

const controlsStore = useControlsStore();
const { env, loading: loadingEnv } = useLoaderEnv();
const textTitle = ref(controlsStore.text);
const {
  word,
  update: updatePosText,
  loading: loadingText,
  moveDown,
} = useText(FONT, textTitle);
const { updatePosMesh, resetPosition } = useInstancedMesh(imesh);

const initWorld = () => {
  world = new World();
  world.gravity.set(0, 0, 0);
};

const rendererWorld = () => {
  moveToCursor();

  world.step(delta);

  updatePosMesh();
  updatePosText();
};

// moving with cursor
const moveToCursor = () => {
  if (!imesh.value.userData?.bodies.length || movingText.value) return;

  const v = new Vector3();
  const target = renderer.value.three.pointer.positionV3;
  imesh.value.userData.bodies.forEach((body) => {
    v.copy(target).sub(body.position).normalize().multiplyScalar(0.5);
    v.clampScalar(-0.5, 0.5);
    body.force.copy(v);
  });
};

const onMouseMove = () => {
  const { x, y } = renderer.value.three.pointer.position;

  const mouseX = ((x - windowHalfX) / 100) * 0.05;
  const mouseY = (-(y - windowHalfY) / 100) * 0.05;

  camera.value.camera.position.x = mouseX;
  camera.value.camera.position.y = mouseY;
  camera.value.camera.lookAt(scene.value.scene.position);
};

onMounted(() => {
  initWorld();

  renderer.value.onBeforeRender(() => {
    rendererWorld();
    onMouseMove();
  });
});

// update text
const updateText = (newText) => {
  if (word.value && newText !== textTitle.value) {
    // удаление геометрии и тел
    scene.value.remove(word.value);
    word.value.children.forEach((mesh) => {
      if (mesh.body) {
        world.removeBody(mesh.body);
      }
    });

    // удаление основы (тело)
    if (word.value.ground) {
      world.removeBody(word.value.ground);
    }

    word.value = null;
    textTitle.value = newText;
  }
};

watch(
  () => controlsStore.text,
  (newText) => {
    updateText(newText);
  }
);

// text / ground
watch(
  () => word.value,
  (newText) => {
    if (newText) {
      addGround(newText);
      addText(newText);
    }
  }
);

const addText = (newText) => {
  // добавить в мир каждую букву
  newText.children.forEach((mesh) => {
    if (mesh.body) {
      world.addBody(mesh.body);
    }
  });
  scene.value.add(newText);

  // падение текста при первом появлении и обновлении
  moveToCenter();
};

const addGround = (newText) => {
  // добавить в мир твердую основу под текст
  if (newText.ground) {
    world.addBody(newText.ground);
  }
};

const moveToCenter = () => {
  movingText.value = true;
  resetPosition();
  moveDown().then(() => {
    movingText.value = false;
  });
};

// paricles
watch(
  () => imesh.value,
  (newMesh) => {
    addParticles(newMesh);
  }
);

const addParticles = (newMesh) => {
  if (newMesh.userData?.bodies.length) {
    newMesh.userData.bodies.forEach((body) => {
      world.addBody(body);
    });
  }
};
</script>

<style scoped lang="scss">
.home {
  position: relative;
}
canvas {
  width: 100%;
  z-index: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
