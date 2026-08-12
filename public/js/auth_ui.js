function aplicarEstadoSessao() {
    const sessionUsername = sessionStorage.getItem("USERNAME");
    const paginaAtual = window.location.pathname.split('/').pop();
    const paginasPublicas = ['perfil.html', 'dashboard_binder_view.html'];

    if (!sessionUsername) {
        if (!paginasPublicas.includes(paginaAtual)) {
            window.location.href = '../index.html';
            return;
        }

        // Esconde sidebar
        const sidebar = document.getElementById("sidebar");
        if (sidebar) sidebar.style.display = "none";

        // Substitui header por versão pública
        const header = document.getElementById("header");
        if (header) {
            header.innerHTML = `
                <div class="header-left">
                    <div class="logo logo--binderShare" style="margin-bottom: 0px;">
                        <a href="../index.html">
                            <img src="../assets/imgs/main/logo2.png">pkmnHub
                        </a>
                    </div>
                </div>
                <div class="header-right">
                    <button class="btnSecundario_header" onclick="window.location.href='../login.html'">Login</button>
                    <button class="btnPrincipal_header" onclick="window.location.href='../cadastro.html'">Cadastrar</button>
                </div>
            `;
        }
    }
}

// LÓGICA DO BOTÃO DE VOLTAR

function inicializarBtnVoltar() {
    const btn = document.getElementById('btn-voltar');
    if (btn) {
        btn.onclick = function() {
            if (document.referrer) {
                history.back();
            } else {
                window.location.href = '../index.html';
            }
        };
    }
}

// SIDEBAR PADRONIZADA

function inicializarSidebarLogica() {
    const cadastroMenu = document.getElementById('cadastroMenu');
    if (!cadastroMenu) return;

    const linkCadastro = cadastroMenu.querySelector('.nav-link');
    if (!linkCadastro) return;

    linkCadastro.addEventListener('click', function(e) {
        e.preventDefault();
        cadastroMenu.classList.toggle('open');
    });
}

function carregarSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    fetch('../components/sidebar.html')
        .then(r => r.text())
        .then(html => {
            sidebar.innerHTML = html;

            // Marca item ativo
            const paginaAtual = window.location.pathname.split('/').pop();
            document.querySelectorAll('.nav-link').forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.includes(paginaAtual)) {
                    link.closest('.nav-item')?.classList.add('active');
                }
            });

            // Atualiza link do perfil
            const username = sessionStorage.getItem('USERNAME') || '';
            const linkPerfil = document.getElementById('link-nav-perfil');
            if (linkPerfil && username) {
                linkPerfil.href = `perfil.html?u=${username}`;
            }

            // Inicializa lógica da sidebar após injetar HTML
            inicializarSidebarLogica();
        });
}

// sessão e dropbox

function inicializarHeader() {
    const username = sessionStorage.getItem('USERNAME') || '';
    const numeroImagem = sessionStorage.getItem('PROFILE_PIC') || '1';
    const header = document.getElementById('header');

    if (!header) return;

    // Username
    const usernameEl = document.getElementById('username');
    if (usernameEl) usernameEl.textContent = username;

    // Avatar + dropdown
    header.innerHTML += `
        <div class="avatar-wrapper">
            <img src="../assets/imgs/profilePics/${numeroImagem}.webp" class="user-avatar" onclick="toggleDropdown()">
            <div class="avatar-dropdown" id="avatarDropdown">
                <button onclick="logout()">Sair</button>
            </div>
        </div>`;
}

function toggleDropdown() {
    document.getElementById('avatarDropdown').classList.toggle('open');
}

function logout() {
    sessionStorage.removeItem('ID_USER');
    sessionStorage.removeItem('USERNAME');
    sessionStorage.removeItem('EMAIL_USER');
    sessionStorage.removeItem('PROFILE_PIC');
    window.location.href = '../index.html';
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.avatar-wrapper')) {
        document.getElementById('avatarDropdown')?.classList.remove('open');
    }
});

// MODAL DE IMPORTAÇÃO

function carregarModalImport(modo) {
    fetch('../components/modal_import.html')
        .then(r => r.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);

            // Define intervalos padrão por modo
            const intervalos = {
                compra: { entre: 5000, preCadastro: 2000 },
                venda:  { entre: 3000, preCadastro: 500  }
            };

            document.getElementById('ipt_intervalo').value = intervalos[modo].entre;
            document.getElementById('ipt_intervaloPreCadastro').value = intervalos[modo].preCadastro;

            // Conecta o botão executar ao modo correto
            document.getElementById('btn-executar-import').onclick = () => executarImport(modo);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    carregarSidebar();
    inicializarHeader();
    aplicarEstadoSessao();
    inicializarBtnVoltar();
});