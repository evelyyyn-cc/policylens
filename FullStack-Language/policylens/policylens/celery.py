import os
from celery import Celery
from celery.schedules import crontab

# 设置Django默认设置模块
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policylens.settings')

# 创建Celery应用实例
app = Celery('policylens')

# 使用Django settings.py中以"CELERY_"开头的设置配置Celery
app.config_from_object('django.conf:settings', namespace='CELERY')

# 自动发现所有应用中的tasks.py文件
app.autodiscover_tasks()

# 配置定时任务
app.conf.beat_schedule = {
    'fetch-fuel-prices-daily': {
        'task': 'api.tasks.fetch_fuel_prices_task',
        'schedule': crontab(hour=1, minute=0),  # 每天凌晨1点执行
    },
}

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')