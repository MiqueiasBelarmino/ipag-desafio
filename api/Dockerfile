FROM node:20-alpine

# Diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Porta da aplicação
EXPOSE 3000

# Comando padrão
CMD ["npm", "run", "dev"]
