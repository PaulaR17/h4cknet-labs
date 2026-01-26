#!/usr/bin/env bash
set -e
command -v node >/dev/null 2>&1 || { echo "Node.js no está instalado"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm no está instalado"; exit 1; }

npm install
npm start
