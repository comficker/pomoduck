<script setup lang="ts">
const authStore = useAuthStore()

const isRegister = ref(false)

const form = ref({
  email: '',
  username: '',
  password: '',
  password2: ''
})
</script>

<template>
  <Drawer>
    <DrawerTrigger>
      <Button class="w-48 rounded-2xl h-12 text-xl relative overflow-hidden">Start</Button>
    </DrawerTrigger>
    <DrawerContent>
      <div class="max-w-md w-full mx-auto pb-24">
        <DrawerHeader>
          <DrawerTitle class="text-3xl font-bold">One step to start!</DrawerTitle>
          <DrawerDescription class="">PomoDuck is free but you need an account to tracking your work and earn crypto!
          </DrawerDescription>
        </DrawerHeader>
        <div class="px-4 space-y-3">
          <input v-if="isRegister" v-model="form.username" class="border rounded px-4 py-2 w-full" placeholder="Username"/>
          <input v-model="form.email" type="email" class="border rounded px-4 py-2 w-full" placeholder="Email"/>
          <input v-model="form.password" type="password" class="border rounded px-4 py-2 w-full"
                 placeholder="Password"/>
          <input v-if="isRegister" v-model="form.password2" type="password" class="border rounded px-4 py-2 w-full"
                 placeholder="Re-Password"/>
        </div>
        <DrawerFooter class="">
          <Button class="w-full h-10" @click="authStore.authLocal(isRegister, form)">
            <span v-if="isRegister">Register</span>
            <span v-else>Login</span>
          </Button>
          <Button variant="link" @click="isRegister = !isRegister">
            <span v-if="isRegister">Login</span>
            <span v-else>Register</span>
          </Button>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
