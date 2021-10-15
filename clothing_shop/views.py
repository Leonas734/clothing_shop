from django.shortcuts import render
from django.shortcuts import render

from .models import Product, ProductImage
from django.http import JsonResponse


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

def get_product(request, productId):
    product = Product.objects.get(pk=productId)
    productImgsObj = ProductImage.objects.filter(product=product)
    
    productImages = []
    # Get image urls
    for imageObj in productImgsObj:
        productImages.append(str(imageObj.images))

    data = {
        'product': {'title': product.title, 'price': product.price, 'id': productId},
        'images': productImages
    }
    return JsonResponse(data)