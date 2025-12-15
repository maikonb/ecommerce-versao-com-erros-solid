# Projeto Legacy - E-commerce Monolítico 

Este projeto simula um backend de e-commerce com código "legado". Ele funciona, mas possui graves problemas de design que dificultam a manutenção e expansão.

## Estrutura de Diretórios

* `src/controllers/OrderController.ts`: **O Problema.** Contém toda a lógica de negócio centralizada (validação, frete, pagamento, banco, notificação).
* `src/lib/logger.ts`: Utilitário de log (Winston - procure mais sobre ele, é muito util em projetos reais).
* `src/lib/mail.ts`: Configuração do Nodemailer (utilizando Ethereal para testes).
* `src/app.ts` & `src/server.ts`: Configuração do Express e inicialização do servidor.
* `prisma/`: Configuração do banco de dados SQLite e script de seed.
* `prisma/seed.ts`: Popula o banco com dados iniciais.

## Instalação e Configuração

Siga os passos abaixo para preparar o ambiente:

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Crie o banco de dados (SQLite) e as tabelas:**
    ```bash
    npm run prisma:migrate
    ```

3.  **Popule o banco com dados de teste (Livro Físico e E-book):**
    ```bash
    npm run prisma:seed
    ```

## ⚡ Execução

Para rodar a API em modo de desenvolvimento (reinicia ao salvar arquivos):

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`.
*Nota: A primeira execução pode demorar alguns segundos para gerar as credenciais de teste do Ethereal Mail.*

## Como Testar

Utilize o **cURL** (terminal) ou ferramentas como **Postman/Insomnia** para enviar requisições POST.

Você pode utilizar o gitbash para executar os comandos abaixo usando o cURL, ele parece estar funcionando muito bem (mas claro que o melhor seria utilizar Linux).


### Cenário 1: Compra de Livro Físico (Com Frete)
O sistema deve calcular R$ 10,00 de frete.

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "abacaxi123@ethereal.email",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

### Cenário 2: Compra de E-book (Digital)
Produto digital (ID 2). Observe como o código atual trata isso (gera frete incorreto ou lógica misturada).

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "abacate123@ethereal.email",
  "items": [{ "productId": 2, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```


---

## Sugestões de Melhoria (O Desafio)

O objetivo deste trabalho é refatorar o `OrderController` aplicando os princípios SOLID. Abaixo estão as sugestões do que deve ser feito:

### 1. Separação de Responsabilidades (SRP)
O Controller atual faz coisas demais:
* **Notificações (Email):** O controller monta strings de **HTML** e conhece detalhes de SMTP. Isso gera acoplamento e latência na resposta HTTP. Extraia para um `EmailService`.
* **Persistência:** O controller chama o Prisma diretamente. Extraia para um `OrderRepository`.

### 2. Extensibilidade de Pagamentos (OCP)
Adicionar um novo método (ex: Pix) exige mudar vários `if/else` no código principal.
* **Sugestão:** Crie uma interface `IPaymentMethod` com um método `process()`.
* **Sugestão:** Implemente estratégias concretas (`CreditCardPayment`, `PixPayment`).
No `process()` apenas imprima uma mensagem simulando o processamento.

### 3. Hierarquia de Produtos (LSP)
Produtos Digitais e Físicos são tratados com `if (type === 'digital')`.
* **Sugestão:** O cálculo de frete deve ser polimórfico. O código que processa o pedido não deveria saber diferenciar tipos de produto explicitamente.

---

## Árvore de Arquivos Sugerida (Pós-Refatoração)

> **Nota:** Esta estrutura é apenas uma sugestão didática. Você tem liberdade para organizar as pastas de outra forma, desde que os princípios SOLID sejam respeitados.

```text
src/
├── controllers/
│   └── OrderController.ts      # Recebe a requisição e orquestra a chamada ao Service
├── services/
│   ├── OrderService.ts         # Regra de Negócio (Orquestrador Principal)
│   ├── FreightService.ts       # Cálculo de frete (Lida com o polimorfismo de produtos)
│   └── EmailService.ts         # Lógica de templates HTML e envio (Nodemailer)
├── repositories/
│   └── OrderRepository.ts      # Camada de acesso a dados (Prisma)
├── payments/
│   ├── IPaymentMethod.ts       # Interface (Contrato)
│   ├── CreditCardPayment.ts
│   └── PixPayment.ts
├── lib/
│   ├── mail.ts                 # Configuração do Transporter (Infra)
│   └── logger.ts               # Configuração do Logger (Infra)
├── app.ts
└── server.ts
```