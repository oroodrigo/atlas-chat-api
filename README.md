# Web Chat API

##  Visão Geral

Essa é uma API desenvolvida com o framework NestJS e TypeScript com o objetivo de ser o backend de um serviço de web chat.

## Instalação 

### 1.1 Requisitos

Antes de começar, certifique-se de ter pelo menos:

- Uma versão atualizada do [NodeJS](https://nodejs.org/), como 20.x e NPM
- Um banco de dados como PostgreSQL. Você pode usar o arquivo `docker-compose.yml` fornecido.

### 1.2 Configuração do projeto

Comece clonando este projeto em sua máquina.

``` sh
clone git https://github.com/oroodrigo/atlas-chat-api
```

O próximo passo será instalar todas as dependências do projeto.

```sh
cd ./atlas-chat-api
npm install
```

Depois que as dependências estiverem instaladas, você poderá configurar seu projeto criando um novo arquivo `.env` contendo as variáveis ​​de ambiente usadas para desenvolvimento. Siga o exemplo contigo em `.env.example`.

A seguir vem a configuração do Prisma: altere o DATABASE_URL de acordo com a configuração do seu próprio banco de dados.

Por último, defina um `JWT_SECRET` para assinar os tokens JWT.

### 1.3 Iniciar o projeto

Agora você está pronto para iniciar o projeto usando o comando abaixo.

```sh
# Para uso somente em ambientes de desenvolvimento, realiza uma migração Prisma
npx prisma migrate dev

#Inicie o servidor de desenvolvimento com TSNode
npm run dev
```

## Rotas 

As rotas protegidas usam token JWT como autorização e as requisições devem possuir o cabeçalho `Authorization`.

### Autenticação

`POST` `/users`

Rota para criação de usuários, as requisições devem conter um body com um objeto contendo informações do usuário.

Por exemplo: 
```javascript
{
    name: "John Doe",
    email: "johndoe@example.com",
    password: "123456",
}
```

`POST` `/sessions`

Rota para autenticar o usuário, as requisições devem conter um body com um objeto contendo informação de login do usuário.

Por exemplo: 
```javascript
{
    email: "johndoe@example.com",
    password: "123456",
}
```

## Informação do Usuario

`GET` `/users/me`

Rota de retorno de informações do usuário, essa rota é protegida e as requisições devem conter o cabeçalho `Authorization` com o access token.

`GET` `/users/rooms`

Rota de retorno de informações das salas que o usuário está conectado, essa rota é protegida e as requisições devem conter o cabeçalho `Authorization` com o access token.

## Gerenciamento das salas de chat

`POST` `/chats`

Rota para criação de novos chats, essa rota é protegida e as requisições devem conter o cabeçalho `Authorization` com o access token e um body com um objeto contendo informações do chat.

Por exemplo: 
```javascript
{
  name: "Coding"      
}
```

`GET` `/chats`

Rota para listagem de todas os chats, essa rota é protegida e as requisições devem conter o cabeçalho `Authorization` com o access token.

É possivel enviar um query param com o nome do chat, o retorno será todos os chats com o nome pesquisado.

Exemplo: `/chats?name=coding`

`GET` `/chats/:roomId`

Rota de retono de informações de um chat específico, essa rota é protegida e as requisições devem conter o cabeçalho `Authorization` com o access token.

`POST` `/chats/:roomId/join`

Rota para se conectar a um chat, essa rota é protegida e as requisições devem conter o cabeçalho `Authorization` com o access token.

`DELETE` `/chats/:roomId`

Rota para deletar um chat e somente o dono pode realizar essa ação, essa rota é protegida e as requisições devem conter o cabeçalho `Authorization` com o access token.

`POST` `/chats/:roomId/messages`

Rota para criar uma mensagem em um chat, essa rota é protegida e as requisições devem conter o cabeçalho `Authorization` com o access token um body com o conteúdo da mensagem.

`GET` `/chats/:roomId/messages`

Rota para listar as mensagem de um chat, essa rota é protegida e as requisições devem conter o cabeçalho `Authorization` com o access token um body com o conteúdo da mensagem.

`DELETE` `/chats/:roomId/messages/:messageId`

Rota para deletar uma mensagem e somente o autor pode realizar essa ação, essa rota é protegida e as requisições devem conter o cabeçalho `Authorization` com o access token.

