#!/bin/bash
cd ..
echo "Servidor iniciando en http://localhost:8080"
echo "Abre en tu navegador: http://localhost:8080/test-package/index.html"
echo ""
npx http-server . -p 8080 --cors

