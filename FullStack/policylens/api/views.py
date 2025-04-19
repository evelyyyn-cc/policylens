"""
author: Sisi Wang

Description: This file is for providing apis related to fuel prices and vehicle registration fuel types

Created time: 08/04/2025
"""

# from django.shortcuts import render
# Create your views here.
from rest_framework import serializers
from .models import FuelPrice, Car
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q
from django.db.models.functions import ExtractYear, ExtractMonth


from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


def diesel_policy(request):
    return render(request, "diesel_policy.html")


def datasets_page(request):
    return render(request, "datasets_page.html")


def policies(request):
    return render(request, "policies.html")


class FuelPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelPrice
        fields = '__all__'


class FuelPriceFilterView(APIView):
    """
    API View to filter and return fuel price data based on the given fuel type
    and a date range. The response format is structured as:

    {
        "date": [<list of dates>],
        "<fuel_type>": [<list of prices>]
    }

    Query Parameters:
    - fuel_type: str (one of 'ron95', 'ron97', 'diesel', 'diesel_euro5')
    - start_date: str (format 'YYYY-MM-DD')
    - end_date: str (format 'YYYY-MM-DD')
    """
    def get(self, request):
        fuel_type = request.GET.get("fuel_type")
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")

        if fuel_type not in ["ron95", "ron97", "diesel", "diesel_euro5"]:
            return Response({"error": "Invalid fuel type"}, status=status.HTTP_400_BAD_REQUEST)
        
        if fuel_type == "diesel_euro5":
            fuel_type = "diesel_eastern"

        if not start_date or not end_date:
            return Response({"error": "Start and end dates are required"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = FuelPrice.objects.filter(date__range=[start_date, end_date]).order_by("date")

        dates = [entry.date for entry in queryset]
        values = [getattr(entry, fuel_type) for entry in queryset]

        return Response({
            "date": dates,
            fuel_type: values
        }, status=status.HTTP_200_OK)


class CarFuelStatsView(APIView):
    """
    API View to return car fuel statistics.

    Behavior:
    - If `year=all`: returns fuel type statistics (2021–2025) and yearly diesel trend
    - If `year=YYYY`: returns that year's fuel type statistics and monthly diesel trend
    - `state` can be "all" or a specific state name to filter data accordingly.
    """

    def get(self, request):
        """
        Handles GET request with parameters:
        - year: 'all' or a specific year (e.g., 2024)
        - state: 'all' or specific state name

        Returns:
        - Fuel type statistics for that year/state
        - Diesel registration trend by year (2021–2025) or by month
        """

        year = request.GET.get("year")
        state = request.GET.get("state")

        if not year or not state:
            return Response({"error": "Both 'year' and 'state' are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Base queryset
        cars = Car.objects.all()

        # Filter by state if not "all"
        if state.lower() != "all":
            cars = cars.filter(state__iexact=state)

        if year.lower() == "all":
            # Filter cars from 2021 to 2025
            cars_years = cars.annotate(y=ExtractYear("date_reg")).filter(y__gte=2021, y__lte=2025)

            # --- 1. All fuel type statistics across 2021–2025 ---
            fuel_counts = cars_years.values("fuel").annotate(count=Count("fuel"))

            # Initialize fuel stats
            fuel_result = {
                "diesel": 0,
                "electric": 0,
                "greendiesel": 0,
                "hybrid_diesel": 0,
                "hybrid_petrol": 0,
                "petrol": 0
            }

            # Fill in fuel stats
            for item in fuel_counts:
                fuel = item["fuel"]
                if fuel in fuel_result:
                    fuel_result[fuel] = item["count"]

            # --- 2. Diesel trend 2021–2025 (diesel + greendiesel) ---
            diesel_trend = (
                cars_years.filter(fuel__in=["diesel", "greendiesel"])
                          .values("y")
                          .annotate(count=Count("id"))
                          .order_by("y")
            )

            # Format diesel trend by year
            diesel_by_year = {str(entry["y"]): entry["count"] for entry in diesel_trend}

            return Response({
                "fuel_stats_2021_2025": fuel_result,
                "diesel_trend_by_year": diesel_by_year
            }, status=status.HTTP_200_OK)

        else:
            # Validate and convert year string to int
            try:
                year = int(year)
            except ValueError:
                return Response({"error": "'year' must be a valid integer or 'all'."}, status=status.HTTP_400_BAD_REQUEST)

            # Filter for that specific year
            cars_year = cars.annotate(y=ExtractYear("date_reg")).filter(y=year)

            # --- 1. Fuel stats for that year ---
            fuel_counts = cars_year.values("fuel").annotate(count=Count("fuel"))

            fuel_result = {
                "diesel": 0,
                "electric": 0,
                "greendiesel": 0,
                "hybrid_diesel": 0,
                "hybrid_petrol": 0,
                "petrol": 0
            }

            for item in fuel_counts:
                fuel = item["fuel"]
                if fuel in fuel_result:
                    fuel_result[fuel] = item["count"]

            # --- 2. Monthly diesel trend for that year ---
            diesel_monthly = (
                cars_year.filter(fuel__in=["diesel", "greendiesel"])
                         .annotate(month=ExtractMonth("date_reg"))
                         .values("month")
                         .annotate(count=Count("id"))
                         .order_by("month")
            )

            monthly_result = {str(entry["month"]): entry["count"] for entry in diesel_monthly}

            return Response({
                "fuel_stats_year": fuel_result,
                "diesel_monthly_count": monthly_result
            }, status=status.HTTP_200_OK)


