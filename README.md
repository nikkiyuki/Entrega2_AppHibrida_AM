# SAVY - Gestor de Finanzas Personales

SAVY es una aplicación web desarrollada con Vite + React + TypeScript que permite registrar ingresos, gastos y ahorros de forma organizada, manteniendo un resumen financiero actualizado en tiempo real.

El objetivo del proyecto es fomentar a los adolescentes que desarrollen hábitos financieros responsables, aprendiendo a gestionar su dinero de una manera consciente y clara mediante una interfaz simple y funcional.

---
## wireframes
https://www.figma.com/design/8pBMDYcl5g7yKx30VFURfC/WireframeSAVY?node-id=0-1&t=fzqoci3wPFJgzdlj-1

##  Tecnologías Utilizadas

- React
- TypeScript
- Vite
- SASS (SCSS)
- LocalStorage 
- Arquitectura basada en estado centralizado (`SavyState`)

---

## Estructura del Proyecto

- **public/** → Recursos estáticos (logos e imágenes).
- **src/pages/** → Vistas principales de la aplicación (Home, Income, Expense, Saving, Movements).
- **src/utils/** → Lógica de negocio y manejo de estado global (`storage.ts`, `format.ts`).
- **src/styles/** → Configuración de estilos con SASS (variables, layout y componentes).
- **App.tsx** → Controlador principal de navegación.
- **main.tsx** → Punto de entrada de la aplicación.
- **vite.config.ts** → Configuración del entorno Vite.

---

## ⚙️ Instalación

Clonar el repositorio
```bash
git clone https://github.com/nikkiyuki/Entrega2_AppHibrida_AM.git
```

Entrar a la carpeta del proyecto
```bash
cd Entrega2_AppHibrida_AM
```

Instalar dependencias
```bash
npm install
```

Instalar SASS (si no está instalado o si se requiere reinstalar)
```bash
npm install -D sass
```

Ejecutar entorno de desarrollo
```bash
npm run dev
```
---

### Licencia
Proyecto académico desarrollado con fines educativos.
