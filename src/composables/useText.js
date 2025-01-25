import { ref, toValue, watchEffect, shallowRef, watch, computed } from "vue";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { MeshStandardMaterial, Mesh, Group, Vector3, DoubleSide } from "three";
import { Box, Vec3, Body } from "cannon-es";
// import { useLoaderEnv } from "@/composables/loaders/loaderEnv";
import { useControlsStore } from "@/stores/controls";

export function useText(fontName, text, nameEnv) {
  let font;
  let letterOff;
  let sizeZ;
  const mass = 1;
  const letterSpace = 0.1;
  const fontUrl = "./fonts/";
  const word = shallowRef(null);
  const loading = ref(false);

  const loader = new FontLoader();

  const controlsStore = useControlsStore();
  // const { env } = useLoaderEnv(toValue(nameEnv));

  const fontOptions = {
    size: 0.7,
    height: 0,
    curveSegments: 16,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.07,
    bevelOffset: 0,
    bevelSegments: 16,
  };

  const params = computed(() => ({
    color: 0xffe6cf,
    metalness: 1,
    roughness: 0,
    envMapIntensity: 1,
    side: DoubleSide,
    envMap: controlsStore.envMap,
  }));

  const loadFont = () => {
    return new Promise((resolve, reject) => {
      loader.setPath(fontUrl).load(fontName, resolve, undefined, reject);
    });
  };

  const createText = async () => {
    const textValue = toValue(text);

    if (!font) {
      font = await loadFont();
    }

    word.value = new Group();
    letterOff = 0;
    sizeZ = 0;

    Array.from(textValue).forEach((letter, i) => {
      // mesh
      const meshText = initMesh(letter, font);
      meshText.size = meshText.geometry.boundingBox.getSize(new Vector3());
      sizeZ = meshText.size.z; // для основы

      // физическое тело
      const { center } = meshText.geometry.boundingSphere;
      meshText.body = createBody(
        meshText.size,
        center,
        letterOff,
        textValue.length
      );

      // вычесление смещения для каждой буквы + отступы между буквами
      letterOff += meshText.size.x;
      if (i !== textValue.length - 1) {
        letterOff += letterSpace;
      }

      // в слово
      word.value.add(meshText);
    });

    // центровка относительно начала координат сцены
    word.value.children.forEach((letter, i) => {
      letter.body.position.x -= letterOff * 0.5;
    });

    // основа для слова
    createGround();
  };

  const initMesh = (letter, font) => {
    const material = new MeshStandardMaterial({ ...params.value });
    const geometry = new TextGeometry(letter, {
      font: font,
      ...fontOptions,
    });

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    return new Mesh(geometry, material);
  };

  const createBody = (size, position, offset, count) => {
    const box = new Box(new Vec3().copy(size).scale(0.5));
    const body = new Body({
      mass: mass / count,
      position: new Vec3(offset + fontOptions.bevelSize, 1, 0),
    });
    // по центру геометрии буквы
    body.addShape(box, new Vec3(position.x, position.y, position.z));

    return body;
  };

  const moveDown = async () => {
    if (!word.value?.children.length) return;

    const arrayPromises = [];
    const target = new Vector3(0, -10, 0);

    word.value.children.forEach(({ body }) => {
      body.force.copy(target);

      // остановка при столкновении с платформой
      arrayPromises.push(handleCollision(body));
    });

    // ожидание обработки всех событий
    return Promise.all(arrayPromises);
  };

  const handleCollision = (body) => {
    return new Promise((resolve, reject) => {
      const onCollision = (event) => {
        if (event.body.userData?.type === "platform") {
          body.removeEventListener("collide", onCollision);

          body.velocity.set(0, 0, 0);
          body.angularVelocity.set(0, 0, 0);
          body.type = "Kinematic";
          body.mass = 0;

          body.sleep();

          // ожидание обработки события
          resolve();
        }
      };

      body.addEventListener("collide", onCollision);
    });
  };

  const update = () => {
    if (!word.value?.children.length) return;

    word.value.children.forEach((letter) => {
      letter.position.copy(letter.body.position);
      letter.quaternion.copy(letter.body.quaternion);
    });
  };

  const createGround = () => {
    const posY = -fontOptions.size / 2 - fontOptions.bevelSize;

    word.value.ground = new Body({
      mass: 0,
      shape: new Box(new Vec3(letterOff / 2, 0.001, sizeZ / 2)),
      position: new Vec3(0, posY, 0),
    });

    // для обнаружения столкновения
    word.value.ground.userData = {
      type: "platform",
    };
  };

  watch(
    () => toValue(text),
    () => {
      loading.value = true;
      createText().then(() => {
        loading.value = false;
      });
    },
    {
      immediate: true,
    }
  );

  // change envMap of material
  watch(
    () => controlsStore.env,
    () => {
      word.value.children.forEach((mesh) => {
        mesh.material.envMap = controlsStore.envMap;
        mesh.material.needsUpdate = true;
      });
    }
  );
  return { word, update, loading, moveDown };
}
