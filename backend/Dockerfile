FROM mcr.microsoft.com/dotnet/sdk:8.0 AS restore
WORKDIR /src

COPY NuGet.config ./
COPY Audiomusica.AssetManagement.sln ./
COPY src/Audiomusica.Domain/Audiomusica.Domain.csproj src/Audiomusica.Domain/
COPY src/Audiomusica.Application/Audiomusica.Application.csproj src/Audiomusica.Application/
COPY src/Audiomusica.Infrastructure/Audiomusica.Infrastructure.csproj src/Audiomusica.Infrastructure/
COPY src/Audiomusica.WebApi/Audiomusica.WebApi.csproj src/Audiomusica.WebApi/
RUN dotnet restore Audiomusica.AssetManagement.sln

FROM restore AS build
COPY . .
RUN dotnet publish src/Audiomusica.WebApi/Audiomusica.WebApi.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Audiomusica.WebApi.dll"]
