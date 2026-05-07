# Tema de Shopify: El Cartero 📬

¡Este repositorio contiene el tema base convertido desde tu diseño local en HTML/CSS a Shopify Liquid!

## 🚀 Cómo conectarlo a tu tienda de Shopify

La forma más fácil y recomendada para usar este código es a través de la integración nativa de **Shopify con GitHub**:

### Paso 1: Sube esta carpeta a GitHub
1. Entra a tu cuenta en [GitHub.com](https://github.com/) y crea un nuevo repositorio llamado `elcartero-theme` (puede ser Privado).
2. Abre la terminal en tu computadora y navega hasta esta carpeta `cartero-shopify` (`cd Desktop\cartero-shopify`).
3. Ejecuta estos comandos para subir tus archivos a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Versión 1.0 - Estructura inicial Liquid"
   git branch -M main
   git remote add origin https://github.com/[TU_USUARIO]/elcartero-theme.git
   git push -u origin main
   ```

### Paso 2: Conéctalo a Shopify
1. Accede al admin de tu tienda en Shopify y ve a **Online Store** > **Themes** (Tienda Online > Temas).
2. En la sección *Theme library* (Biblioteca de temas), haz clic en el botón desplegable **Add theme** (Añadir tema) y selecciona **Connect from GitHub**.
3. Autoriza a Shopify para que acceda a tu cuenta de GitHub.
4. Selecciona el repositorio `elcartero-theme` y la rama `main`.
5. ¡Listo! El tema se importará. Ahora puedes hacer clic en "Customize" (Personalizar) para ver el diseño interactivo y empezar a añadir tus productos.

---
**💡 Qué contiene este tema hasta ahora:** 
1. **Inicio (`index.liquid`)**: Hero, Categorías destacadas y Productos más vendidos dinámicos.
2. **Producto (`product.liquid`)**: Galería de imágenes, selector de variantes, y botón "Agregar al Carrito" funcional conectado al inventario.
3. **Carrito (`cart.liquid`)**: Resumen de artículos seleccionados con conexión directa al *Checkout seguro de Shopify* (lo cual reemplaza el uso manual de Google Sheets).
4. **Header y Footer globales**: Controlables desde el personalizador de Shopify.

**Siguientes pasos recomendados una vez instalado:**
Crea tus productos en Shopify, asegúrate de activar el método de "Pago contra Entrega" (Cash on Delivery) en la configuración de Pagos de tu tienda, ¡y tu Shopify lucirá exactamente igual a tu prototipo pero con un backend robusto!
