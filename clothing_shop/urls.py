from django.contrib import admin
from django.urls import path
from .views import home_page_view, get_product

urlpatterns = [
    path('', home_page_view, name='home_page'),
    path('get_product/<int:productId>', get_product, name="get_product")
]
