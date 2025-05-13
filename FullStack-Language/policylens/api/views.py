"""
author: Sisi Wang

Description: This file is for providing apis related to fuel prices and vehicle registration fuel types

Created time: 08/04/2025
"""

# from django.shortcuts import render
# Create your views here.
from rest_framework import serializers
from .models import FuelPrice, Car, CPIData, IPI1DRecord, IPIRecord
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q, Avg
from django.db.models.functions import ExtractYear, ExtractMonth, TruncMonth
from django.utils import translation
from django.shortcuts import redirect
from datetime import datetime, timedelta
import calendar
import pandas as pd


from django.shortcuts import render

def index(request):
    return render(request, 'index.html')


def diesel_policy(request):
    return render(request, "diesel_policy.html")


def datasets_page(request):
    return render(request, "datasets_page.html")


def policies(request):
    return render(request, "policies.html")

def cpi_impact(request):
    return render(request, "cpi_impact.html")

def cpi_dataset(request):
    return render(request, "cpi_datasets.html")

def ai_chatbot(request):
    return render(request,'ai_chatbot.html')

def manufacturing_impact(request):
    return render(request, "manufacturing_impact.html")


class FuelPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelPrice
        fields = '__all__'

def set_language(request):
    user_lang = request.GET.get('language', 'en')
    translation.activate(user_lang)
    request.session[translation.LANGUAGE_SESSION_KEY] = user_lang
    return redirect('/')

class CPIDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CPIData
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



