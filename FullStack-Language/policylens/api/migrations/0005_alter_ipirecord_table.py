# Generated by Django 5.1.7 on 2025-05-08 05:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_ipirecord'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='ipirecord',
            table='ipi_data_2d',
        ),
    ]
