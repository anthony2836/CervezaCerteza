# 🍺 Certeza  - Web Site

Landing page moderna y funcional para **Certeza**, una cerveza artesanal intensa, tropical y urbana.

## 📋 Qué es esto

Un sitio web completo de una cervecería con:
- ✅ Age gate (verificación de mayoría de edad)
- ✅ Catálogo de productos  
- ✅ Pack builder interactivo (armar tu propio pack)
- ✅ Formulario de contacto
- ✅ Diseño responsive (funciona en móvil y desktop)
- ✅ Animaciones suaves
- ✅ Menú mobile

## 🛠️ Archivos

```
Certeza/
├── index.html       → Página principal
├── script.js        → Toda la lógica y interactividad
├── style.css        → Estilos y diseño
├── img/             → Imágenes de los productos
└── README.md        → Este archivo
```

## 🚀 Cómo usarlo

1. **Abre el archivo**
   - Doble-click en `index.html`
   - O haz clic derecho → "Abrir con" → Tu navegador

2. **Listo para usar**
   - No necesita instalar nada
   - No necesita servidor
   - Funciona offline

## 💻 ¿Qué puedo hacer?

- **Armar tu pack**: Elige las cervezas que quieres (máximo 12 latas)
- **Ver el precio**: Se actualiza en tiempo real
- **Reservar**: Te llena automáticamente el formulario de contacto
- **Navegar**: El menú marca dónde estás según scrolleas
- **En móvil**: Todo se adapta con menú hamburguesa

## 🎨 Cambiar cosas

### Cambiar precios
En `script.js`, busca `packState` y modifica los números:
```javascript
const packState = {
    original: { qty: 2, price: 3.9, label: "Original IPA" },  // Aquí
    session: { qty: 2, price: 3.6, label: "Session Haze" },   // Aquí
    zero: { qty: 2, price: 3.4, label: "Zero Loud" }          // Aquí
};
```

### Cambiar colores
En `style.css`, busca `:root` y modifica los colores:
```css
:root {
    --orange: #ff4d00;      /* Color principal */
    --acid: #ccff00;        /* Color secundario */
    --cyan: #00d7ff;        /* Tercer color */
}
```

### Cambiar textos
Edita directamente `index.html` - busca el texto que quieres cambiar y reemplázalo.

## 📱 Responsive

- ✅ Desktop (cualquier ancho)
- ✅ Tablet
- ✅ Mobile (teléfonos)

## 🔧 Navegadores soportados

- Chrome/Chromium
- Firefox
- Safari
- Edge

## 📝 Notas

- El formulario de contacto está preparado (ver comentarios en `script.js`)
- Usa localStorage para recordar si ya pasaste el age gate
- Los números animados usan `requestAnimationFrame`
- Las tarjetas tienen efecto 3D al pasar el mouse

## 🎯 TODOs futuros

- [ ] Conectar con un backend para enviar reservas
- [ ] Agregar sistema de pagos
- [ ] Más variedades de cerveza
- [ ] Blog o news
- [ ] Tienda online

---

 