"""
author: Sisi Wang

Description: This file is for importing CPI data （Focus on all states)

Created time: 18/04/2025
"""


import os
import pandas as pd
from datetime import datetime
from django.core.management.base import BaseCommand
from api.models import CPIData


class Command(BaseCommand):
    """
    Command to import national CPI data from CSV
    """
    help = 'Import national CPI data from cpi_2d.csv into database'

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
            csv_path = os.path.join(current_dir, 'cpi_2d.csv')
            df = pd.read_csv(csv_path)

            # Filter only the divisions we need
            target_divisions = list(division_map.keys())
            df = df[df['division'].isin(target_divisions)]

            # Replace division codes with descriptive names
            df['division'] = df['division'].map(division_map)

            # Convert date to YYYY-MM format
            def convert_date(date_str):
                try:
                    return datetime.strptime(date_str, '%Y/%m/%d').strftime('%Y-%m')
                except ValueError:
                    return None

            df['date'] = df['date'].apply(convert_date)
            df = df.dropna(subset=['date'])  # Remove rows with invalid dates
            df = df.dropna(subset=['index'])  # Drop rows where index is NaN or empty

            # Create CPIData objects
            objects = [
                CPIData(
                    date=row['date'],
                    state='All States',
                    division=row['division'],
                    index=row['index']
                )
                for _, row in df.iterrows()
            ]

            # Bulk insert without checking for duplicates
            CPIData.objects.bulk_create(objects)
            self.stdout.write(self.style.SUCCESS(f"✅ Successfully imported {len(objects)} national CPI records"))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("❌ Error: cpi_2d.csv file not found"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error importing CPI data: {str(e)}"))
