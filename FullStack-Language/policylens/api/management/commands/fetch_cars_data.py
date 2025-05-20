# 导入必要的库
import pandas as pd  # 用于数据处理和分析
import requests  # 用于发送HTTP请求获取数据
from io import BytesIO  # 用于处理二进制数据流
from api.models import Car  # 从当前应用导入Car模型
import logging  # 导入日志模块

# 创建logger
logger = logging.getLogger(__name__)

def fetch_and_store_car_data():
    """
    获取并存储车辆注册数据到数据库

    功能流程:
    1. 从data.gov.my获取车辆注册数据
    2. 处理并清洗数据
    3. 将数据存储到数据库(仅创建新记录)
    
    返回值:
    int: 成功添加的记录数量
    """
    # 初始化计数器
    records_added = 0

    try:
        # 数据源URL - 车辆注册数据(示例URL，实际可能需要调整)
        url = "https://storage.data.gov.my/transportation/cars_2025.parquet"
        logger.info(f"尝试从 {url} 获取数据")

        # 发送HTTP GET请求获取数据
        response = requests.get(url, timeout=30)  # 添加超时设置
        response.raise_for_status()  # 如果请求失败(4xx或5xx)则抛出异常

        # 将获取的二进制数据转换为DataFrame
        df = pd.read_csv(BytesIO(response.content))
        logger.info(f"成功获取数据，共 {len(df)} 条记录")

        # 检查数据结构
        required_columns = ["date_reg", "type", "maker", "model", "colour", "fuel", "state"]
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"数据缺少必要的列：{', '.join(missing_columns)}")

        # 数据预处理:
        # 1. 筛选需要的列: 注册日期、车辆类型、制造商、型号、颜色、燃料类型和注册州属
        df = df[required_columns]

        # 数据清洗:
        # 1. 将date_reg列转换为日期格式(自动处理无效日期为NaT)
        df["date_reg"] = pd.to_datetime(df["date_reg"], errors='coerce').dt.date
        # 2. 删除date_reg为空的记录(无效注册日期)
        df = df.dropna(subset=["date_reg"])
        logger.info(f"数据清洗后剩余 {len(df)} 条有效记录")

        # 遍历处理每一行数据
        for _, row in df.iterrows():
            # 使用create方法创建新记录(注意: 不检查是否已存在)
            Car.objects.create(
                date_reg=row["date_reg"],  # 注册日期
                type=row["type"],  # 车辆类型(如轿车、SUV等)
                maker=row["maker"],  # 制造商(如Toyota、Honda等)
                model=row["model"],  # 具体车型
                colour=row["colour"],  # 车辆颜色
                fuel=row["fuel"],  # 燃料类型(汽油、柴油、电动等)
                state=row["state"]  # 注册州属
            )
            records_added += 1

        logger.info(f"成功添加 {records_added} 条新记录到数据库")
        return records_added

    except requests.exceptions.RequestException as e:
        logger.error(f"网络请求错误: {str(e)}")
        raise
    except pd.errors.EmptyDataError:
        logger.error("获取到的CSV数据为空")
        raise
    except pd.errors.ParserError:
        logger.error("CSV解析错误，数据格式可能不正确")
        raise
    except ValueError as e:
        logger.error(f"数据验证错误: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"未预期的错误: {str(e)}")
        raise