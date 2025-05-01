# Conway's Game of Life

Este proyecto es una implementación interactiva del "Juego de la Vida" de Conway, creado con Next.js, TypeScript y Tailwind CSS.

## Origen del Proyecto

Este proyecto fue generado inicialmente utilizando [v0.dev](https://v0.dev/), una herramienta de generación de interfaces basada en IA. 

El chart de creación inicial se puede encontrar aquí: [Conway's Game of Life - v0.dev](https://v0.dev/chat/conway-s-game-of-life-dxRxdriAlPO)

## Características

- Simulación completa del Juego de la Vida de Conway
- Controles interactivos para iniciar, pausar y reiniciar la simulación
- Selector de patrones predefinidos
- Opción para configurar la velocidad de la simulación
- Interfaz responsive para dispositivos móviles y de escritorio
- Modo embebido para integrar en otros sitios web

## Estructura del Proyecto

- **app/**: Contiene las páginas principales de la aplicación Next.js
- **components/**: Componentes React para la interfaz de usuario
  - **ui/**: Componentes UI reutilizables
- **hooks/**: Hooks personalizados para gestionar el estado y la lógica
- **lib/**: Utilidades y configuraciones
  - **game-patterns.ts**: Patrones predefinidos para el juego
  - **utils.ts**: Funciones de utilidad

## Cómo ejecutar el proyecto

1. Instala las dependencias:
   ```
   pnpm install
   ```

2. Inicia el servidor de desarrollo:
   ```
   pnpm dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Versión

Este proyecto corresponde a la versión v0 del Juego de la Vida de Conway.