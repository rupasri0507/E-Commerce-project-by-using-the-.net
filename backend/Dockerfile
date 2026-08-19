# Build stage with .NET 8 SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY Backend.csproj ./
RUN dotnet restore Backend.csproj

# Copy remaining source files and build release
COPY . ./
RUN dotnet publish Backend.csproj -c Release -o /app/publish

# Runtime stage with .NET 8 ASP.NET runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Set ASP.NET Core environment and listening port
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Development
EXPOSE 8080

# Run the API DLL
ENTRYPOINT ["dotnet", "Backend.dll"]
