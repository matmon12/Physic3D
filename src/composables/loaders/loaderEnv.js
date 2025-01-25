import { ref, watch } from "vue";
import { TextureLoader, EquirectangularReflectionMapping } from "three";
import { useControlsStore } from "@/stores/controls";

export function useLoaderEnv() {
  const env = ref();
  const pathEnv = "./env/";
  const loading = ref(false);

  const controlsStore = useControlsStore();

  const loadEnv = (envName) => {
    loading.value = true;

    const newEnv = new TextureLoader().setPath(pathEnv).load(envName, () => {
      newEnv.mapping = EquirectangularReflectionMapping;
      loading.value = false;
    });

    env.value = newEnv;
    controlsStore.envMap = newEnv;
  };

  watch(
    () => controlsStore.env,
    (newEnv) => {
      loadEnv(newEnv);
    },
    {
      immediate: true,
    }
  );

  return {
    env,
    loading,
  };
}
