"""
URL configuration for policylens project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from api.views import FuelPriceFilterView, CarFuelStatsView,index,diesel_policy,datasets_page, policies

urlpatterns = [
    # path('', TemplateView.as_view(template_name='datasets_page.html')),
    # path('admin/', admin.site.urls),
    path("index/", index),
    path("diesel_policy/", diesel_policy),
    path("datasets_page/", datasets_page),
    path("policies/", policies),
    path("api/fuel-prices/", FuelPriceFilterView.as_view(), name="fuel-prices"),
    path("api/car-fuel-states/", CarFuelStatsView.as_view(), name="car-fuel-states"),
]
