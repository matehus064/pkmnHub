// perfil_nav.js — seta o link de Perfil na sidebar para o usuário logado
document.addEventListener("DOMContentLoaded", function () {
    const linkNavPerfil = document.getElementById('link-nav-perfil');
    const username = sessionStorage.getItem('USERNAME') || '';
    if (linkNavPerfil && username) {
        linkNavPerfil.href = `perfil.html?u=${username}`;
    }
});