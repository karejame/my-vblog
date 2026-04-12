---
title: "Linux 常用命令与Shell脚本入门"
date: 2024-04-08
categories: ["运维", "Linux"]
tags: ["Linux", "Shell", "命令行"]
draft: false
---

# Linux 常用命令与Shell脚本入门

## 基础命令

### 文件系统操作

```bash
# 查看当前目录
pwd

# 列出目录内容
ls
ls -la          # 详细列表
ls -lh          # 人类可读大小

# 切换目录
cd /path/to/dir
cd ..           # 返回上级
cd ~            # 返回home
cd -            # 返回上次

# 创建目录
mkdir new_dir
mkdir -p a/b/c  # 递归创建

# 创建文件
touch file.txt

# 复制文件
cp source.txt dest.txt
cp -r src dest  # 递归复制

# 移动/重命名
mv old.txt new.txt
mv file.txt dir/

# 删除
rm file.txt
rm -r dir       # 递归删除
rm -f file       # 强制删除
```

### 文件查看与编辑

```bash
# 查看文件
cat file.txt
head file.txt    # 查看头部
tail file.txt    # 查看尾部
tail -f file.txt # 实时查看
less file.txt   # 分页查看

# 搜索内容
grep "pattern" file.txt
grep -r "pattern" .
grep -i "pattern" file.txt  # 忽略大小写

# 统计
wc file.txt
wc -l file.txt  # 统计行数
```

### 系统信息

```bash
# 查看系统信息
uname -a
hostname

# 磁盘使用
df -h
du -sh dir/

# 内存使用
free -h

# 进程查看
ps aux
ps aux | grep process_name

# 实时监控
top
htop
```

### 权限管理

```bash
# 修改权限
chmod 755 file.sh
chmod +x script.sh

# 修改所有者
chown user:group file.txt
chown -R user:group dir/
```

## Shell脚本基础

### 第一个脚本

```bash
#!/bin/bash

echo "Hello, World!"
```

### 变量

```bash
#!/bin/bash

# 变量定义
name="Alice"
age=25

# 使用变量
echo "Name: $name"
echo "Age: $age"

# 命令结果赋值
files=$(ls)
echo "Files: $files"

# 环境变量
echo "Home: $HOME"
echo "Path: $PATH"
```

### 条件判断

```bash
#!/bin/bash

read -p "输入数字: " num

if [ $num -gt 10 ]; then
    echo "大于10"
elif [ $num -eq 10 ]; then
    echo "等于10"
else
    echo "小于10"
fi

# 文件判断
if [ -f "file.txt" ]; then
    echo "文件存在"
fi
```

### 循环

```bash
#!/bin/bash

# for循环
for i in {1..5}; do
    echo "Number: $i"
done

# 遍历文件
for file in *.txt; do
    echo "处理: $file"
done

# while循环
count=1
while [ $count -le 5 ]; do
    echo "Count: $count"
    count=$((count + 1))
done
```

### 函数

```bash
#!/bin/bash

# 定义函数
greet() {
    echo "Hello, $1!"
}

# 调用函数
greet "Alice"
greet "Bob"

# 带返回值
add() {
    return $(( $1 + $2 ))
}

add 2 3
echo "Result: $?"
```

## 实用脚本

### 1. 备份脚本

```bash
#!/bin/bash

SOURCE_DIR="/path/to/source"
BACKUP_DIR="/path/to/backup"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$SOURCE_DIR"

echo "备份完成: backup_$DATE.tar.gz"
```

### 2. 日志清理脚本

```bash
#!/bin/bash

LOG_DIR="/var/log/app"
DAYS_TO_KEEP=30

find "$LOG_DIR" -name "*.log" -mtime +$DAYS_TO_KEEP -delete

echo "已删除 $DAYS_TO_KEEP 天前的日志"
```

### 3. 磁盘空间监控

```bash
#!/bin/bash

THRESHOLD=80
EMAIL="admin@example.com"

USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

if [ "$USAGE" -gt "$THRESHOLD" ]; then
    echo "警告: 磁盘使用率已达 $USAGE%" | mail -s "磁盘空间警告" "$EMAIL"
fi
```

### 4. 文件同步脚本

```bash
#!/bin/bash

SOURCE="/local/path"
DEST="user@server:/remote/path"

rsync -avz --delete "$SOURCE/" "$DEST/"

echo "同步完成"
```

### 5. 服务重启脚本

```bash
#!/bin/bash

SERVICE="nginx"

if ! systemctl is-active --quiet "$SERVICE"; then
    echo "$SERVICE 未运行，正在重启..."
    systemctl restart "$SERVICE"
    
    if systemctl is-active --quiet "$SERVICE"; then
        echo "$SERVICE 已成功重启"
    else
        echo "$SERVICE 重启失败"
    fi
else
    echo "$SERVICE 正常运行"
fi
```

## 高级技巧

### 命令行参数

```bash
#!/bin/bash

echo "脚本名: $0"
echo "参数1: $1"
echo "参数2: $2"
echo "所有参数: $@"
echo "参数数量: $#"
```

### 数组

```bash
#!/bin/bash

fruits=("apple" "banana" "cherry")

echo "第一个: ${fruits[0]}"
echo "所有: ${fruits[@]}"
echo "数量: ${#fruits[@]}"

for fruit in "${fruits[@]}"; do
    echo "Fruit: $fruit"
done
```

### 字符串操作

```bash
#!/bin/bash

str="Hello World"

echo "长度: ${#str}"
echo "子串: ${str:6:5}"
echo "替换: ${str/World/Vue}"
```

## 最佳实践

1. **添加注释**：解释脚本的用途和复杂逻辑
2. **使用 set -euo pipefail**：增强错误处理
3. **检查依赖**：验证所需命令和文件是否存在
4. **提供帮助信息**：使用 --help 或 -h 选项
5. **日志记录**：记录重要操作和错误

## 总结

Linux 命令和 Shell 脚本是运维工作的基础。掌握这些常用命令和脚本技巧，可以大大提高工作效率。

