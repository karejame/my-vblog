---
title: "Python 自动化脚本开发实战"
date: 2024-04-09
categories: ["后端", "Python"]
tags: ["Python", "自动化", "脚本"]
draft: false
---

# Python 自动化脚本开发实战

## 为什么选择 Python 做自动化？

Python 是自动化脚本的首选语言，原因如下：
- 语法简单易学
- 丰富的标准库
- 强大的第三方生态
- 跨平台支持

## 常用自动化库

### os 和 shutil - 文件操作

```python
import os
import shutil

# 遍历目录
for root, dirs, files in os.walk('./documents'):
    for file in files:
        print(os.path.join(root, file))

# 复制文件
shutil.copy('source.txt', 'destination.txt')

# 移动文件
shutil.move('old.txt', 'new.txt')

# 创建目录
os.makedirs('new_folder', exist_ok=True)
```

### pathlib - 现代化路径操作

```python
from pathlib import Path

# 创建路径对象
path = Path('./documents')

# 遍历目录
for file in path.glob('**/*.txt'):
    print(file)

# 文件操作
file = Path('test.txt')
file.write_text('Hello, World!')
print(file.read_text())
```

### subprocess - 执行系统命令

```python
import subprocess

# 执行命令
result = subprocess.run(
    ['ls', '-la'],
    capture_output=True,
    text=True
)
print(result.stdout)

# 实时输出
process = subprocess.Popen(
    ['ping', 'google.com'],
    stdout=subprocess.PIPE,
    text=True
)
for line in process.stdout:
    print(line, end='')
```

## 实用自动化脚本

### 1. 文件批量重命名

```python
import os
from pathlib import Path

def batch_rename(directory, prefix='', suffix=''):
    path = Path(directory)
    count = 1
    
    for file_path in sorted(path.iterdir()):
        if file_path.is_file():
            ext = file_path.suffix
            new_name = f"{prefix}{count:03d}{suffix}{ext}"
            new_path = file_path.parent / new_name
            file_path.rename(new_path)
            count += 1

# 使用
batch_rename('./photos', prefix='photo_')
```

### 2. 自动备份脚本

```python
import shutil
from datetime import datetime
from pathlib import Path

def backup(source_dir, backup_dir):
    source = Path(source_dir)
    backup = Path(backup_dir)
    backup.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_name = f"{source.name}_{timestamp}"
    backup_path = backup / backup_name
    
    shutil.make_archive(
        str(backup_path),
        'zip',
        source
    )
    print(f"备份完成: {backup_path}.zip")

# 使用
backup('./documents', './backups')
```

### 3. 日志清理工具

```python
import os
from datetime import datetime, timedelta

def cleanup_logs(log_dir, days_to_keep=30):
    cutoff = datetime.now() - timedelta(days=days_to_keep)
    deleted_count = 0
    
    for root, dirs, files in os.walk(log_dir):
        for file in files:
            if file.endswith('.log'):
                file_path = os.path.join(root, file)
                file_time = datetime.fromtimestamp(
                    os.path.getmtime(file_path)
                )
                
                if file_time < cutoff:
                    os.remove(file_path)
                    deleted_count += 1
                    print(f"删除: {file_path}")
    
    print(f"共删除 {deleted_count} 个旧日志文件")

# 使用
cleanup_logs('./logs', days_to_keep=7)
```

### 4. 网站健康检查

```python
import requests
import time
from datetime import datetime

def check_website(url, timeout=10):
    try:
        start_time = time.time()
        response = requests.get(url, timeout=timeout)
        elapsed_time = (time.time() - start_time) * 1000
        
        return {
            'url': url,
            'status': 'UP',
            'status_code': response.status_code,
            'response_time_ms': round(elapsed_time, 2)
        }
    except Exception as e:
        return {
            'url': url,
            'status': 'DOWN',
            'error': str(e)
        }

websites = [
    'https://google.com',
    'https://github.com',
    'https://example.com'
]

for site in websites:
    result = check_website(site)
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {result}")
```

### 5. Excel 数据处理

```python
import openpyxl
from pathlib import Path

def process_excel(file_path):
    wb = openpyxl.load_workbook(file_path)
    ws = wb.active
    
    # 读取数据
    data = []
    for row in ws.iter_rows(values_only=True):
        data.append(row)
    
    # 处理数据
    total = 0
    for row in data[1:]:
        if row[2]:
            total += row[2]
    
    # 写入结果
    ws['E1'] = '总计'
    ws['E2'] = total
    
    # 保存
    output_path = Path(file_path).parent / 'processed.xlsx'
    wb.save(output_path)
    print(f"处理完成: {output_path}")

# 使用
process_excel('./data/sales.xlsx')
```

## 定时任务

### 使用 schedule 库

```python
import schedule
import time

def job():
    print("执行定时任务...")

schedule.every(10).minutes.do(job)
schedule.every().hour.do(job)
schedule.every().day.at("10:30").do(job)
schedule.every().monday.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
```

### 使用 APScheduler

```python
from apscheduler.schedulers.blocking import BlockingScheduler

def my_job():
    print("任务执行中...")

scheduler = BlockingScheduler()
scheduler.add_job(my_job, 'interval', minutes=10)
scheduler.add_job(my_job, 'cron', hour=10, minute=30)
scheduler.start()
```

## 最佳实践

1. **错误处理**：总是处理可能的异常
2. **日志记录**：使用 logging 模块记录操作
3. **配置文件**：将配置分离到单独文件
4. **进度显示**：使用 tqdm 显示进度条
5. **命令行参数**：使用 argparse 处理参数

## 总结

Python 的自动化能力非常强大，从简单的文件操作到复杂的系统管理都能轻松实现。掌握这些技巧可以大大提高工作效率！

