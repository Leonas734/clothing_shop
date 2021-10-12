from django.shortcuts import render
from django.shortcuts import render

from .models import Product, ProductImage


def home_page_view(request):
    allProducts = Product.objects.all()
    products = dict()
    for index, product in enumerate(allProducts):
        productsImgs = ProductImage.objects.filter(product=product)
        products[index] = {'product': product, 'productImgs': productsImgs}
    return render(request, 'clothing_shop/home_page.html', {'products': products})
