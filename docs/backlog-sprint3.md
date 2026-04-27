# Backlog de Sprint 3

## Objetivo del sprint

Entregar un prototipo funcional de los modulos core:

- usuarios
- parqueos
- consulta con mapa

## Historias de usuario prioritarias

### HU-01 Registro de usuarios

Como usuario del sistema, quiero registrarme segun mi tipo de perfil, para acceder a las funcionalidades correspondientes.

Criterios de aceptacion:

- Permite registro de conductor
- Permite registro de operador
- Permite registro de municipalidad
- Guarda rol en base de datos

### HU-02 Inicio de sesion

Como usuario registrado, quiero iniciar sesion, para acceder a la plataforma.

Criterios de aceptacion:

- Valida credenciales
- Redirige segun rol
- Muestra error si los datos son invalidos

### HU-03 Registro de parqueos

Como operador, quiero registrar un parqueo con ubicacion, capacidad y tarifa, para publicarlo en la plataforma.

Criterios de aceptacion:

- Permite crear parqueo
- Permite editar informacion basica
- Permite definir tarifa
- Guarda ubicacion

### HU-04 Actualizacion de disponibilidad

Como operador, quiero actualizar la disponibilidad de espacios, para mantener informacion actualizada para los conductores.

Criterios de aceptacion:

- Permite cambiar cantidad disponible
- Refleja el cambio en la vista del conductor

### HU-05 Consulta en mapa

Como conductor, quiero visualizar parqueos cercanos en un mapa, para elegir una opcion disponible.

Criterios de aceptacion:

- Muestra mapa interactivo
- Muestra marcadores de parqueos
- Muestra disponibilidad y tarifa

### HU-06 Vista municipal basica

Como municipalidad, quiero ver un resumen simple de ocupacion o ingresos, para monitorear la actividad del sistema.

Criterios de aceptacion:

- Muestra total de parqueos
- Muestra espacios ocupados o disponibles
- Muestra ingresos simulados o acumulados

## Tareas tecnicas sugeridas

## Backend

- Definir entidades: usuario, parqueo, pago
- Crear base de datos inicial
- Implementar registro e inicio de sesion
- Implementar CRUD de parqueos
- Implementar endpoint de disponibilidad

## Frontend

- Crear flujo de login y registro
- Crear dashboard por rol
- Crear formulario de parqueo
- Crear vista de mapa
- Mostrar disponibilidad y tarifa

## Integracion

- Conectar formularios con API
- Cargar datos simulados de parqueos
- Probar redireccion por rol
- Validar flujo completo operador -> conductor

## Tareas de gestion

- Actualizar Jira con historias y tareas
- Definir responsables
- Registrar avances diarios
- Preparar demo interna del sprint

## Distribucion sugerida

### Maria Belen

- Seguimiento del sprint
- Actualizacion de Jira
- Evidencias
- Pruebas funcionales

### Jose Andres

- Backend
- Base de datos
- Autenticacion
- Integracion tecnica

### Maria Laura

- Frontend
- Formularios
- Pantalla de mapa
- Ajustes de interfaz

## Definicion de terminado

Una historia se considera terminada cuando:

- La funcionalidad cumple criterios de aceptacion
- Esta integrada con el resto del sistema
- Fue probada por al menos otra persona del equipo
- Queda registrada en Jira como completada

## Checklist de cierre del sprint

- Flujo de login funcionando
- Parqueos creados desde interfaz
- Mapa mostrando parqueos
- Disponibilidad visible
- Demo interna completada
- Lista de bugs registrada
