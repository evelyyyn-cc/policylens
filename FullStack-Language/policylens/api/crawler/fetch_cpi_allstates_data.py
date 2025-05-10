# 导入必要的库
import pandas as pd  # 用于数据处理和分析
import requests  # 用于发送HTTP请求获取数据
from io import BytesIO  # 用于处理二进制数据流
from api.models import CPIData  # 导入CPI数据模型

# 定义行业代码(division)到类别名称(category)的映射字典
division_mapping = {
    '01': 'Food & Beverages',  # 食品和饮料类别
    '04': 'Utilities',  # 公用事业类别
    '07': 'Transport',  # 交通类别
    '11': 'Restaurant & Accommodation',  # 餐饮和住宿类别
    'overall': 'Overall CPI'  # 总体CPI类别
}


def fetch_and_store_cpi_core_data():
    """
    获取并存储核心CPI数据到数据库

    功能流程:
    1. 从DOSM获取核心CPI数据
    2. 处理并清洗数据
    3. 将数据存储到数据库(新增或更新)
    """

    # 数据源URL - 核心CPI数据
    url = "https://storage.dosm.gov.my/cpi/cpi_2d_core.parquet"

    # 发送HTTP GET请求获取数据
    response = requests.get(url)
    response.raise_for_status()  # 如果请求失败抛出HTTPError异常

    # 将获取的二进制数据转换为DataFrame
    df = pd.read_csv(BytesIO(response.content))

    # 筛选需要的列: date(日期), division(行业代码), index(指数)
    df = df[["date", "division", "index"]]

    # 将date列转换为日期格式(去除时间部分)
    df["date"] = pd.to_datetime(df["date"]).dt.date

    # 根据division_mapping映射添加category列
    df["category"] = df["division"].astype(str).map(division_mapping)

    # 添加state列并设置为"All States"(全国数据)
    df["state"] = "All States"

    # 数据清洗: 丢弃无法映射category的division数据(即category为NaN的行)
    df = df.dropna(subset=["category"])

    # 遍历处理每一行数据
    for _, row in df.iterrows():
        # 使用get_or_create方法确保数据不重复:
        # - 如果记录存在则获取，不存在则创建
        # 查询条件: state, date, division三者组合唯一
        obj, created = CPIData.objects.get_or_create(
            state=row["state"],  # 州属(这里固定为"All States")
            date=row["date"],  # 日期
            division=row["division"],  # 行业代码
            defaults={
                "index": row["index"],  # CPI指数值
                "category": row["category"]  # 类别名称
            }
        )

        # 如果记录已存在(不是新创建的)
        if not created:
            # 更新index和category字段
            obj.index = row["index"]
            obj.category = row["category"]
            obj.save()  # 保存更改到数据库