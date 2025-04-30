"""
author: Sisi Wang

Description: This file is for importing CPI data

Created time: 18/04/2025
"""

from django.core.management.base import BaseCommand
from api.models import CPIData
import pandas as pd
import os


class Command(BaseCommand):
    """
    Command to import CPI data from CSV
    """
    help = 'Import CPI data from cpi_2d_state.csv into database'

    def handle(self, *args, **kwargs):
        current_dir = os.path.dirname(os.path.abspath(__file__))

        # CPI division mapping
        division_map = {
            '01': 'Food & Beverages',
            '04': 'Utilities',
            '07': 'Transport',
            '11': 'Restaurant & Accommodation',
            'overall': 'Overall CPI'
        }

        try:
            # Load data
            csv_path = os.path.join(current_dir, 'cpi_2d_state.csv')
            df = pd.read_csv(csv_path)

            # Filter only the divisions we care about
            target_divisions = list(division_map.keys())
            df = df[df['division'].isin(target_divisions)]

            # Replace division codes with names
            df['division'] = df['division'].map(division_map)

            # Create and import CPIData objects
            objects = [
                CPIData(
                    date=row['date'][:7],  # Keep only year-month (e.g., 2023-08)
                    state=row['state'],
                    division=row['division'],
                    index=row['index']
                )
                for _, row in df.iterrows()
            ]

            CPIData.objects.bulk_create(objects)
            self.stdout.write(self.style.SUCCESS(f"✅ Successfully imported {len(objects)} CPI records"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error importing CPI data: {str(e)}"))