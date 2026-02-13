let isAdmin = false; 

window.onload = ucitajProizvode;

function prikaziLogin() { document.getElementById('login-modal').style.display = 'block'; }
function zatvoriLogin() { document.getElementById('login-modal').style.display = 'none'; }

async function prijaviSe() {
    const korisnicko_ime = document.getElementById('login-user').value;
    const lozinka = document.getElementById('login-pass').value;

    const odgovor = await fetch('http://localhost:5000/api/korisnici/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ korisnicko_ime, lozinka })
    });

    if (odgovor.ok) {
        isAdmin = true;
        zatvoriLogin();
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('login-nav-btn').style.display = 'none';
        ucitajProizvode(); 
    } else {
        document.getElementById('login-poruka').innerText = "Pogrešni podaci!";
    }
}

async function ucitajProizvode() {
    const odgovor = await fetch('http://localhost:5000/api/proizvodi');
    const proizvodi = await odgovor.json();
    
    const lista = document.getElementById('lista-proizvoda');
    lista.innerHTML = '';

    proizvodi.forEach(p => {
        // DODANO: Ako je admin, prikazujemo i brisanje i izmjenu
        let adminKontrole = '';
        if (isAdmin) {
            adminKontrole = `
                <div class="admin-btns">
                    <button class="edit-btn" onclick="izmijeniCijenu(${p.id})">Izmijeni cijenu</button>
                    <button class="delete-btn" onclick="obrisiProizvod(${p.id})">Obriši</button>
                </div>
            `;
        }
        
        lista.innerHTML += `
            <div class="card">
                <h3>${p.naziv}</h3>
                <p>${p.opis}</p>
                <div class="price">${p.cijena} KM</div>
                ${adminKontrole}
            </div>
        `;
    });
}

async function dodajProizvod() {
    const naziv = document.getElementById('naziv').value;
    const cijena = document.getElementById('cijena').value;
    const opis = document.getElementById('opis').value;

    await fetch('http://localhost:5000/api/proizvodi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ naziv, cijena, opis })
    });

    ucitajProizvode();
}

async function obrisiProizvod(id) {
    if(confirm("Sigurno obrisati?")) {
        await fetch(`http://localhost:5000/api/proizvodi/${id}`, { method: 'DELETE' });
        ucitajProizvode();
    }
}

// OVO JE TVOJA KONKRETNA UPDATE FUNKCIJA
async function izmijeniCijenu(id) {
    const novaCijena = prompt("Unesite novu cijenu:");
    if (novaCijena && !isNaN(novaCijena)) {
        await fetch(`http://localhost:5000/api/proizvodi/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ novaCijena: parseFloat(novaCijena) })
        });
        ucitajProizvode(); // Bolje nego reload jer je brže
    } else if (novaCijena) {
        alert("Molimo unesite ispravan broj!");
    }
}

function logout() {
    isAdmin = false;
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('login-nav-btn').style.display = 'block';
    ucitajProizvode();
}