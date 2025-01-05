# CONTRIBUTION


### **1. Aceitar o Convite de Colaborador**

- O colaborador deve acessar o e-mail com o convite ou verificar a aba de convites pendentes no GitHub.
- Aceitar o convite para obter permissões de contribuição no repositório.

---

### **2. Configurar o Ambiente Local**

1. **Clonar o Repositório:**
	- Se for usar HTTPS:
```bash
    git clone https://github.com/CarlosDanielDev/javascript-light-bulb.git
```

- Se for usar SSH (recomendado):
     - Configurar a chave SSH (se ainda não estiver configurada):
```bash
    git push origin nome-da-feature
```

- Adicionar a chave pública ao GitHub em **Settings > SSH and GPG keys**.
	- Clonar com SSH:
```bash
    git clone git@github.com:CarlosDanielDev/javascript-light-bulb.git
```


2. **Entrar na pasta do repositório:**
```bash
git push origin nome-da-feature
```

---

### **3. Criar uma Nova Branch**

- Certificar-se de estar na branch `main`:
```bash
git checkout main
```
- Atualizar a branch local com as últimas mudanças:
```bash
git pull origin main
```
- Criar uma nova branch para as alterações:
```bash
git push origin nome-da-feature
```

---

### **4. Fazer as Alterações**

- Editar os arquivos necessários no editor de código.

---

### **5. Comitar as Alterações**

1. **Adicionar as alterações ao staging:**
```bash
git add .
```

2. **Criar um commit com uma mensagem descritiva:**
```bash
git push origin nome-da-feature
```

---
### **6. Enviar as Alterações para o Repositório**

- Fazer o push da branch para o repositório remoto:
```bash
git push origin nome-da-feature
```
---

### **7. Criar uma Pull Request (PR)**

1. Acessar o repositório no GitHub.
2. Ir na aba **Pull Requests** e clicar em **New Pull Request**.
3. Selecionar a branch criada (`nome-da-feature`) como base e a branch `main` como destino.
4. Adicionar uma descrição detalhada da alteração feita.
5. Enviar a Pull Request para revisão.

---

### **8. Aguardar a Revisão**

- Aguardar revisão do código.
- Realizar ajustes, se necessário, com novos `commits` na mesma branch e atualizar a PR automaticamente.

---

### **9. Após o Merge**

- Após o `merge`, o colaborador pode deletar a `branch` local e `remota`:
```bash
git branch -d nome-da-feature git push origin --delete nome-da-feature
```
---

Esse processo garante que o colaborador contribua de forma organizada, rastreável e segura para o seu projeto.
