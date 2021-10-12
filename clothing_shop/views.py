from django.shortcuts import render
from django.shortcuts import render

from .models import Product, ProductImage


def home_page_view(request):
    allProducts = Product.objects.all()
    womenProducts = dict()
    menProducts = dict()
    for index, product in enumerate(allProducts):
        if product.sex == 'women':
            productsImgs = ProductImage.objects.filter(product=product)
            womenProducts[index] = {'product': product, 'productImgs': productsImgs}
        if product.sex == 'men':
            productsImgs = ProductImage.objects.filter(product=product)
            menProducts[index] = {'product': product, 'productImgs': productsImgs}

    return render(request, 'clothing_shop/home_page.html', {'womenProducts': womenProducts, 'menProducts': menProducts})
