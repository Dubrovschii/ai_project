<script setup>
import * as THREE from "three";
import { onMounted, ref } from "vue";

import img1 from "../assets/google-satellite.webp"; // Дневная текстура
import img2 from "../assets/BlackMarble_img2.jpg"; // Ночная текстура
import logo from "@/assets/img/logo.webp";

import star from "@/assets/star-outline.svg";
const canvasContainer = ref(null);

onMounted(() => {
  // Размеры сцены
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;

  // Создание сцены
  const scene = new THREE.Scene();

  // Настройка камеры
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 3;

  // Создание рендера
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  canvasContainer.value.appendChild(renderer.domElement);

  // Загрузка текстур Земли
  const textureLoader = new THREE.TextureLoader();
  const earthDayTexture = textureLoader.load(img1); // Дневная текстура
  const earthNightTexture = textureLoader.load(img1); // Ночная текстура

  // Геометрия Земли
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // Материал Земли с эмиссией
  const material = new THREE.MeshStandardMaterial({
    map: earthDayTexture, // Дневная текстура
    emissiveMap: earthNightTexture, // Ночная текстура с огнями
    emissive: 0xffffff, // Цвет свечения
    emissiveIntensity: 0, // Начальная интенсивность свечения
    metalness: 0.5,
    roughness: 0.8,
  });

  const earth = new THREE.Mesh(geometry, material);
  scene.add(earth);

  // Источник света
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(5, 5, 5);
  scene.add(light);

  // Звезды
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 1000;
  const positions = new Float32Array(starsCount * 3); // Координаты для каждой звезды

  for (let i = 0; i < starsCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 500; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 500; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 500; // z
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const starsMaterial = new THREE.PointsMaterial({
    color: 0x48fdfe,
    size: 0.5,
    sizeAttenuation: true,
  });

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // Анимация
  let emissiveIntensity = 0; // Начальная интенсивность свечения
  function animate() {
    requestAnimationFrame(animate);

    // Плавное появление огней Земли
    if (emissiveIntensity < 1) {
      emissiveIntensity += 0.01;
      material.emissiveIntensity = emissiveIntensity;
    }

    // Поворот Земли
    earth.rotation.y += 0.002;

    // Движение звезд к камере
    const positions = stars.geometry.attributes.position.array;
    for (let i = 0; i < starsCount; i++) {
      positions[i * 3 + 2] += 0.1; // Двигаем звезды по оси Z
      if (positions[i * 3 + 2] > 5) {
        positions[i * 3 + 2] = -500; // Если звезда проходит камеру, возвращаем её обратно
      }
    }
    stars.geometry.attributes.position.needsUpdate = true; // Обновляем позиции звезд

    renderer.render(scene, camera);
  }

  animate();

  // Обновление рендера при изменении размеров окна
  window.addEventListener("resize", () => {
    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
});
</script>

<template>
  <div ref="canvasContainer" class="canvas-container"></div>
</template>

<style>
.canvas-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #000; /* Цвет фона */
}
.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto;
  display: block;
  margin-top: 20px;
  box-shadow: 0px -2px 16px 1px #48fdfe;
  animation: logo 1.3s ease-in-out forwards;
}

@keyframes logo {
  0% {
    box-shadow: 0px -2px 16px 1px #45c7ff;
    opacity: 0.2;
  }
  25% {
    box-shadow: 0px -2px 16px 10px #fbfffe;
    opacity: 0.4;
  }
  50% {
    box-shadow: 0px -2px 16px 8px #50fcf3;
    opacity: 0.6;
  }
  75% {
    box-shadow: 0px -2px 16px 4px #7cfdfe;
    opacity: 0.8;
  }
  100% {
    box-shadow: 0px -2px 16px 1px #48fdfe;
    opacity: 1;
  }
}
</style>
