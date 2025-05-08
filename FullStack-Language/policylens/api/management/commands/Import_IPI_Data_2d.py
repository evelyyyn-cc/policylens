"""
author: Sisi Wang

Description: This file is for importing Industrial Production Index (IPI) data

Created time: 08/05/2025
"""

from django.core.management.base import BaseCommand
from api.models import IPIRecord
import pandas as pd
import os
from datetime import datetime


class Command(BaseCommand):
    """
    Command to import IPI data from CSV
    """
    help = 'Import IPI data from ipi_2d_clean.csv into database'

    def handle(self, *args, **kwargs):
        current_dir = os.path.dirname(os.path.abspath(__file__))

        try:
            # Load the CSV file
            csv_path = os.path.join(current_dir, 'ipi_2d_clean.csv')
            df = pd.read_csv(csv_path)
            print(df['series'].value_counts())
            # Convert date string to datetime.date (YYYY-MM-DD)
            df['date'] = pd.to_datetime(df['date'], format='%Y/%m/%d').dt.date

            # Create model instances
            objects = [
                IPIRecord(
                    series=row['series'],
                    date=row['date'],
                    division=row['division'],
                    desc_en=row['desc_en'],
                    index=row['index']
                )
                for _, row in df.iterrows()
            ]

            # Bulk insert
            IPIRecord.objects.bulk_create(objects, ignore_conflicts=True)
            self.stdout.write(self.style.SUCCESS(f"✅ Successfully imported {len(objects)} IPI records"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error importing IPI data: {str(e)}"))
