from django.db import models

# Create your models here.
class User_Signup(models.Model):
    sno = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=50)
   

    def __str__(self):
        return self.name
    