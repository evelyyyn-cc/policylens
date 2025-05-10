# 导入必要的库
import pandas as pd  # 用于数据处理和分析
import requests  # 用于发送HTTP请求获取数据
from io import BytesIO  # 用于处理二进制数据流
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

    # 将获取的二进制数据转换为DataFrame
    df = pd.read_csv(BytesIO(response.content))

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

    # 遍历处理每一行数据
    for _, row in df.iterrows():
        # 使用get_or_create方法确保数据不重复:
        # - 如果记录存在则获取，不存在则创建
        # 查询条件: date(日期)唯一
        obj, created = FuelPrice.objects.get_or_create(
            date=row["date"],  # 日期作为唯一标识
            defaults={  # 新记录时设置的默认值
                "ron95": row["ron95"],  # RON95汽油价格
                "ron97": row["ron97"],  # RON97汽油价格
                "diesel": row["diesel"],  # 柴油价格(西马)
                "diesel_eastern": row["diesel_eastmsia"]  # 柴油价格(东马)
            }
        )

        # 如果记录已存在(不是新创建的)
        if not created:
            # 更新所有燃油价格字段
            obj.ron95 = row["ron95"]
            obj.ron97 = row["ron97"]
            obj.diesel = row["diesel"]
            obj.diesel_eastern = row["diesel_eastmsia"]
            obj.save()  # 保存更改到数据库