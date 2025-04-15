"""
author: Sisi Wang

Description: This file is for importing fuel and car data

Created time: 08/04/2025
"""

from django.core.management.base import BaseCommand
from api.models import FuelPrice, Car
import pandas as pd
from datetime import datetime
import os


class Command(BaseCommand):
    """
    Command to import fuel and car data
    """
    help = 'Import fuel and car data'

    def handle(self, *args, **kwargs):
        current_dir = os.path.dirname(os.path.abspath(__file__))

        # Import fuel price data
        try:
            df_fuel = pd.read_csv(os.path.join(current_dir, 'fuelprice_level.csv'))
            for _, row in df_fuel.iterrows():
                FuelPrice.objects.create(
                    date=datetime.strptime(row['date'], '%Y/%m/%d').date(),
                    ron95=row['ron95'],
                    ron97=row['ron97'],
                    diesel=row['diesel'],
                    diesel_eastern=row['diesel_eastmsia']
                )
            self.stdout.write(self.style.SUCCESS("Successfully imported fuel price data"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error occurred while importing fuel price data: {str(e)}"))

        # Import car data
        try:
            df_cars = pd.read_csv(os.path.join(current_dir, 'cars_data.csv'))
            for _, row in df_cars.iterrows():
                print("date_reg:", row['date_reg'])
                Car.objects.create(
                    date_reg=datetime.strptime(row['date_reg'], '%Y-%m-%d').date(),
                    type=row['type'],
                    maker=row['maker'],
                    model=row['model'],
                    colour=row['colour'],
                    fuel=row['fuel'],
                    state=row['state']
                )

            self.stdout.write(self.style.SUCCESS("Successfully imported car data"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error occurred while importing car data: {str(e)}"))
