# versão do maven e depois versão do jdk
FROM maven:3.9.9-amazoncorretto-17 as build
# diretório que vai ficar os itens dentro do container
WORKDIR /app
# copia tudo para o container
COPY . .
# comando de empacotamento gerando o log com o -X e pulando os testes com o -DskipTests
RUN mvn clean package -X -DskipTests
# rodando o jar que foi gerado pelo comando acima

FROM openjdk:17-ea-10-jdk-slim
WORKDIR /app
COPY --from=build ./app/target/*.jar ./systemcharging.jar
ENTRYPOINT java -jar systemcharging.jar