# Estágio 1: build
FROM node:20-alpine as build

# Define o diretório de trabalho no container
WORKDIR /app

# Copia o package.json e instala as dependências usando npm
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante dos arquivos da aplicação e faz o build
COPY . .
RUN npm run build

# Estágio 2: Nginx para servir a aplicação
FROM nginx:alpine

# Copia os arquivos de build para o diretório do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia a configuração padrão do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 para servir a aplicação
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]