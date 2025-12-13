# SWAPI - Aplicación de Trueque Vecinal

## Información del Proyecto

**Institución:** Universidad UNIACC  
**Asignatura:** Taller de Dispositivos Móviles  
**Profesor:** José Luis Pino Cofré  
**Estudiante:** Joana Solis Chehade  
**Año Académico:** 2025

## Descripción

Swapi es una aplicación móvil desarrollada con el objetivo de facilitar el intercambio de productos y servicios entre miembros de una misma comunidad, promoviendo la economía circular y la cooperación vecinal. La plataforma permite a los usuarios publicar ofertas, buscar intercambios y comunicarse directamente mediante un sistema de mensajería integrado.

## Objetivos del Proyecto

- Promover la reutilización de recursos mediante el trueque local
- Fortalecer vínculos comunitarios entre vecinos
- Facilitar el acceso a productos y servicios sin transacciones monetarias
- Proporcionar una interfaz intuitiva y accesible para usuarios de diferentes niveles tecnológicos
- Fomentar prácticas de consumo responsable y economía circular

## Características Principales

### Autenticación de Usuarios
- Sistema de registro con validación de datos
- Inicio de sesión seguro
- Gestión de perfiles de usuario
- Integración con Google Sign-In (preparado para implementación futura)

### Gestión de Publicaciones
- Creación de publicaciones de productos y servicios
- Categorización por tipo (Producto/Servicio)
- Sistema de categorías predefinidas
- Visualización de publicaciones con información detallada
- Geolocalización de ofertas

### Búsqueda y Filtrado
- Búsqueda por tipo (Producto o Servicio)
- Filtrado por categorías específicas
- Visualización de resultados con información relevante

### Sistema de Mensajería
- Chat privado entre usuarios
- Historial de conversaciones
- Mensajes en tiempo real
- Interfaz intuitiva tipo WhatsApp

### Navegación
- Dashboard principal con acceso rápido a todas las funciones
- Sistema de navegación por pestañas (Tabs)
- Diseño responsivo para diferentes dispositivos

## Tecnologías Utilizadas

### Framework y Lenguajes
- **Ionic Framework 8:** Framework para desarrollo de aplicaciones móviles híbridas
- **Angular 18:** Framework de desarrollo web
- **TypeScript:** Lenguaje de programación tipado
- **HTML5 y SCSS:** Estructura y estilos de la interfaz

### Componentes y Librerías
- **Ionic Components:** Componentes UI nativos
- **Ionicons:** Biblioteca de iconos
- **RxJS:** Programación reactiva
- **Angular Router:** Sistema de navegación

### Almacenamiento
- **LocalStorage:** Persistencia de datos local
- Almacenamiento de usuarios, publicaciones y mensajes
- Gestión de sesión de usuario

## Arquitectura del Proyecto

### Servicios
- **AuthService:** Gestión de autenticación y usuarios
- **StorageService:** Manejo de almacenamiento local
- **PublicationsService:** Gestión de publicaciones
- **ChatService:** Sistema de mensajería

### Guards
- **AuthGuard:** Protección de rutas autenticadas

### Modelos de Datos
- **User:** Modelo de usuario
- **Publication:** Modelo de publicación
- **ChatMessage:** Modelo de mensaje
- **Conversation:** Modelo de conversación

### Estructura de Páginas
- Login
- Registro
- Tabs (Dashboard principal)
- Dashboard de estadísticas
- Publicaciones
- Buscador
- Publicar
- Chat (lista de conversaciones)
- Chat Conversation (conversación individual)

## Instalación y Configuración

### Requisitos Previos
- Node.js (versión 18 o superior)
- npm (Node Package Manager)
- Ionic CLI
- Git

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/JoanaSolis/swapi-app.git
cd swapi-app
```

2. Instalar dependencias:
```bash
npm install
```

3. Instalar Ionicons (si es necesario):
```bash
npm install ionicons@latest
```

4. Ejecutar la aplicación en modo desarrollo:
```bash
ionic serve
```

La aplicación se abrirá automáticamente en el navegador en `http://localhost:8100`

## Credenciales de Prueba

Para acceder a la aplicación con datos de prueba precargados:

- **Correo electrónico:** joana@swapi.com
- **Contraseña:** 123456

Usuario adicional disponible:
- **Correo electrónico:** juan@swapi.com
- **Contraseña:** 123456

