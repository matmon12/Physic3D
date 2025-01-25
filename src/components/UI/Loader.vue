<template>
  <div class="loader">
    <div class="loader__content">
      <h1 class="loader-title"><span>THE</span>FOREST</h1>
      <div class="loader__progess">
        <p class="loader-text">LOADING</p>
        <i-svg-spinners:3-dots-fade />
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.loader {
  font-family: "Play", sans-serif;
  font-weight: 700;
  position: absolute;
  background-color: var(--body-background);
  width: 100%;
  height: 100%;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.loader__content {
}
.loader-title {
  display: flex;
  flex-direction: column;
  font-size: 80px;
  margin-bottom: 15px;
  line-height: 1;
  color: var(--loader-title);
  letter-spacing: 1px;

  span {
    font-size: 24px;
    margin-bottom: -10px;
  }
}
.loader__progess {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  svg {
    height: 12px;
    margin-bottom: -2px;
  }
}
.loader-text {
  font-size: 14px;
  letter-spacing: 2px;
  font-weight: 700;
}
</style>
