"""
author: Sisi Wang

Description: This file is for designing the model to store fuel prices on different dates

Created time: 08/04/2025
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class FuelPrice(models.Model):
    """Model to store fuel prices on different dates"""

    # Auto-incrementing primary key
    id = models.AutoField(primary_key=True)

    # Date of the fuel price record
    date = models.DateField(
        db_index=True,  # Add database index for faster querying by date
        help_text="Format: YYYY-MM-DD"
    )

    # Price for RON95 fuel
    ron95 = models.DecimalField(
        max_digits=4,  # Up to 99.99
        decimal_places=2,
        validators=[
            MinValueValidator(0.00),
            MaxValueValidator(10.00)
        ]
    )

    # Price for RON97 fuel
    ron97 = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[
            MinValueValidator(0.00),
            MaxValueValidator(10.00)
        ]
    )

    # Price for diesel fuel
    diesel = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[
            MinValueValidator(0.00),
            MaxValueValidator(10.00)
        ]
    )

    # Diesel price for East Malaysia
    diesel_eastern = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[
            MinValueValidator(0.00),
            MaxValueValidator(10.00)
        ]
    )

    class Meta:
        ordering = ['-date']  # Default ordering: latest first
        unique_together = ['date']  # Prevent duplicate records for the same date
        db_table = 'fuel_prices'  # Custom database table name

    def __str__(self):
        return f"Fuel Price - {self.date}"


class Car(models.Model):
    """Model to store registered cars and their attributes"""

    # Auto-incrementing primary key
    id = models.AutoField(primary_key=True)

    # Registration date
    date_reg = models.DateField(
        db_index=True,
        help_text="Format: YYYY-MM-DD"
    )

    # Car body type (e.g., Sedan, Hatchback)
    type = models.CharField(
        max_length=20,
        db_index=True
    )

    # Car brand (e.g., Toyota, Honda)
    maker = models.CharField(
        max_length=50,
        db_index=True
    )

    # Specific car model (e.g., Vios, Civic)
    model = models.CharField(
        max_length=50,
        db_index=True
    )

    # Car color
    colour = models.CharField(
        max_length=20
    )

    # Type of fuel used by the car (e.g., petrol, diesel)
    fuel = models.CharField(
        max_length=20,
        db_index=True
    )

    # Registration state (e.g., Selangor, Johor)
    state = models.CharField(
        max_length=20,
        db_index=True
    )

    class Meta:
        ordering = ['-date_reg']  # Default ordering: latest registrations first
        db_table = 'cars'  # Custom database table name

    def __str__(self):
        return f"{self.maker} {self.model} ({self.colour})"

    def get_fuel_price(self, date=None):
        """
        Get the fuel price for the car's fuel type on a specific date.
        If date is None, return the most recent fuel price.

        Args:
            date (datetime.date, optional): The target date. Defaults to None.

        Returns:
            Decimal or None: Fuel price matching the fuel type, or None if not found.
        """
        if date is None:
            # Get the latest available fuel price
            fuel_price = FuelPrice.objects.order_by('-date').first()
        else:
            # Get the latest fuel price on or before the given date
            fuel_price = FuelPrice.objects.filter(date__lte=date).order_by('-date').first()

        if not fuel_price:
            return None

        if self.fuel == 'petrol':
            return fuel_price.ron95
        elif self.fuel in ['diesel', 'greendiesel']:
            return fuel_price.diesel
        else:
            return None


class CPIData(models.Model):
    """Model to store Consumer Price Index (CPI) data by state and division"""

    # Auto-incrementing primary key
    id = models.AutoField(primary_key=True)

    # Date in YYYY-MM format
    date = models.CharField(
        max_length=7,
        db_index=True,  # Add database index for faster querying by date
        help_text="Format: YYYY-MM"
    )

    # State name
    state = models.CharField(
        max_length=100,
        db_index=True  # Add index for faster filtering by state
    )

    # Division/category name
    division = models.CharField(
        max_length=100,
        db_index=True  # Add index for faster filtering by division
    )

    # CPI index value
    index = models.FloatField(
        # null=True,
        validators=[
            MinValueValidator(0)  # Ensure index is non-negative
        ]
    )

    class Meta:
        ordering = ['-date']  # Default ordering: most recent first
        unique_together = ['date', 'state', 'division']  # Prevent duplicate records
        db_table = 'cpi_data'  # Custom database table name
        verbose_name = 'CPI Data'  # Human-readable name
        verbose_name_plural = 'CPI Data'  # Plural name

    def __str__(self):
        """String representation of the CPI data record"""
        return f"{self.date} - {self.state} - {self.division} - {self.index}"

