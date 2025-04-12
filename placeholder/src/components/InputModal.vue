<script setup lang="ts">
import { ref } from 'vue'

const id = ref('')
const name = ref('')

const emit = defineEmits(['submit'])

const handleSubmit = () => {
  if (id.value && name.value) {
    emit('submit', id.value, name.value)
  }
}
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <h3>插入自定义节点</h3>
      <input v-model="id" placeholder="请输入 ID" />
      <input v-model="name" placeholder="请输入 Name" />
      <button @click="handleSubmit">插入</button>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 5px;
}
button {
  width: 100%;
  padding: 8px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
</style>