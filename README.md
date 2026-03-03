# 💸 SAVY - Gestor de Finanzas Personales

SAVY es una aplicación web desarrollada con React + TypeScript que permite registrar ingresos, gastos y ahorros de forma organizada, manteniendo un resumen financiero actualizado en tiempo real.

El objetivo del proyecto es fomentar una gestión financiera consciente y clara mediante una interfaz simple y funcional.

---

##  Tecnologías Utilizadas

- React
- TypeScript
- Vite
- SASS (SCSS)
- LocalStorage 
- Arquitectura basada en estado centralizado (`SavyState`)

---

## Descripción de carpetas

- **public/** → Recursos estáticos (logos e imágenes).
- **src/pages/** → Vistas principales de la aplicación (Home, Income, Expense, Saving, Movements).
- **src/utils/** → Lógica de negocio y manejo de estado global (`storage.ts`, `format.ts`).
- **src/styles/** → Configuración de estilos con SASS (variables, layout y componentes).
- **App.tsx** → Controlador principal de navegación.
- **main.tsx** → Punto de entrada de la aplicación.
- **vite.config.ts** → Configuración del entorno Vite.

---

## ⚙️ Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/nikkiyuki/Entrega2_AppHibrida_AM.git
cd Entrega2_AppHibrida_AM
``` bash
2. Instala dependencias:
```bash
npm install
```bash

3. Ejecuta el proyecto:
```bash
npm run dev      # Ejecuta entorno de desarrollo
npm run build    # Genera versión de producción
npm run preview  # Previsualiza build
```bash

4. si necesitas reinstalar el Sass(SCSS)
```bash
npm install -D sass
```bash

