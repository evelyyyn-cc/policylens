# Generated by Django 5.1.7 on 2025-05-10 10:11

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_ipirecord_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ipi1drecord',
            name='index_sa',
            field=models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0)], verbose_name='Seasonally Adjusted Index'),
        ),
    ]
