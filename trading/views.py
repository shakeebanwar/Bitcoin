from django.shortcuts import render, HttpResponse, redirect
from trading .models import User_Signup
from django.contrib.auth import authenticate, login, logout

# Create your views here.

def home(request):

    return render(request,'index.html')

def home1(request):

    return render(request,'home.html')



def signup(request):
       if request.method == 'POST':

           username = request.POST['username']
           email = request.POST['email']
           pass1 = request.POST['password']
           checkuser_name = User_Signup.objects.filter(name=username)
           checkuser_email = User_Signup.objects.filter(email=email)
           if checkuser_name:
               return HttpResponse('Username Already Exist')
           if checkuser_email:
                return HttpResponse('Email ALReady Exist')

         
           user_data = User_Signup(name=username,email=email,password = pass1)
           user_data.save()
           thank = True
           return render(request, 'index.html',{'thank':thank})
       else:
            return HttpResponse('404 error')
         
def login(request):
      if request.method == 'POST':
            username = request.POST['loginusername']
            pass1 = request.POST['loginpass']

            data = User_Signup.objects.filter(name=username,password=pass1)
            if data:
                return redirect('/home') 
            else:
                return redirect('/')    

       
    
      else:
          return HttpResponse('404 - Not Found')

   

