/* ==========================================================================
   sidebar.js
   Sidebar (mobile + desktop retrátil) e avatar dropdown
   ========================================================================== */


/* ── Sidebar mobile ── */
function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("sidebar--open");
}

document.addEventListener("click", function(e) {
    let sidebar = document.getElementById("sidebar");
    let btnMobile = document.getElementById("btn-menu-mobile");
    if (sidebar && sidebar.classList.contains("sidebar--open")) {
        if (!sidebar.contains(e.target) && e.target !== btnMobile) {
            sidebar.classList.remove("sidebar--open");
        }
    }
});


/* ── Sidebar desktop retrátil ── */
function toggleSidebarDesktop() {
    let sidebar = document.getElementById("sidebar");
    let icon = document.getElementById("icon-colapsar");
    sidebar.classList.toggle("sidebar--collapsed");
    if (sidebar.classList.contains("sidebar--collapsed")) {
        icon.classList.remove("fa-chevron-left");
        icon.classList.add("fa-chevron-right");
        sessionStorage.setItem("SIDEBAR_COLLAPSED", "true");
    } else {
        icon.classList.remove("fa-chevron-right");
        icon.classList.add("fa-chevron-left");
        sessionStorage.setItem("SIDEBAR_COLLAPSED", "false");
    }
}


/* ── Restaurar estado da sidebar + montar avatar ao carregar ── */
document.addEventListener("DOMContentLoaded", function() {

    /* Sidebar: restaurar estado salvo */
    let collapsed = sessionStorage.getItem("SIDEBAR_COLLAPSED");
    if (collapsed === "true") {
        let sidebar = document.getElementById("sidebar");
        let icon = document.getElementById("icon-colapsar");
        if (sidebar) sidebar.classList.add("sidebar--collapsed");
        if (icon) {
            icon.classList.remove("fa-chevron-left");
            icon.classList.add("fa-chevron-right");
        }
    }

    /* Avatar dropdown */
    let wrapper = document.getElementById("avatar-wrapper");
    if (!wrapper) return;

    let username = sessionStorage.getItem("USERNAME");
    let avatarUrl = sessionStorage.getItem("AVATAR_URL");

    if (!username) return;

    wrapper.innerHTML = `
        <img class="user-avatar" src="${avatarUrl || '../assets/imgs/main/default_avatar.png'}" alt="avatar">
        <div class="avatar-dropdown" id="avatar-dropdown">
            <button onclick="logout()">Sair</button>
        </div>
    `;

    wrapper.addEventListener("click", function(e) {
        e.stopPropagation();
        let dropdown = document.getElementById("avatar-dropdown");
        if (dropdown) dropdown.classList.toggle("open");
    });

    document.addEventListener("click", function() {
        let dropdown = document.getElementById("avatar-dropdown");
        if (dropdown) dropdown.classList.remove("open");
    });
});


/* ── Logout ── */
function logout() {
    sessionStorage.clear();
    window.location.href = "../login.html";
}