class CPIReportAPI(APIView):
    """
    API endpoint to retrieve CPI data for specific year and state
    Returns data in format:
    [
        {
            "date": "YYYY-MM",
            "Food & Beverages": float,
            "Utilities": float,
            "Transport": float,
            "Restaurant & Accommodation": float,
            "Overall CPI": float
        },
        ...
    ]
    """

    # Hardcoded divisions we need to include in the response
    REQUIRED_DIVISIONS = [
        'Food & Beverages',
        'Utilities',
        'Transport',
        'Restaurant & Accommodation',
        'Overall CPI'
    ]

    def get(self, request):
        """
        Handle POST request with parameters:
        - year: integer (e.g., 2023)
        - state: string (e.g., "Johor")

        return Json format:
        [{
        "date": "2023-01",
        "Food & Beverages": 158.0,
        "Utilities": 124.8,
        "Transport": 120.4,
        "Restaurant & Accommodation": 146.8,
        "Overall CPI": 132.9
    }
    ...,
    ]
         """
        # Extract parameters from request body
        year = request.GET.get('year')
        state = request.GET.get('state')
        print("testing",year, state)

        # Validate required parameters
        if not year or not state:
            return Response(
                {"error": "Missing required parameters: year or state"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Query database for matching records
        cpi_data = CPIData.objects.filter(
            date__startswith=str(year),  # Match year prefix in YYYY-MM format
            state=state,  # Exact match for single state
            division__in=self.REQUIRED_DIVISIONS
        ).order_by('date', 'division')

        # Process data into required format
        processed_data = self._structure_response(cpi_data)

        return Response(processed_data, status=status.HTTP_200_OK)

    def _structure_response(self, queryset):
        """
        Transform queryset into the required response format:
        - Group by date
        - Pivot divisions into columns
        """
        result = {}

        for entry in queryset:
            # Use date as the primary key
            if entry.date not in result:
                result[entry.date] = {
                    'date': entry.date,
                    # Initialize all divisions with None
                    **{div: None for div in self.REQUIRED_DIVISIONS}
                }

            # Update division value if present in dataset
            if entry.division in self.REQUIRED_DIVISIONS:
                result[entry.date][entry.division] = entry.index

        # Convert dictionary to sorted list
        return sorted(result.values(), key=lambda x: x['date'])


class IPI1DRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = IPI1DRecord
        fields = '__all__'


class IPI1DDataView(APIView):
    """
    API View to retrieve IPI1D data based on year and series_type.
    
    Query Parameters:
    - year: 'all' or specific year (e.g., 2023)
    - series_type:  'abs', 'growth_mom', or 'growth_yoy'
    
    Returns data in format:
    [
        {
            "date": "YYYY-MM-DD",
            "series": "abs/growth_mom/growth_yoy",
            "index": float,
            "index_sa": float
        },
        ...
    ]
    """
    
    def get(self, request):
        """
        Handle GET request with parameters:
        - year: 'all' or specific year
        - series_type: 'abs', 'growth_mom', or 'growth_yoy'
        """
        year = request.GET.get('year')
        series_type = request.GET.get('series_type')
        
        # Validate parameters
        if not year or not series_type:
            return Response(
                {"error": "Missing required parameters: year or series_type"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if series_type not in ['abs', 'growth_mom','growth_yoy']:
            return Response(
                {"error": "Invalid series_type. Must be 'abs' , 'growth_mom' or 'growth_yoy'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Base query for the specified series_type
        queryset = IPI1DRecord.objects.filter(series=series_type)
        
        # Apply year filter
        if year.lower() == 'all':
            # Get data from Feb 2023 to the latest
            start_date = datetime(2023, 2, 1)
            queryset = queryset.filter(date__gte=start_date)
        else:
            try:
                year_int = int(year)
                start_date = datetime(year_int, 1, 1)
                # Calculate the end date (last day of the year)
                end_date = datetime(year_int, 12, 31)
                queryset = queryset.filter(date__gte=start_date, date__lte=end_date)
            except ValueError:
                return Response(
                    {"error": "Invalid year format. Must be 'all' or a valid year (e.g., 2023)"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Order by date (ascending)
        queryset = queryset.order_by('date')
        
        # Serialize the data
        serializer = IPI1DRecordSerializer(queryset, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class IPIRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = IPIRecord
        fields = '__all__'


class IPIDataView(APIView):
    """
    API View to retrieve IPI data based on year, month, series_type, and display parameters.
    
    Query Parameters:
    - year: specific year (e.g., 2023)
    - month: specific month (1-12)
    - series_type: 'abs', 'growth_mom', or 'growth_yoy'
    - display: 'all' or 'top' (top returns top 10 records by index value)
    
    Returns data in format:
    [
        {
            "date": "YYYY-MM-DD",
            "series": "abs/growth_mom/growth_yoy",
            "index": float,
            "division": int,
            "desc_en": string
        },
        ...
    ]
    """
    
    def get(self, request):
        """
        Handle GET request with parameters:
        - year: specific year
        - month: specific month
        - series_type: 'abs', 'growth_mom', or 'growth_yoy'
        - display: 'all' or 'top'
        """
        year = request.GET.get('year')
        month = request.GET.get('month')
        series_type = request.GET.get('series_type')
        display = request.GET.get('display')
        
        # Validate parameters
        if not year or not month or not series_type or not display:
            return Response(
                {"error": "Missing required parameters: year, month, series_type, or display"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if series_type not in ['abs', 'growth_mom', 'growth_yoy']:
            return Response(
                {"error": "Invalid series_type. Must be 'abs', 'growth_mom', or 'growth_yoy'"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if display not in ['all', 'top']:
            return Response(
                {"error": "Invalid display parameter. Must be 'all' or 'top'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            year_int = int(year)
            month_int = int(month)
            
            if month_int < 1 or month_int > 12:
                return Response(
                    {"error": "Invalid month. Must be between 1 and 12"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Create date for filtering
            start_date = datetime(year_int, month_int, 1)
            
            # Get the last day of the month
            _, last_day = calendar.monthrange(year_int, month_int)
            end_date = datetime(year_int, month_int, last_day)
            
        except ValueError:
            return Response(
                {"error": "Invalid year or month format. Year must be a valid year and month must be between 1-12."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Base query for the specified series_type and date range
        queryset = IPIRecord.objects.filter(
            series=series_type,
            date__gte=start_date,
            date__lte=end_date
        )
        
        # Apply display filter (top 10 or all)
        if display == 'top':
            queryset = queryset.order_by('-index')[:10]
        else:
            # For 'all', just order by division
            queryset = queryset.order_by('division')
        
        # Serialize the data
        serializer = IPIRecordSerializer(queryset, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class ManufacturingDivisionsDataView(APIView):
    """
    API View to process manufacturing divisions data with abs, yoy and mom changes.
    
    GET Request Body:
    - year: specific year (e.g., 2023)
    - month: specific month (1-12)
    
    Returns data in format:
    [
        {
            "division": int,
            "desc_en": string,
            "abs": float,
            "yoy_change": float,
            "mom_change": float
        },
        ...
    ]
    """
    
    def get(self, request):
        """
        Handle POST request with body parameters:
        - year: specific year
        - month: specific month
        """
        # Extract parameters from request body
        year = request.GET.get('year')
        month = request.GET.get('month')
        
        # Validate parameters
        if not year or not month:
            return Response(
                {"error": "Missing required parameters: year or month"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            year_int = int(year)
            month_int = int(month)
            
            if month_int < 1 or month_int > 12:
                return Response(
                    {"error": "Invalid month. Must be between 1 and 12"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Create date for current month filtering
            current_month_start = datetime(year_int, month_int, 1)
            _, last_day = calendar.monthrange(year_int, month_int)
            current_month_end = datetime(year_int, month_int, last_day)
            
        except ValueError:
            return Response(
                {"error": "Invalid year or month format. Year must be a valid year and month must be between 1-12."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get all unique divisions for the current month with 'abs' series
        abs_data = IPIRecord.objects.filter(
            series='abs',
            date__gte=current_month_start,
            date__lte=current_month_end
        )
        
        if not abs_data.exists():
            return Response(
                {"error": f"No data found for {year_int}-{month_int} with 'abs' series"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get growth_yoy data for the same period
        yoy_data = IPIRecord.objects.filter(
            series='growth_yoy',
            date__gte=current_month_start,
            date__lte=current_month_end
        )
        
        # Get growth_mom data for the same period
        mom_data = IPIRecord.objects.filter(
            series='growth_mom',
            date__gte=current_month_start,
            date__lte=current_month_end
        )
        
        # Create dictionaries for faster lookup
        yoy_dict = {item.division: item.index for item in yoy_data}
        mom_dict = {item.division: item.index for item in mom_data}
        
        # Prepare result
        result = []
        
        for item in abs_data:
            division = item.division
            abs_value = item.index
            
            # 直接使用growth_yoy和growth_mom的值作为增长率
            yoy_change = yoy_dict.get(division, None)
            mom_change = mom_dict.get(division, None)
            
            # Add to result
            result.append({
                "division": division,
                "desc_en": item.desc_en,
                "abs": abs_value,
                "yoy_change": yoy_change,
                "mom_change": mom_change
            })
        
        # Sort result by division
        result.sort(key=lambda x: x["division"])
        
        return Response(result, status=status.HTTP_200_OK)


class DieselImpactChartAPI(APIView):
    """
    API View to retrieve data for diesel impact chart from March 2024 to March 2025
    
    Returns:
    {
        "labels": ["2024-03", "2024-04", ...],
        "diesel_prices": [2.15, 2.18, ...],
        "manufacturing_growth": [4.0, 4.05, ...]
    }
    """
    
    def get(self, request):
        # 1. Define the date range
        start_date = datetime(2024, 3, 1)
        end_date = datetime(2025, 2, 28)
        
        # Generate month labels list (format: YYYY-MM)
        current_date = start_date
        labels = []
        while current_date <= end_date:
            labels.append(current_date.strftime("%Y-%m"))
            # Move to the first day of the next month
            if current_date.month == 12:
                current_date = datetime(current_date.year + 1, 1, 1)
            else:
                current_date = datetime(current_date.year, current_date.month + 1, 1)
        
        # 2. Query diesel price data and calculate monthly averages
        diesel_prices_query = FuelPrice.objects.filter(
            date__gte=start_date,
            date__lte=end_date
        ).annotate(
            month=TruncMonth('date')
        ).values('month').annotate(
            avg_price=Avg('diesel')
        ).order_by('month')
        
        # Convert query results to a dictionary for easier lookup by month
        diesel_prices_dict = {item['month'].strftime("%Y-%m"): float(item['avg_price']) for item in diesel_prices_query}
        
        # Generate diesel price list based on labels, fill with None for months without data
        diesel_prices = [diesel_prices_dict.get(label) for label in labels]
        
        # 3. Query IPI1DRecord data
        manufacturing_data = IPI1DRecord.objects.filter(
            series='growth_mom',
            date__gte=start_date,
            date__lte=end_date
        ).annotate(
            month=TruncMonth('date')
        ).values('month').annotate(
            avg_index=Avg('index')
        ).order_by('month')
        
        # Convert query results to a dictionary
        manufacturing_dict = {item['month'].strftime("%Y-%m"): float(item['avg_index']) for item in manufacturing_data}
        
        # Generate manufacturing growth list based on labels, fill with None for months without data
        manufacturing_growth = [manufacturing_dict.get(label) for label in labels]
        
        # Return the results
        return Response({
            "labels": labels,
            "diesel_prices": diesel_prices,
            "manufacturing_growth": manufacturing_growth
        }, status=status.HTTP_200_OK)

