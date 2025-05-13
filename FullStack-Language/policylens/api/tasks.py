from celery import shared_task
from django.core.management import call_command


@shared_task
def fetch_fuel_prices_task():
    """
    调用获取燃油价格数据的管理命令的Celery任务
    
    此任务将由Celery Beat按计划执行，默认每天凌晨1点执行一次
    """
    call_command('fetch_fuel_prices')
    return "已完成燃油价格数据获取" 