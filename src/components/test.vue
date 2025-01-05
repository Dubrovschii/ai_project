<script setup>
import { ref } from "vue";

const prompt = ref(""); // Для ввода текста prompt
const response = ref(""); // Для отображения ответа от OpenAI
const isLoading = ref(false); // Для индикатора загрузки

const fetchOpenAIAnswer = async () => {
  if (!prompt.value.trim()) {
    response.value = "Please enter a prompt.";
    return;
  }

  isLoading.value = true; // Включаем индикатор загрузки
  response.value = ""; // Сбрасываем старый ответ перед новым запросом

  try {
    const res = await fetch("http://localhost:5003/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt.value }), // Передаем prompt в теле запроса
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch data from the server. Status: ${res.status}`
      );
    }

    const data = await res.json();
    if (data.success) {
      response.value = data.answer; // Сохраняем ответ от OpenAI
    } else {
      response.value = "Error: " + data.message;
    }
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    response.value = "Error fetching data from OpenAI: " + error.message;
  } finally {
    isLoading.value = false; // Отключаем индикатор загрузки
  }
};
</script>

<template>
  <div>
    <h1>Ask OpenAI</h1>
    <input v-model="prompt" placeholder="Enter your prompt" />
    <button @click="fetchOpenAIAnswer" :disabled="isLoading">Submit</button>

    <p v-if="isLoading">Loading...</p>
    <p v-if="response">{{ response }}</p>
  </div>
</template>

<style scoped>
h1 {
  color: blue;
}
button {
  margin-top: 20px;
  padding: 10px;
}
button:disabled {
  background-color: gray;
  cursor: not-allowed;
}
</style>
