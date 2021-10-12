from django.db import models
from django.db.models.fields.related import ForeignKey
from django.utils import timezone

class Product(models.Model):

    title = models.CharField(max_length=100)
    desc = models.TextField(max_length = 500)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    colour = models.CharField(max_length=30)
    category = models.CharField(max_length=30, default='other')
    dateOfUpload = models.DateField(default=timezone.now)
    images = models.ImageField(upload_to='images/')
    tags = models.CharField(max_length=500)
    sex = models.CharField(max_length=6, choices = (('women', 'WOMEN'), ('men', 'MEN')), default='women')

    def __str__(self):
        return self.title

class ProductImage(models.Model):
    product = models.ForeignKey(Product, default=None, on_delete=models.CASCADE)
    images = models.ImageField(upload_to = 'clothing_shop/images/')
 
    def __str__(self):
        return self.product.title
