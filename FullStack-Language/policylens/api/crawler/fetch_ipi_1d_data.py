# 导入必要的库
import os
import django
import pandas as pd
from api.models import IPI1DRecord  # 从 Django 应用导入模型

# 配置 Django 环境（使其能在脚本中访问 Django 模型）
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')  # 设置 Django 的默认配置文件
django.setup()  # 初始化 Django，加载模型和数据库配置

# 从马来西亚统计局（DOSM）提供的 URL 下载 IPI（工业生产指数）数据
url = 'https://storage.dosm.gov.my/ipi/ipi_1d.parquet'
df = pd.read_csv(url)  # 使用 pandas 读取 CSV 数据

# 筛选需要的列（只保留 'series', 'date', 'index', 'index_sa'）
df = df[['series', 'date', 'index', 'index_sa']]

# 遍历 DataFrame 的每一行，更新或创建数据库记录
for _, row in df.iterrows():  # _ 表示忽略行索引（不需要）
    IPI1DRecord.objects.update_or_create(
        # 查找条件：根据 'series' 和 'date' 判断记录是否已存在
        series=row['series'],
        date=row['date'],
        # 如果记录存在，则更新 'index' 和 'index_sa'；如果不存在，则创建新记录
        defaults={
            'index': row['index'],
            'index_sa': row['index_sa'],
        }
    )

