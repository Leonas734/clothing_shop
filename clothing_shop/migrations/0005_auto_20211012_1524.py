# Generated by Django 3.2 on 2021-10-12 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clothing_shop', '0004_alter_product_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='sex',
            field=models.CharField(choices=[('women', 'WOMEN'), ('men', 'MEN')], default='women', max_length=6),
        ),
        migrations.AlterField(
            model_name='product',
            name='tags',
            field=models.CharField(max_length=500),
        ),
    ]
