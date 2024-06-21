# Fake APIs

## Instalação

> Instale o json-server na versão 0.

```
npm i -g json-server@^0
```

## Serviços

**posts:**
```
json-server fake_apis/posts.json -p 3001 --middlewares ./fake_apis/random-delay.js
```

**comments:**
```
json-server fake_apis/comments.json -p 3002 --delay 500
```

**users:**
```
json-server fake_apis/users.json -p 3003 --middlewares ./fake_apis/random-delay.js
```