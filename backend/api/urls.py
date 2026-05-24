from django.urls import path
from .views import ProductListView, ProductDetailView, ReviewListCreateView, ReviewByProductView

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<str:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("products/<str:product_id>/reviews/", ReviewByProductView.as_view(), name="product-reviews"),
    path("reviews/", ReviewListCreateView.as_view(), name="review-list-create"),
]
