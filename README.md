# Email-Sender-API

Microservicio para envío de correos a través de cualquier servidor SMTP autorizado.

## Concepto

El objetivo de esta API es que a través de una petición POST y con los permisos adecuados, se pueda realizar envíos de correo desde un servidor SMTP con las credenciales autorizadas.

## Requisitos

- Esta API utiliza el sistema de autenticación de [luisjdev0/auth-api-service](https://github.com/luisjdev0/auth-api-service.git) aunque puede ser modificada directamente en el código fuente.

## Despliegue

Para compilar el proyecto, ejecutar el comando ``` npm run build ```, se creará un directorio llamado  ``` dist/ ``` el cual contendrá toda la implementación (excepto el archivo de variables de entorno, el cuál deberá se agregado manualmente).

## Headers

El endpoint disponible solo podrá ser utilizado si el token JWT es valido y contiene el ```API_ID``` definido en las variables de entorno, el token será validado con la firma definida en la variable ```JWT_SECRET_KEY```

```http
Authorization: Bearer <AUTH_SECRET_TOKEN>
```

## Realizar envío de Email

Para realizar el envío de un email desde la API, se deberá realizar una petición post a ```/```, el cuerpo de la petición cuenta con dos partes, "config" y "data"; "config" es opcional y si no se especifica, se tomará de las variables de entorno.

A continuación, ejemplo de la petición:

```http
POST /

{
    "config" : {
        "host" : "smtp.domain.com",
        "port" : 465,
        "secure" : true,
        "auth" : {
            "user" : "sender@domain.com",
            "pass" : "your_password"
        }
    },
    "data" : {
        "from": "sender@domain.com",
        "to" : "recipe@domain.com",
        "subject" : "Your subject",
        "text" : "Email body without HTML",
        "html" : "Email body with HTML to supported clients"
    }
}
```

En caso de error se retornará la siguiente respuesta:

```json
{
    "status": 401,
    "message": "Your error message here"
}
```