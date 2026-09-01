---
description: "Melhora o visual do frontend do DMS usando Tailwind CSS 3."
name: melhorar-visual-tailwind
argument-hint: foco opcional da melhoria visual (ex. mobile, tabela, upload, acessibilidade)
agent: tailwind-ui
---

# Melhorar visual com Tailwind CSS 3

Melhore o visual da aplicação Document Management System usando Tailwind CSS 3.

Foco informado pelo usuário: `${input:foco:foco opcional da melhoria visual}`.

## Contexto da aplicação

- Frontend em React + Vite em `frontend/`.
- Backend em Node.js + Express em `backend/`.
- A comunicação do frontend com o backend acontece via `/api`.
- A aplicação atual permite informar usuário, fazer upload, listar documentos e baixar arquivos.
- O frontend atual usa componentes em `frontend/src/components` e serviço de API em `frontend/src/services/api.js`.

## Tarefa

Atualize a interface para uma experiência mais moderna, responsiva e profissional usando Tailwind CSS 3.

## Requisitos

- Configure Tailwind CSS 3 no frontend caso ainda não exista.
- Substitua estilos inline por classes Tailwind onde for adequado.
- Preserve a lógica funcional existente de upload, listagem, carregamento e download.
- Mantenha textos de interface em português.
- Melhore hierarquia visual, espaçamento, contraste, estados de foco, hover, disabled, sucesso, erro e vazio.
- Garanta boa leitura em mobile e desktop.
- Para a lista de documentos, escolha uma apresentação responsiva que funcione bem em telas pequenas.
- Evite aparência de landing page; entregue a aplicação utilizável logo na primeira tela.
- Não altere contratos da API nem regras de negócio do backend.

## Validação

Após implementar, execute o comando mais adequado disponível no frontend, por exemplo `npm run build`, `npm run lint` ou outro script existente em `frontend/package.json`.

## Saída esperada

Responda com um resumo curto contendo:

1. Arquivos alterados.
2. Melhorias visuais principais.
3. Comando de validação executado e resultado.