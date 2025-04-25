FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY SpaceForce.VisitorManagement.Api/*.csproj SpaceForce.VisitorManagement.Api/
COPY SpaceForce.VisitorManagement.Data/*.csproj SpaceForce.VisitorManagement.Data/
COPY SpaceForce.VisitorManagement.sln .
RUN dotnet restore

# Create DTOs directory
RUN mkdir -p SpaceForce.VisitorManagement.Data/DTOs

# Copy everything else and build
COPY SpaceForce.VisitorManagement.Api/ SpaceForce.VisitorManagement.Api/
COPY SpaceForce.VisitorManagement.Data/ SpaceForce.VisitorManagement.Data/
RUN dotnet publish SpaceForce.VisitorManagement.Api/SpaceForce.VisitorManagement.Api.csproj -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Create directory for logs
RUN mkdir -p /app/logs

# Add entrypoint script
COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

# Expose the port
EXPOSE 80
EXPOSE 443

# Set environment variables for database connection
ENV DB__Server=postgres
ENV DB__Database=sf-visitor-management
ENV DB__UserId=postgres
ENV DB__Password=mysecretpassword
ENV DB__Port=5432

ENTRYPOINT ["/app/entrypoint.sh"]