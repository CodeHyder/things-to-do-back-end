# Things To Do - Back-End

## Descrição

Este é o back-end da aplicação "Things To Do", uma API RESTful desenvolvida em JavaScript que permite gerenciar uma lista de tarefas. A aplicação oferece funcionalidades para criar, visualizar, atualizar e excluir tarefas, facilitando o acompanhamento de tarefas. Foi desenvolvida exclusivamente para o TCC da Pós Graduação em Desenvolvimento Full Stack da Pontifícia Universidade Católica do Rio Grande do Sul

## Funcionalidades

- Criar uma nova tarefa
- Listar todas as tarefas
- Visualizar uma tarefa específica
- Atualizar uma tarefa existente
- Excluir uma tarefa

## Tecnologias Utilizadas

- JavaScript
- Node.js
- Express
- Docker
- Docker Compose

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- Node.js
- Docker
- Docker Compose

## Instalação

Clone o repositório:

```javascript
git clone <https://github.com/CodeHyder/things-to-do-back-end.git>
```

```bash
cd things-to-do-back-end
```

## Instale as dependências

```javascript
npm install
```

Configure as variáveis de ambiente:

Crie um arquivo .env na raiz do projeto e defina as variáveis necessárias, como as configurações do banco de dados e portas utilizadas.
(para o orientador do TCC: as variaveis de ambiente estão dentro do arquivo do TCC no capítulo 09)

## Executando a Aplicação

### Com Docker

Construa e inicie os containers:

```bash
docker-compose up --build
```

A API estará disponível em:

<http://localhost:3000>

### Sem Docker

Inicie a aplicação:

```javascript
npm start 
```

ou

```javascript
node index.js
```

A API estará disponível em:

<http://localhost:3000>

## Testes

Para executar os testes, utilize o seguinte comando:

```javascript
    npm test
```

## Contribuição

Contribuições são bem-vindas! :) Sinta-se à vontade para abrir issues e pull requests para melhorias e correções.

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para obter mais informações
