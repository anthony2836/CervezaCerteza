// Mini helpers para no escribir querySelector todo el rato
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

// Elementos principales que voy a usar mucho
const ageGate = $("#ageGate");
const acceptAge = $("#acceptAge");
const rejectAge = $("#rejectAge");
const ageMessage = $("#ageMessage");
const mobilePanel = $("#mobilePanel");
const menuToggle = $("#menuToggle");
const backTop = $("#backTop");
const toast = $("#toast");

// Estado del pack que el usuario está armando
// Cada cerveza tiene cantidad, precio y nombre
const packState = {
    original: { qty: 2, price: 3.9, label: "Original IPA" },
    session: { qty: 2, price: 3.6, label: "Session Haze" },
    zero: { qty: 2, price: 3.4, label: "Zero Loud" }
};

// Formateador de moneda en euros porque estamos en España
const money = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
});

// Notificación pequeña que aparece y desaparece
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

// Leer del localStorage, pero sin romper si no está disponible
function storageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

// Guardar en localStorage, tranquilo si falla
function storageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        return false;
    }
    return true;
}

// Cuando el usuario confirma que es mayor de 18
function unlockSite() {
    storageSet("certezaAgeOk", "true");
    ageGate.classList.add("is-hidden");
    document.body.classList.remove("no-scroll");
    // Esperar a que termine la animación antes de esconder
    window.setTimeout(() => {
        ageGate.style.display = "none";
    }, 430);
}

// Actualizar el resumen del pack (cantidad total y precio)
function updatePack() {
    let units = 0;
    let total = 0;

    // Recorrer todas las cervezas y sumar
    Object.entries(packState).forEach(([key, item]) => {
        units += item.qty;
        total += item.qty * item.price;
        $(`[data-value="${key}"]`).textContent = item.qty;
    });

    // Mostrar el resumen, con singular/plural correcto
    $("#packUnits").textContent = `${units} ${units === 1 ? "lata" : "latas"}`;
    $("#packTotal").textContent = money.format(total);
}

// Añadir o restar cervezas del pack, con límite de 12 latas
function addToPack(key, amount = 1) {
    const currentUnits = Object.values(packState).reduce((sum, item) => sum + item.qty, 0);
    if (amount > 0 && currentUnits >= 12) {
        showToast("El pack máximo es de 12 latas.");
        return;
    }
    packState[key].qty = Math.max(0, packState[key].qty + amount);
    updatePack();
}

// Animar números contadores (6.2%, 45 IBU, etc) cuando se ven en pantalla
function animateCounters() {
    $$("[data-count]").forEach((counter) => {
        // No animar dos veces el mismo número
        if (counter.dataset.done) return;
        const target = Number(counter.dataset.count);
        const decimals = String(counter.dataset.count).includes(".") ? 1 : 0;
        const duration = 900;
        const start = performance.now();
        counter.dataset.done = "true";

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // Easing suave
            counter.textContent = (target * eased).toFixed(decimals);
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    });
}

// Si el usuario ya pasó la edad gate, no mostrar de nuevo
if (storageGet("certezaAgeOk") === "true") {
    ageGate.style.display = "none";
    document.body.classList.remove("no-scroll");
}

// Botones del age gate
acceptAge.addEventListener("click", unlockSite);
rejectAge.addEventListener("click", () => {
    ageMessage.style.display = "block";
});

// Menú mobile - abrir/cerrar con el botón hamburguesa
menuToggle.addEventListener("click", () => {
    const isOpen = mobilePanel.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

// Cerrar el menú cuando haces clic en un link
$$("#mobilePanel a").forEach((link) => {
    link.addEventListener("click", () => {
        mobilePanel.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
    });
});

// Botones "Añadir al pack" en las tarjetas de productos
$$(".add-pack").forEach((button) => {
    button.addEventListener("click", () => {
        addToPack(button.dataset.pack);
        showToast(`${packState[button.dataset.pack].label} añadida al pack.`);
    });
});

// Botones + y - para cambiar cantidad en el pack builder
$$("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
        const amount = button.dataset.step === "plus" ? 1 : -1;
        addToPack(button.dataset.pack, amount);
    });
});

// Botón reservar pack - llenar el formulario automáticamente
$("#reservePack").addEventListener("click", () => {
    const units = Object.values(packState).reduce((sum, item) => sum + item.qty, 0);
    if (!units) {
        showToast("Añade al menos una lata para reservar.");
        return;
    }
    const detail = Object.values(packState)
        .filter((item) => item.qty > 0)
        .map((item) => `${item.qty} ${item.label}`)
        .join(", ");
    $("#interest").value = "Compra / reserva";
    $("#message").value = `Quiero reservar un pack Certeza con: ${detail}. Total aproximado: ${$("#packTotal").textContent}.`;
    // Scroll suave hasta el formulario
    $("#contacto").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Pack preparado en el formulario.");
});

// Formulario de contacto
$("#contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    $("#formStatus").style.display = "block";
    showToast("Mensaje listo para enviar.");
    event.currentTarget.reset();
});

// Botón volver arriba
backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Observer para animar elementos cuando entran en pantalla
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        // Si tiene contadores, animar también
        if (entry.target.querySelector("[data-count]") || entry.target.matches(".hero-copy, .story-copy")) {
            animateCounters();
        }
    });
}, { threshold: 0.18 });

$$(".reveal").forEach((item) => revealObserver.observe(item));

// Marcar el link del nav que corresponde a la sección visible
const sections = $$("main section[id]");
const navItems = $$(".nav-links a");
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navItems.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-40% 0px -45% 0px" });

sections.forEach((section) => navObserver.observe(section));

// Mostrar/esconder botón "volver arriba" después de scrollear bastante
window.addEventListener("scroll", () => {
    backTop.classList.toggle("show", window.scrollY > 700);
}, { passive: true });

// Efecto 3D hover en las tarjetas (si el usuario no prefiere menos movimiento)
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $$("[data-tilt]").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`;
        });
        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });
}

// Inicializar el pack con los valores por defecto
updatePack();

// Cargar los iconos de Lucide cuando la página esté lista
window.addEventListener("load", () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