## Categorías Disponibles

### Productos
- Hogar: muebles, electrodomésticos, herramientas, jardín
- Ropa: zapatos, bolsos, accesorios, ropa
- Juguetes: instrumentos musicales, libros
- Tecnología: dispositivos, cables, aparatos
- Cambio productos sostenibles: semillas, compostaje, huerta urbana

### Servicios
- Servicios técnicos, reparaciones
- Hogar y limpieza
- Educación y clases
- Bienestar
- Creativos y artísticos

## Estructura del Código

```
swapi/
├── src/
│   ├── app/
│   │   ├── guards/
│   │   │   └── auth-guard.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── publication.model.ts
│   │   │   ├── chat.model.ts
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── tabs/
│   │   │   ├── dashboard/
│   │   │   ├── publicaciones/
│   │   │   ├── buscador/
│   │   │   ├── publicar/
│   │   │   ├── chat/
│   │   │   └── chat-conversation/
│   │   ├── services/
│   │   │   ├── auth.ts
│   │   │   ├── storage.ts
│   │   │   ├── publications.ts
│   │   │   └── chat.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── assets/
│   ├── theme/
│   └── index.html
├── package.json
└── README.md
```

## Funcionalidades Implementadas

### Sistema de Autenticación
- Registro de nuevos usuarios con validación
- Inicio de sesión con credenciales
- Cierre de sesión
- Persistencia de sesión
- Gestión de perfil de usuario

### Gestión de Publicaciones
- Crear nuevas publicaciones
- Ver todas las publicaciones activas
- Filtrar publicaciones por categoría
- Búsqueda por tipo (Producto/Servicio)
- Visualización detallada de publicaciones

### Sistema de Chat
- Crear conversaciones desde publicaciones
- Ver lista de conversaciones activas
- Enviar y recibir mensajes
- Indicadores de mensajes no leídos
- Marcadores de tiempo en mensajes

### Datos de Prueba
- Usuarios precargados
- Publicaciones de ejemplo
- Conversaciones y mensajes de prueba

## Diseño Visual

La aplicación implementa un diseño temático invernal con los siguientes elementos:
- Paleta de colores en tonos azules
- Decoraciones con copos de nieve
- Interfaz limpia y moderna
- Animaciones sutiles
- Diseño responsivo

## Consideraciones de Seguridad

- Validación de formularios
- Protección de rutas mediante Guards
- Almacenamiento seguro de credenciales (simulado para propósitos académicos)
- Manejo de errores y excepciones

## Limitaciones Conocidas

- Sistema de almacenamiento local (no persiste entre dispositivos)
- Contraseñas almacenadas sin encriptación real (proyecto académico)
- Sin sistema de geolocalización real implementado
- Chat sin notificaciones push
- Sin subida de imágenes reales

## Trabajo Futuro

Posibles mejoras para versiones futuras:
- Backend con base de datos real
- Autenticación con Firebase o similar
- Sistema de calificaciones y reseñas
- Geolocalización real con mapas
- Subida de imágenes para publicaciones
- Notificaciones push
- Sistema de moderación de contenido
- Verificación de perfiles

## Metodología de Desarrollo

El proyecto siguió las siguientes fases:

1. **Apresto:** Definición de objetivos y preparación del entorno
2. **Análisis:** Identificación de requisitos funcionales y no funcionales
3. **Diseño:** Creación de wireframes y arquitectura del sistema
4. **Implementación:** Desarrollo técnico de componentes
5. **Evaluación:** Pruebas de usabilidad y rendimiento

## Referencias Académicas

- Ionic Framework Documentation. (2025). https://ionicframework.com/docs
- Angular Documentation. (2025). https://angular.io/docs
- Modelo de desarrollo de aplicaciones móviles basadas en videojuegos para la navegación de personas ciegas. TISE 2009.
- Material visto en clase - Taller de Dispositivos Móviles, UNIACC 2025

## Licencia

Este proyecto es un trabajo académico desarrollado para la Universidad UNIACC.  
Todos los derechos reservados - 2025

## Contacto

**Estudiante:** Joana Solis Chehade  
**Institución:** Universidad UNIACC  
**Asignatura:** Taller de Dispositivos Móviles  
**Año:** 2025

---

**Nota:** Este proyecto fue desarrollado con fines académicos como parte del curso Taller de Dispositivos Móviles en UNIACC.
