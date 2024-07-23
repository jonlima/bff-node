# BFF Node.js 

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

Este repositório contém um projeto de Backend for Frontend (BFF) desenvolvido em Node.js.


## Stack utilizada

- Node 
- Fastify
- Ioredis
- Opossum
- Undici


## Estrutura do Projeto

- **src/**: Contém o código-fonte principal do projeto.
- **fake_apis/**: APIs simuladas para testes e desenvolvimento.
- **docker-compose.yml**: Configuração do Docker Compose para executar redis.


## Configuração e Execução

### Pré-requisitos

- Node.js
- Docker 

### Instalação

1. Clone o repositório:
```bash
   git clone https://github.com/jonlima/bff-node.git
   cd bff-node
```

2. Instale as dependências:
```bash
npm install
```

### Execução

Para rodar o redis localmente:
```bash
docker-compose up -d
```

Para rodar o projeto localmente:
```bash
npm start
```

## Scripts Disponíveis

- `npm start`: Inicia o servidor Node.js.
- `npm run start:dev`: Inicia o servidor Node.js.
- `npm test`: Executa os testes automatizados.


## Documentação da API

#### Retorna todos os posts

```http
  GET /posts
```

#### Retorna um post

```http
  GET /posts/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do post que você quer |
