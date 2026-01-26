# JWT Lab (Vulnerable) — Solo laboratorio

## Objetivo del taller
1) Login como `alice/password123`
2) Copiar el JWT desde `/debug/token` o desde la cookie `auth`
3) Decodificar el JWT (jwt.io / CyberChef)
4) Crackear el secret (HS256) con hashcat + wordlist
5) Cambiar el payload (`role: admin`), re-firmar y acceder a `/admin`

## Ejecutar
```bash
npm install
npm start
```

Abrir: http://localhost:3000

## Nota ética/legal
Usar solo en entornos controlados y con permiso.
