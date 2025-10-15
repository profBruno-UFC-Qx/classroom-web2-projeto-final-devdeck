[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iVa2Dd1Z)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21084164)
# :checkered_flag: DevDeck

DevDeck é uma plataforma web fullstack que permite a desenvolvedores de software criar, gerenciar e compartilhar um portfólio profissional de forma simples e intuitiva. A aplicação oferece um painel de controle onde o usuário pode cadastrar seus projetos, habilidades e informações pessoais, que são então exibidos em uma página pública com um link exclusivo.

## :technologist: Membros da equipe

* 586043 - Francisco Edinaldo dos Santos Silva, Ciência da Computação

## :bulb: Objetivo Geral
O objetivo geral do DevDeck é fornecer uma ferramenta centralizada e de fácil uso para que desenvolvedores possam construir uma presença online profissional, consolidando suas competências e projetos em um único local, a fim de aumentar sua visibilidade para recrutadores e para a comunidade de tecnologia.

## :eyes: Público-Alvo
* **Desenvolvedores de Software:** Estudantes, freelancers e profissionais que buscam uma maneira rápida e eficaz de apresentar seus trabalhos.
* **Recrutadores e Tech Managers:** Profissionais que procuram talentos e precisam avaliar as habilidades e a experiência prática de candidatos.

## :star2: Impacto Esperado
Espera-se que o DevDeck facilite a entrada de novos desenvolvedores no mercado de trabalho, permitindo que eles criem um portfólio de alta qualidade sem a necessidade de construir um site do zero. Para recrutadores, a plataforma agiliza o processo de análise de candidatos, oferecendo acesso a portfólios padronizados e bem estruturados.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

* **Visitante (Usuário não logado):** Qualquer pessoa que acessa a plataforma sem autenticação.
* **Usuário Cadastrado:** Desenvolvedor que se registrou na plataforma e possui acesso ao painel de gerenciamento do seu portfólio.
* **Administrador:** Usuário com permissões elevadas para gerenciar a plataforma, incluindo usuários e conteúdos.

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

### Funcionalidades Públicas (acessíveis a todos)
* Visualizar portfólios publicados através de seus URLs únicos (ex: `devdeck.com/username`).
* Acessar a landing page da plataforma para entender seu propósito e funcionalidades.
* Realizar o cadastro de uma nova conta de usuário.

### Funcionalidades Restritas (acessíveis a usuários logados)
* **Para Usuários Cadastrados:**
    * Acessar um dashboard pessoal para gerenciamento do portfólio.
    * Autenticação segura via JWT (Login/Logout).
    * Editar informações do perfil (nome, foto, biografia, links sociais).
    * **CRUD completo de Projetos:** Adicionar, editar, visualizar e remover os projetos que serão exibidos.
    * **CRUD completo de Habilidades:** Adicionar e remover as tecnologias e competências que domina.
    * Publicar ou despublicar o seu portfólio.
* **Para Administradores:**
    * Acessar um painel de administração exclusivo.
    * Visualizar uma lista paginada de todos os usuários da plataforma.
    * Gerenciar usuários (ex: alterar papel, suspender ou deletar contas).

## :spiral_calendar: Entidades ou tabelas do sistema

1.  **Users:** Armazena as informações de autenticação (email, senha) e o papel (`role`) de cada usuário.
2.  **Portfolios:** Contém as informações gerais do portfólio de um usuário (título, biografia, foto de perfil). Relaciona-se diretamente com um `User`.
3.  **Projects:** Guarda os detalhes de cada projeto cadastrado (título, descrição, link do repositório, tecnologias). Um projeto pertence a um `Portfolio`.
4.  **Skills:** Armazena as habilidades (ex: "JavaScript", "Node.js") de um usuário. Uma habilidade pertence a um `Portfolio`.
5.  **SocialLinks:** Mantém os links para as redes sociais profissionais (ex: GitHub, LinkedIn) do usuário. Um link pertence a um `Portfolio`.
