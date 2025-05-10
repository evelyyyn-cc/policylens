import pandas as pd
import requests
from io import BytesIO
from api.models import IPIRecord

division_mapping = {
    10: "Manufacture of food products",
    11: "Manufacture of beverages",
    12: "Manufacture of tobacco products",
    13: "Manufacture of textiles",
    14: "Manufacture of wearing apparel",
    15: "Manufacture of leather and related products",
    16: "Manufacture of wood and of products of wood and cork, except furniture; manufacture of articles of straw and plaiting materials",
    17: "Manufacture of paper and paper products",
    18: "Printing and reproduction of recorded media",
    19: "Manufacture of coke and refined petroleum products",
    20: "Manufacture of chemicals and chemical products",
    21: "Manufacture of basic pharmaceutical products and pharmaceutical preparations",
    22: "Manufacture of rubber and plastics products",
    23: "Manufacture of other non-metallic mineral products",
    24: "Manufacture of basic metals",
    25: "Manufacture of fabricated metal products, except machinery and equipment",
    26: "Manufacture of computer, electronic and optical products",
    27: "Manufacture of electrical equipment",
    28: "Manufacture of machinery and equipment n.e.c.",
    29: "Manufacture of motor vehicles, trailers and semi-trailers",
    30: "Manufacture of other transport equipment",
    31: "Manufacture of furniture",
    32: "Other manufacturing",
    33: "Repair and installation of machinery and equipment",
}

def fetch_and_store_ipi_data_2d():
    url = "https://storage.dosm.gov.my/ipi/ipi_2d.parquet"
    response = requests.get(url)
    df = pd.read_csv(BytesIO(response.content))

    df = df[["series", "date", "division", "index"]]
    df["desc_en"] = df["division"].map(division_mapping)
    df["date"] = pd.to_datetime(df["date"]).dt.date

    for _, row in df.iterrows():
        obj, created = IPIRecord.objects.get_or_create(
            series=row["series"],
            date=row["date"],
            division=row["division"],
            defaults={"index": row["index"], "desc_en": row["desc_en"]}
        )

        if not created:  # 如果记录已存在（没有新建）
            obj.index = row["index"]     # 更新指数字段
            obj.desc_en = row["desc_en"] # 更新行业描述字段
            obj.save()                   # 保存到数据库