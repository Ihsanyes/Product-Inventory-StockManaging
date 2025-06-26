from rest_framework import serializers
from .models import Products,Variant, SubVariant, StockTransaction

class VariantOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariant
        fields = ['value']

class ProductVariantSerializer(serializers.ModelSerializer):
    options = VariantOptionSerializer(many=True)

    class Meta:
        model = Variant
        fields = [ 'name', 'options']

class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, required=False)

    class Meta:
        model = Products
        fields = '__all__'

class StockTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockTransaction
        fields = '__all__'
