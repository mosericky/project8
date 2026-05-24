from django.db import models


class Category(models.TextChoices):
    WOMEN = 'Women', 'Women'
    MEN = 'Men', 'Men'
    KIDS = 'Kids', 'Kids'
    DESIGNER = 'Designer', 'Designer'


class Product(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    price = models.PositiveIntegerField()
    category = models.CharField(max_length=20, choices=Category.choices)
    image = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.brand} - {self.name}"


class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.product.id} by {self.name}"
