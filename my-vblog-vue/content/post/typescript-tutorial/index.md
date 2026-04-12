---
title: "TypeScript入门教程"
date: 2026-04-11
draft: false
categories:
  - 编程
  - TypeScript
tags:
  - TypeScript
  - 编程
  - 前端
---

# TypeScript入门教程

## 介绍

TypeScript是JavaScript的超集，添加了静态类型系统和其他特性，使代码更加可靠和可维护。它由Microsoft开发，已成为前端开发的重要工具。

## 为什么使用TypeScript？

- **类型安全**：静态类型检查可以在编译时捕获错误
- **更好的IDE支持**：智能提示、代码补全和重构工具
- **可维护性**：清晰的类型定义使代码更易理解
- **向后兼容**：可以渐进式地将JavaScript代码迁移到TypeScript
- **大型项目支持**：适合构建和维护大型应用

## 安装

```bash
# 使用npm安装
npm install -g typescript

# 检查版本
ts --version
```

## 基本语法

### 类型注解

```typescript
// 基本类型
let name: string = "TypeScript";
let age: number = 10;
let isActive: boolean = true;

// 数组
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// 元组
let person: [string, number] = ["Alice", 30];

// 枚举
enum Color {
  Red,
  Green,
  Blue
}
let color: Color = Color.Green;

// 任意类型
let anyValue: any = "Hello";
anyValue = 123;

// 空类型
let voidValue: void = undefined;

// 联合类型
let unionType: string | number = "Hello";
unionType = 123;
```

### 接口

```typescript
interface Person {
  name: string;
  age: number;
  email?: string; // 可选属性
  readonly id: number; // 只读属性
}

const person: Person = {
  name: "Alice",
  age: 30,
  id: 1
};
```

### 类

```typescript
class Animal {
  private name: string;
  protected age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  makeSound(): void {
    console.log("Some sound");
  }
}

class Dog extends Animal {
  breed: string;
  
  constructor(name: string, age: number, breed: string) {
    super(name, age);
    this.breed = breed;
  }
  
  makeSound(): void {
    console.log("Woof!");
  }
}

const dog = new Dog("Buddy", 5, "Golden Retriever");
dog.makeSound(); // 输出: Woof!
```

### 泛型

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>("Hello");
const numberResult = identity<number>(42);
```

## 高级特性

### 类型别名

```typescript
type StringOrNumber = string | number;
let value: StringOrNumber = "Hello";
value = 123;
```

### 接口继承

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}

const employee: Employee = {
  name: "Bob",
  age: 35,
  employeeId: 1001,
  department: "Engineering"
};
```

### 模块

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

// app.ts
import { add, subtract } from "./math";

console.log(add(5, 3)); // 输出: 8
console.log(subtract(5, 3)); // 输出: 2
```

## 配置TypeScript

创建`tsconfig.json`文件：

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## 编译和运行

```bash
# 编译TypeScript文件
tsc app.ts

# 运行编译后的JavaScript文件
node app.js

# 监视文件变化并自动编译
tsc --watch
```

## 与JavaScript的互操作性

TypeScript可以与JavaScript无缝集成：

- 可以导入JavaScript模块
- 可以使用JavaScript库
- 可以渐进式地迁移JavaScript代码到TypeScript

## 结论

TypeScript为JavaScript添加了类型安全和其他强大特性，使开发大型应用更加可靠和高效。通过本教程，您应该已经掌握了TypeScript的基本概念和使用方法。开始在您的项目中使用TypeScript，体验它带来的好处吧！
