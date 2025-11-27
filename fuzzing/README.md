# Lab 1 — Fuzzing Básico

Este laboratorio introduce el fuzzing de directorios y archivos en aplicaciones web.
Está pensado para personas que están empezando y quieren aprender a enumerar rutas ocultas.

---

## Objetivos del laboratorio

- Aprender qué es el fuzzing.
- Enumerar rutas y archivos no visibles desde la página principal.
- Identificar directorios sensibles.
- Comprender códigos HTTP relevantes para enumeración.
- Familiarizarse con herramientas básicas de fuzzing.

---

## Nivel

Muy básico / introductorio.

---

## Requisitos

- Servidor Apache o entorno equivalente.
- Herramienta de fuzzing (cualquiera de las siguientes):
  - ffuf
  - gobuster
  - dirsearch
  - dirb
- Un diccionario de palabras, por ejemplo:
  - /usr/share/wordlists/dirb/common.txt
  - /usr/share/wordlists/seclists/Discovery/Web-Content/

---

## Cómo usar este laboratorio

### 1. Copia la carpeta al servidor web

```bash
sudo cp -r fuzzing/ /var/www/html/
```

Accede en el navegador:

http://localhost/fuzzing/

Verás una página pública sin enlaces útiles.  
Este comportamiento es intencional.

---

## 2. Empieza el fuzzing

Puedes utilizar cualquiera de estas herramientas.

### ffuf

```bash
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://localhost/fuzzing/FUZZ -mc all
```

### gobuster

```bash
gobuster dir -u http://localhost/fuzzing/ -w /usr/share/wordlists/dirb/common.txt
```

### dirsearch

```bash
dirsearch -u http://localhost/fuzzing/
```

---

## ¿Qué deberías encontrar?

- Directorios de uso interno.
- Copias antiguas del sitio.
- Archivos de backup.
- Rutas pensadas para practicar enumeración.
- Contenido interesante dentro de ciertos directorios.

Importante: fuzzear también dentro de las rutas que encuentres.

---

## Número de flags

Este laboratorio contiene:

**4 flags en total**

Distribuidas en distintas ubicaciones del entorno.

---

## Uso responsable

Este laboratorio es exclusivamente educativo.  
No debe utilizarse para escanear sistemas sin permiso.
