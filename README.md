<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el respositorio
2. Ejecutar

```
yarn install
```

3. Tener Nest CLI instalado

```
npm i -g @nestjs/cli
```

4. Levantar la base de datos

```
docker-compose up -d
```

5. Clonar el archivo **.env.template** y renombrar la copia a **.env**

6. LLenar las variables de entorno definidas en el `.env`

7. Ejecutar la aplicación en dev:

```
yarn start:dev
```

8. Reconstruir la base de datos con valores semilla

```
  http://localhost:3000/api/v2/seed
```

# Production Build

1. Crear el archivo `.env.prod`
2. Llenar variables de entorno prod
3. Crear la imagen de docker

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

6. Nota: Si desea levantar posteriormente la imagen ya creada, solo debe correr:

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```

## Stack usado

- MongoDB
- Nest
