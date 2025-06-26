from django.contrib import admin
from .models import Products,Variant,StockTransaction,SubVariant

# Register your models here.

admin.site.register(Products)
admin.site.register(Variant)
admin.site.register(StockTransaction)
admin.site.register(SubVariant)