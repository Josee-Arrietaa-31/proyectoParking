# Plan Operativo del Proyecto

## Proyecto

Plataforma Integrada de Gestion de Parqueos

## Estado actual

Fecha de referencia: 27 de abril de 2026

Segun el documento del curso, el proyecto ya completo:

- Sprint 1: bases formales del proyecto
- Sprint 2: diseno, arquitectura, wireframes, historias de usuario y backlog

Sprint actual:

- Sprint 3: prototipo funcional de modulos core

## Objetivo general

Desarrollar una plataforma web que permita a municipalidades, operadores de parqueos privados y conductores consultar, gestionar y utilizar espacios de parqueo con informacion de disponibilidad y pago digital.

## MVP recomendado

Para asegurar una entrega fuerte dentro del plazo del curso, el MVP debe demostrar este flujo:

1. Un usuario conductor inicia sesion.
2. El conductor consulta parqueos cercanos en un mapa.
3. El sistema muestra disponibilidad y tarifa.
4. El conductor selecciona un parqueo.
5. El conductor registra un pago.
6. La municipalidad visualiza la ocupacion o ingreso en su panel.

## Modulos del sistema

### 1. Autenticacion y roles

- Registro e inicio de sesion
- Roles: municipalidad, operador, conductor
- Restriccion de acceso por rol

### 2. Gestion de parqueos

- Registro de parqueos
- Edicion de informacion basica
- Tarifas
- Estado de disponibilidad

### 3. Consulta para conductores

- Mapa interactivo
- Lista de parqueos cercanos
- Visualizacion de disponibilidad
- Visualizacion de tarifa

### 4. Pagos

- Registro de pago
- Confirmacion de transaccion
- Historial basico

### 5. Panel municipal

- Visualizacion de ocupacion
- Visualizacion de ingresos
- Resumen de espacios publicos

## Plan por sprint

## Sprint 3

Fechas: 26 de abril al 3 de mayo de 2026

Objetivo:

Construir un prototipo navegable con los modulos core conectados entre si.

Entregables:

- Login y registro funcional
- Roles implementados
- CRUD basico de parqueos
- Vista de conductor con mapa
- Datos simulados de disponibilidad
- Integracion frontend-backend inicial

## Sprint 4

Fechas: 4 al 11 de mayo de 2026

Objetivo:

Completar integracion de negocio con pagos y panel municipal.

Entregables:

- Pago basico funcional
- Panel municipal con metricas simples
- Integracion de modulos
- Informe de avance #2

## Sprint 5

Fechas: 12 al 15 de mayo de 2026

Objetivo:

Cerrar el proyecto con calidad suficiente para demo y entrega final.

Entregables:

- Pruebas finales
- Correccion de bugs
- Documentacion tecnica y de usuario
- Video o material de presentacion
- Demo final

## Priorizacion

### Prioridad alta

- Autenticacion
- Mapa con parqueos
- Disponibilidad visible
- Flujo de pago
- Panel municipal minimo

### Prioridad media

- Historiales
- Mejoras visuales
- Filtros adicionales

### Prioridad baja

- Notificaciones
- Reportes avanzados
- Integraciones no esenciales

## Riesgos operativos inmediatos

### Riesgo 1: exceso de alcance

Mitigacion:

- Congelar funcionalidades no esenciales al final de Sprint 3

### Riesgo 2: bloqueo tecnico con mapas o pagos

Mitigacion:

- Usar datos simulados y entornos sandbox

### Riesgo 3: integracion tardia

Mitigacion:

- Integrar frontend y backend desde el inicio del sprint

## Criterios de exito del prototipo

- Los tres roles pueden iniciar sesion
- Un operador puede registrar un parqueo
- Un conductor puede visualizar parqueos y disponibilidad
- Un conductor puede registrar un pago
- La municipalidad puede ver informacion resumida

## Proximo paso recomendado

Antes de empezar desarrollo tecnico, el equipo debe confirmar:

1. Stack definitivo
2. Modelo de datos base
3. Historias del Sprint 3
4. Responsables por modulo
5. Alcance congelado del MVP
