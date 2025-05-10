"""
author: Sisi Wang

Description: This file is for importing IPI 1D data with seasonally adjusted index

Created time: 08/05/2025
"""

from django.core.management.base import BaseCommand
from api.models import IPI1DRecord
import pandas as pd
import os


class Command(BaseCommand):
    help = 'Import IPI 1D data from ipi_1d_clean.csv into database'

    def handle(self, *args, **kwargs):
        current_dir = os.path.dirname(os.path.abspath(__file__))

        try:
            # Read the CSV
            csv_path = os.path.join(current_dir, 'ipi_1d_clean.csv')
            df = pd.read_csv(csv_path)

            # Parse date
            df['date'] = pd.to_datetime(df['date'], format='%Y/%m/%d').dt.date

            # Create model instances
            objects = [
                IPI1DRecord(
                    series=row['series'],
                    date=row['date'],
                    index=row['index'],
                    index_sa=row['index_sa']
                )
                for _, row in df.iterrows()
            ]

            # Bulk insert
            IPI1DRecord.objects.bulk_create(objects, ignore_conflicts=True)
            self.stdout.write(self.style.SUCCESS(f"✅ Successfully imported {len(objects)} IPI 1D records"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error importing IPI 1D data: {str(e)}"))
