const API='http://localhost:8080/api';
const form=document.getElementById('contactForm');
if(form)form.addEventListener('submit',async e=>{e.preventDefault();alert('Formulaire prêt à envoyer les données à l’API Java.');});