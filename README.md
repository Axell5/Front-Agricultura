# Sistema de Agricultura de Precisión

Sistema web para la gestión y monitoreo de agricultura de precisión, desarrollado con Angular.

## Requisitos Previos

- Node.js (versión 18 o superior)
- NPM (incluido con Node.js)
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
```

2. Navegar al directorio del proyecto:
```bash
cd nombre-del-proyecto
```

3. Instalar las dependencias del frontend:
```bash
npm install
```

## Configuración del Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar las dependencias de Python:
```bash
pip install -r requirements.txt
```

3. Iniciar el servidor backend:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

El servidor backend estará disponible en `http://localhost:8000`

## Ejecutar el Proyecto

Para iniciar el servidor de desarrollo del frontend:

```bash
npm run dev
```

El servidor frontend se iniciará en `http://localhost:4200`

IMPORTANTE: Para que el sistema funcione correctamente, asegúrate de tener tanto el servidor backend como el frontend ejecutándose simultáneamente.

## Credenciales de Prueba

Para acceder al sistema, puedes usar cualquier combinación de usuario y contraseña, ya que el sistema está en modo demostración.

## Características Principales

- 📊 Dashboard con métricas en tiempo real
- 🌡️ Monitoreo de sensores IoT
- 🛒 Marketplace de productos agrícolas
- 💬 Sistema de mensajería
- 🏆 Sistema de recompensas
- 🧠 Análisis con IA

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/          # Servicios core, guardias e interceptores
│   ├── features/      # Módulos de características
│   ├── layout/        # Componentes de diseño (header, footer, sidebar)
│   └── shared/        # Componentes y utilidades compartidas
├── assets/            # Recursos estáticos
└── environments/      # Configuraciones de entorno
```

## Comandos Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Compila el proyecto para producción
- `npm run dev`: Inicia el servidor de desarrollo con recarga en caliente

## Notas Importantes

- El sistema utiliza una autenticación simulada para propósitos de demostración
- Los datos de los sensores son simulados
- La API backend es simulada mediante respuestas mock