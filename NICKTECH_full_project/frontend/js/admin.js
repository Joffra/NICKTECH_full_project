const adminApi = 'http://localhost:8080/api';
const adminMessage = document.getElementById('adminMessage');
const usersList = document.getElementById('usersList');

const adminArea = document.getElementById('adminArea');

if(adminArea && localStorage.getItem('userRole') === 'ADMIN') {
  adminArea.hidden = false;
  loadUsers();
}

async function loadUsers() {
  try {
    const response = await fetch(adminApi + '/admin/users', {
      headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
    });
    const body = await response.json();
    if(!response.ok) throw new Error(body.message || 'Accès refusé.');

    adminMessage.textContent = body.length + ' utilisateur(s) enregistré(s).';
    usersList.replaceChildren(...body.map(createUserCard));
  } catch(error) {
    adminMessage.textContent = error.message === 'Failed to fetch'
      ? 'API Java non disponible.'
      : error.message;
  }
}

function createUserCard(user) {
  const card = document.createElement('article');
  const title = document.createElement('h2');
  title.textContent = user.name;
  const email = document.createElement('p');
  email.textContent = user.email;
  const role = document.createElement('select');
  role.innerHTML = '<option value="USER">Utilisateur</option><option value="ADMIN">Administrateur</option>';
  role.value = user.role;
  role.addEventListener('change', () => updateRole(user.id, role.value));
  card.append(title, email, role);
  return card;
}

async function updateRole(userId, role) {
  try {
    const response = await fetch(adminApi + '/admin/users/' + userId + '/role', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({role})
    });
    const body = await response.json();
    if(!response.ok) throw new Error(body.message || 'Modification impossible.');
    adminMessage.textContent = body.message;
  } catch(error) {
    adminMessage.textContent = error.message === 'Failed to fetch'
      ? 'API Java non disponible.'
      : error.message;
    loadUsers();
  }
}
