# StreamManager

StreamManager es una aplicación web diseñada para gestionar cuentas de servicios de streaming que son compartidas o revendidas.
El sistema permite administrar clientes, cuentas, perfiles y pagos desde una sola plataforma.

Este proyecto nace con el objetivo de reemplazar métodos manuales como cuadernos o hojas de cálculo y facilitar la administración de servicios de streaming.

---

## 🚀 Tecnologías utilizadas

Frontend

* React
* Vite
* TailwindCSS
* shadcn/ui

Backend (MVP)

* Supabase

Deployment

* Vercel

Futuro backend (si el proyecto escala)

* Django
* Django REST Framework

---

## 🎯 Objetivo del proyecto

Permitir la gestión eficiente de cuentas de streaming, permitiendo:

* Registrar clientes
* Gestionar cuentas de plataformas
* Asignar perfiles a clientes
* Registrar pagos
* Controlar vencimientos
* Visualizar métricas básicas del negocio

---

## 🧩 Módulos del sistema (MVP)

El sistema está compuesto por los siguientes módulos principales:

### Clientes

Gestión de los usuarios que compran acceso a los servicios.

### Plataformas

Administración de servicios de streaming como:

* Netflix
* Disney+
* Amazon Prime
* Spotify

### Cuentas

Registro de cuentas de streaming utilizadas para vender perfiles.

### Perfiles

Cada cuenta puede tener múltiples perfiles que se asignan a clientes.

### Pagos

Registro de pagos realizados por los clientes.

### Dashboard

Panel principal con métricas del sistema.

---

## 📊 Funcionalidades principales

* Gestión de clientes
* Administración de cuentas de streaming
* Asignación de perfiles
* Control de disponibilidad de perfiles
* Registro de pagos
* Alertas de vencimiento
* Dashboard con métricas básicas

---

## 🏗 Arquitectura del proyecto

Frontend

React + Vite
TailwindCSS + shadcn/ui

Backend

Supabase (PostgreSQL + API)

Deploy

Vercel

---

## 📁 Estructura del proyecto

src
components
pages
services
hooks
utils

public

index.html
vite.config.js
tailwind.config.js

---

## 📈 Futuro del proyecto

El proyecto podría evolucionar hacia:

* Sistema SaaS para revendedores de cuentas
* Sistema de notificaciones automáticas
* Integración con WhatsApp
* Control avanzado de suscripciones
* Backend propio con Django

---

## 👨‍💻 Autor

Desarrollado como herramienta de gestión para la administración de cuentas de streaming.

---

## 📄 Licencia

Este proyecto se encuentra en desarrollo y actualmente es de uso privado.
