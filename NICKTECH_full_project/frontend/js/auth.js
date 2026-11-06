const API='http://localhost:8080/api';

async function getErrorMessage(response, fallback){
 try{
  const body=await response.json();
  return body.message||fallback;
 }catch(err){
  return fallback;
 }
}

const registerForm=document.getElementById('registerForm');
if(registerForm){
 registerForm.addEventListener('submit',async e=>{
  e.preventDefault();
  const data={name:document.getElementById('name').value,email:document.getElementById('email').value,password:document.getElementById('password').value};
  try{
   const r=await fetch(API+'/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(!r.ok) throw new Error(await getErrorMessage(r,'Impossible de créer le compte.'));
   alert('Compte créé avec succès. Vous pouvez vous connecter.');
   location.href='login.html';
  }catch(err){alert(err.message==='Failed to fetch'?'API Java non disponible.':err.message);}
 });
}

const loginForm=document.getElementById('loginForm');
if(loginForm){
 loginForm.addEventListener('submit',async e=>{
  e.preventDefault();
    const emailInput=document.getElementById('email');
    const passwordInput=document.getElementById('password');
  try{
     const r=await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:emailInput.value,password:passwordInput.value})});
  if(!r.ok) throw new Error(await getErrorMessage(r,'Email ou mot de passe incorrect.'));
   const data=await r.json();
   localStorage.setItem('token',data.token||'');
   localStorage.setItem('userName',data.name||'');
  localStorage.setItem('userRole',data.role||'USER');
   location.href='dashboard.html';
  }catch(err){alert(err.message==='Failed to fetch'?'API Java non disponible.':err.message);}
 });
}

const logout=document.getElementById('logout');
if(logout) logout.addEventListener('click',()=>{localStorage.removeItem('token');localStorage.removeItem('userName');localStorage.removeItem('userRole');location.href='login.html';});

const welcome=document.getElementById('welcome');
if(welcome && !localStorage.getItem('token')) location.href='login.html';
if(welcome && localStorage.getItem('userName')) welcome.textContent='Bienvenue, '+localStorage.getItem('userName')+' !';
