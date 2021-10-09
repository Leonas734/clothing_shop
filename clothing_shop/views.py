from django.shortcuts import render
from django.shortcuts import render

from .models import Product, ProductImage


def home_page_view(request):
    product = Product.objects.get()
    print(product.desc)
    productsImgs = ProductImage.objects.filter(product=product)
    return render(request, 'clothing_shop/home_page.html', {
        'product': product,
        'productImgs': productsImgs
    })
