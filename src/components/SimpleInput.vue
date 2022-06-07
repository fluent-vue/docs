<template>
  <div>
    <simple :user-name="userName" :user-gender="userGender" :photo-count="photoCount" class="demo" />

    <div class="p-fluid p-py-3">
      <div class="p-field p-grid">
        <label for="userName" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">$userName</label>
        <div class="p-col-12 p-md-10">
          <p-input v-model="userName" id="userName" />
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="userGender" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">$userGender</label>
        <div class="p-col-12 p-md-10">
          <p-dropdown v-model="userGender" id="userGender" :options="genderOptions" append-to='self' />
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="photoCount" class="form-label">$photoCount</label>
        <input
          v-model.number="photoCount"
          type="range"
          min="1"
          max="5"
          class="
            form-range
            appearance-none
            w-full
            h-6
            p-0
            bg-transparent
            focus:outline-none focus:ring-0 focus:shadow-none
          "
          id="photoCount"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  import Simple from './Simple.vue'

  const userName = ref('John Doe')
  const userGender = ref('male')
  const photoCount = ref(2)

  const genderOptions = [
    'male',
    'female',
    'unspecified'
  ]
</script>

<style>
  dl {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  dt {
    width: 100px;
  }

  .demo {
    padding: 1rem 1.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
</style>
