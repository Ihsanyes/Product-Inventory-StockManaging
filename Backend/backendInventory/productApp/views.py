from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Products, Variant, SubVariant, StockTransaction
from .serializers import ProductSerializer, StockTransactionSerializer,ProductVariantSerializer
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
import random
import json
from django.contrib.auth.models import User
from django.db import transaction

@api_view(['GET', 'POST'])

def product_list_create(request):
    if request.method == 'GET':
        products = Products.objects.prefetch_related('variants__options').select_related('CreatedUser')

        paginator = PageNumberPagination()
        paginator.page_size = 5
        result_page = paginator.paginate_queryset(products, request)

        serializer = ProductSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)



    if request.method == 'POST':
        try:
            ProductName = request.data.get('ProductName')
            ProductCode = request.data.get('ProductCode')
            HSNCode = request.data.get('HSNCode', '')
            TotalStock = request.data.get('TotalStock', 0)
            ProductImage = request.data.get('ProductImage')
            variants_raw = request.data.get('variants', '[]')

            if not ProductName or not ProductCode:
                return Response({'error': 'ProductName and ProductCode are required.'}, status=400)

            try:
                variants = json.loads(variants_raw)
            except json.JSONDecodeError:
                return Response({'error': 'Invalid variants format. Expecting a JSON array.'}, status=400)

            
            while True:
                next_product_id = random.randint(10000, 99999)
                if not Products.objects.filter(ProductID=next_product_id).exists():
                    break

            with transaction.atomic():
                product = Products.objects.create(
                    ProductID=next_product_id,
                    ProductCode=ProductCode,
                    ProductName=ProductName,
                    HSNCode=HSNCode,
                    TotalStock=TotalStock,
                    ProductImage=ProductImage,
                    CreatedUser=User.objects.get(id=1),  # Change this to request.user if needed
                    UpdatedDate=timezone.now()
                )

                for variant in variants:
                    variant_obj = Variant.objects.create(product=product, name=variant['name'])

                    for option in variant['options']:
                        value = option.strip()
                        if value:
                            SubVariant.objects.create(variant=variant_obj, value=value)

            return Response({'message': 'Product created successfully.'}, status=201)

        except Exception as e:
            return Response({'error': str(e)}, status=400)




@api_view(['POST'])
def add_stock(request, product_id):
    if request.method == 'POST':
        product = get_object_or_404(Products, id=product_id)
        quantity = request.data.get('quantity')
        if not quantity:
            return Response({'error': 'Quantity is required'}, status=400)
        quantity = (quantity)
        product.TotalStock += quantity
        product.save()
        StockTransaction.objects.create(product=product, quantity=quantity, transaction_type='IN')

        return Response({'status': 'Stock added'})



@api_view(['POST'])
def remove_stock(request, product_id):
    product = get_object_or_404(Products, id=product_id)
    quantity = request.data.get('quantity')
    if not quantity:
        return Response({'error': 'Quantity is required'}, status=400)
    quantity = (quantity)
    if product.TotalStock < quantity:
        return Response({'error': 'Insufficient stock'}, status=400)
    product.TotalStock -= quantity
    product.save()
    StockTransaction.objects.create(product=product, quantity=quantity, transaction_type='OUT')
    return Response({'status': 'Stock removed'})

@api_view(['GET'])
def stock_report(request, product_id):
    filtered_report = StockTransaction.objects.filter(product_id=product_id)
    print('qs', filtered_report)
    start = request.GET.get('start_date')
    end = request.GET.get('end_date')
    if start:
        start_dt = parse_datetime(start)
        if start_dt:
            filtered_report = filtered_report.filter(timestamp__gte=start_dt)


    if end:
        end_dt = parse_datetime(end)
        if end_dt:
            filtered_report = filtered_report.filter(timestamp__lte=end_dt)

    serializer = StockTransactionSerializer(filtered_report, many=True)
    return Response(serializer.data)
