---
title: "Vue 3 Composition API 完整指南"
date: 2024-04-10
categories: ["前端", "Vue"]
tags: ["Vue", "JavaScript", "前端框架"]
draft: false
---

# Vue 3 Composition API 完整指南

## 什么是 Composition API？

Vue 3 引入了 Composition API，这是一种新的组织和复用组件逻辑的方式。与 Options API 相比，Composition API 提供了更灵活的代码组织方式。

## 基本使用

### setup 函数

```javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    const doubleCount = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return {
      count,
      doubleCount,
      increment
    }
  }
}
```

### 使用 `script setup`

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('组件已挂载')
})
</script>
```

## 核心概念

### ref 和 reactive

```javascript
import { ref, reactive } from 'vue'

const count = ref(0)
console.log(count.value)

const state = reactive({
  count: 0,
  name: 'Vue'
})
console.log(state.count)
```

### 生命周期钩子

```javascript
import { 
  onMounted, 
  onUpdated, 
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount
} from 'vue'

onMounted(() => {
  console.log('mounted')
})

onUpdated(() => {
  console.log('updated')
})

onUnmounted(() => {
  console.log('unmounted')
})
```

## 自定义 Hooks

### useCounter Hook

```javascript
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = initialValue
  }
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}
```

### useFetch Hook

```javascript
import { ref, onMounted } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  async function fetchData() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchData)
  
  return {
    data,
    error,
    loading,
    refetch: fetchData
  }
}
```

## 与 Options API 对比

| 特性 | Options API | Composition API |
|------|-------------|-----------------|
| 代码组织 | 按选项分块 | 按逻辑组织 |
| 逻辑复用 | Mixins | 自定义 Hooks |
| TypeScript 支持 | 较差 | 优秀 |
| Tree-shaking | 有限 | 优秀 |

## 最佳实践

1. **使用 `script setup`**：这是推荐的方式，代码更简洁
2. **合理拆分 Hooks**：将逻辑拆分成可复用的函数
3. **保持响应式**：正确使用 `ref` 和 `reactive`
4. **合理使用 computed**：避免不必要的计算
5. **及时清理**：在 `onUnmounted` 中清理副作用

## 总结

Composition API 是 Vue 3 的一个重大改进，它让我们能够更好地组织和复用代码。虽然学习曲线稍微陡峭一些，但一旦掌握，就能大大提高开发效率。

