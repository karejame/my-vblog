---
title: "TypeScript 类型系统深度解析"
date: 2024-04-07
categories: ["前端", "TypeScript"]
tags: ["TypeScript", "JavaScript", "类型系统"]
draft: false
---

# TypeScript 类型系统深度解析

## 为什么需要 TypeScript？

TypeScript 为 JavaScript 添加了静态类型检查，带来以下好处：
- 提前发现错误
- 更好的 IDE 支持
- 代码更易维护
- 重构更安全

## 基本类型

### 原始类型

```typescript
let name: string = "Alice"
let age: number = 25
let isActive: boolean = true
let nothing: null = null
let notDefined: undefined = undefined
```

### 数组类型

```typescript
let numbers: number[] = [1, 2, 3]
let names: Array<string> = ["Alice", "Bob"]

let mixed: (string | number)[] = [1, "two", 3]
```

### 对象类型

```typescript
// 类型别名
type Person = {
  name: string
  age: number
  isActive?: boolean
}

let person: Person = {
  name: "Alice",
  age: 25
}

// 接口
interface User {
  id: number
  name: string
  email: string
}

let user: User = {
  id: 1,
  name: "Bob",
  email: "bob@example.com"
}
```

### 联合类型与交叉类型

```typescript
type StringOrNumber = string | number

let value: StringOrNumber = "hello"
value = 42

type A = { a: number }
type B = { b: string }
type C = A & B

let c: C = { a: 1, b: "test" }
```

## 高级类型

### 泛型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg
}

let num = identity<number>(42)
let str = identity("hello")

// 泛型接口
interface Box<T> {
  value: T
}

let box: Box<string> = { value: "test" }

// 泛型类
class Stack<T> {
  private items: T[] = []
  
  push(item: T) {
    this.items.push(item)
  }
  
  pop(): T | undefined {
    return this.items.pop()
  }
}

let numberStack = new Stack<number>()
```

### 类型守卫

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string"
}

function processValue(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase())
  }
}
```

### 类型断言

```typescript
let someValue: unknown = "hello world"

let strLength: number = (someValue as string).length
// 或
let strLength2: number = (<string>someValue).length
```

## 工具类型

### 内置工具类型

```typescript
interface User {
  id: number
  name: string
  email: string
  isActive: boolean
}

// Partial - 所有属性可选
type PartialUser = Partial<User>

// Required - 所有属性必需
type RequiredUser = Required<PartialUser>

// Pick - 选取部分属性
type UserName = Pick<User, "id" | "name">

// Omit - 排除部分属性
type UserWithoutEmail = Omit<User, "email">

// Readonly - 所有属性只读
type ReadonlyUser = Readonly<User>

// Record - 构造对象类型
type UserMap = Record<string, User>
```

### 自定义工具类型

```typescript
type NonNullableKeys<T> = {
  [K in keyof T]-?: T[K]
}

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K]
}
```

## 类型体操

### 条件类型

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string>   // true
type B = IsString<number>   // false

// 分发条件类型
type ToArray<T> = T extends any ? T[] : never

type C = ToArray<string | number>  // string[] | number[]
```

### 映射类型

```typescript
type Keys = "a" | "b" | "c"

type Obj = {
  [K in Keys]: K
}

// { a: "a"; b: "b"; c: "c" }

type Mapped<T> = {
  [K in keyof T]: T[K]
}
```

### 模板字面量类型

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`

type ClickEvent = EventName<"click">  // "onClick"

type Status = "success" | "error"
type Message = `status_${Status}`
// "status_success" | "status_error"
```

## 装饰器

### 类装饰器

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
}
```

### 方法装饰器

```typescript
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args)
    const result = originalMethod.apply(this, args)
    console.log(`Result:`, result)
    return result
  }
  
  return descriptor
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b
  }
}
```

## 最佳实践

1. **启用严格模式**：在 tsconfig.json 中设置 `strict: true`
2. **避免 any**：尽量使用 unknown 代替 any
3. **类型推断**：让 TypeScript 自动推断类型，不要过度标注
4. **使用类型守卫**：安全地缩小类型范围
5. **善用工具类型**：利用内置和自定义工具类型简化代码

## 总结

TypeScript 的类型系统是其最强大的特性之一。掌握这些类型技巧，可以写出更安全、更易维护的代码。

