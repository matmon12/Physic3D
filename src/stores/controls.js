import { defineStore } from "pinia";
import { ref } from "vue";

export const useControlsStore = defineStore("controls", () => {
  const material = ref("emerald");
  const text = ref("Forest");
  const env = ref("back-3.jpg");
  const envClass = ref("forest");

  const envMap = ref();

  return { material, text, env, envMap, envClass };
});
