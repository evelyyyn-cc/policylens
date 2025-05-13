# 导入必要的库
import pandas as pd  # 用于数据处理和分析
import requests  # 用于发送HTTP请求获取数据
from io import BytesIO  # 用于处理二进制数据流
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policylens.settings')
django.setup()

from api.models import FuelPrice # 从当前应用导入FuelPrice模型


def fetch_and_store_fuel_price():
    """
    获取并存储燃油价格数据到数据库

    功能流程:
    1. 从data.gov.my获取燃油价格数据
    2. 处理并清洗数据
    3. 将数据存储到数据库(新增或更新)
    """

    # 数据源URL - 燃油价格数据
    url = "https://storage.data.gov.my/commodities/fuelprice.parquet"

    # 发送HTTP GET请求获取数据
    response = requests.get(url)
    response.raise_for_status()  # 如果请求失败(4xx或5xx)则抛出异常

    # 将获取的二进制数据转换为DataFrame - 使用read_parquet而不是read_csv
    df = pd.read_parquet(BytesIO(response.content))

    # 数据预处理:
    # 1. 只保留series_type为'level'的记录(过滤掉可能的变化率等数据)
    df = df[df['series_type'] == 'level']
    # 2. 筛选需要的列: date(日期)和四种燃油价格
    df = df[["date", "ron95", "ron97", "diesel", "diesel_eastmsia"]]

    # 数据清洗:
    # 1. 将date列转换为日期格式(去除时间部分)
    df["date"] = pd.to_datetime(df["date"]).dt.date
    # 2. 去除日期重复的记录(确保每天只有一条数据)
    df = df.drop_duplicates(subset=["date"])
    
    # 3. 按日期降序排序(最近日期在前)
    df = df.sort_values(by="date", ascending=False)

    # 只遍历前10条最新的数据记录
    for _, row in df.head(10).iterrows():
        # 检查当前记录是否已存在于数据库中
        exists = FuelPrice.objects.filter(date=row["date"]).exists()
        
        # 如果记录已存在，退出循环，不再处理后续数据
        if exists:
            print(f"记录 {row['date']} 已存在，停止处理后续数据")
            break
        
        # 记录不存在，创建新记录
        obj = FuelPrice.objects.create(
            date=row["date"],
            ron95=row["ron95"],
            ron97=row["ron97"],
            diesel=row["diesel"],
            diesel_eastern=row["diesel_eastmsia"]
        )
        print(f"已创建新记录: {row['date']}")

fetch_and_store_fuel_price()