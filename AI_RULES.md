# Diretrizes de Desenvolvimento e Stack Tecnológica

Este documento estabelece as regras e a pilha tecnológica (tech stack) a serem seguidas para manter a consistência, simplicidade e elegância do projeto "Comparador de Compras Olímpia".

## 1. Stack Tecnológica

O projeto é construído com as seguintes tecnologias principais:

*   **Framework:** React (versão 19+), utilizando componentes funcionais e hooks.
*   **Linguagem:** TypeScript, garantindo tipagem estática e maior segurança no desenvolvimento.
*   **Estilização:** Tailwind CSS, para uma abordagem utility-first, garantindo designs responsivos e rápidos.
*   **Componentes UI:** Priorizamos a simplicidade com HTML/Tailwind puro. Para componentes mais complexos, utilizamos a biblioteca `shadcn/ui` (baseada em Radix UI).
*   **Build Tool:** Vite, para um ambiente de desenvolvimento rápido e otimizado.
*   **Persistência de Dados:** Utilização de um hook customizado (`useLocalStorage`) para persistência de dados no navegador.
*   **Ícones:** Biblioteca `lucide-react` para todos os ícones visuais.
*   **Estrutura de Arquivos:** Componentes em `src/components/` e páginas em `src/pages/`.
*   **Convenções:** Código deve ser simples, legível e focado na funcionalidade solicitada (KISS principle).

## 2. Regras de Uso de Bibliotecas e Ferramentas

| Propósito | Ferramenta/Biblioteca Recomendada | Regras de Uso |
| :--- | :--- | :--- |
| **Estilização** | Tailwind CSS | **Exclusivamente** classes utilitárias do Tailwind. Evitar arquivos CSS customizados. |
| **Componentes UI** | `shadcn/ui` / Radix UI | Usar componentes pré-construídos do `shadcn/ui` sempre que possível para elementos como botões, inputs, modais, etc. |
| **Ícones** | `lucide-react` | Importar e usar ícones diretamente desta biblioteca. |
| **Gerenciamento de Estado** | React Hooks (`useState`, `useMemo`, `useCallback`) | Utilizar hooks nativos do React. Para persistência, usar o `useLocalStorage` existente. Evitar bibliotecas externas de estado (e.g., Redux, Zustand) a menos que estritamente necessário. |
| **Roteamento** | React Router | Se o aplicativo precisar de múltiplas rotas, deve-se implementar o React Router. |
| **Notificações** | `react-hot-toast` (se instalado) | Usar toasts para feedback não intrusivo ao usuário (sucesso, erro, carregamento). |
| **Backend/Auth/DB** | Supabase | Qualquer funcionalidade que exija autenticação, banco de dados ou funções server-side deve ser implementada após a integração do Supabase. |