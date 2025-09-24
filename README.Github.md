# MaPSCDAService

MaPSCDAService is a microservice designed for handling requests related to user authentication as well as helping the client to initiate the FIND journey.

## Features

- **Token Generation**: Generates secure tokens for user sessions using PKCE (Proof Key for Code Exchange).
- **Redirect Management**: Provides the client with an endpoint with which to initiate the FIND journey.
- **Claims Gathering**: Provides the client with an endpoint to complete the authentication process.
- **Validation**: Ensures that incoming requests contain valid data before processing.
- **Logging**: Implements robust logging for tracking requests and errors.

## Architecture

The service follows a modular architecture with clear separation of concerns. Key components include:

- **Controllers**: Handle incoming HTTP requests and orchestrate responses.
- **wwwroot**: Contains a dynamic Open Api spec for this service's Api. This document reflects any changes to the controller's endpoints
- **Models**: Define the structure of data being transmitted and received.
- **Utilities**: Contain reusable functions and helper classes.

## Tech Stack

The MaPSCDAService is built using the following technologies:

- **.NET 8.0**: The core framework for building the microservice, supporting modern C# features and performance improvements.
- **C#**: The primary programming language used for service development.
- **MhpdCommon**: A shared library for models and utilities used across the MHPD ecosystem.
- **Azure.Extensions.AspNetCore.Configuration.Secrets**: For accessing secrets in Azure during application configuration.
- **Azure.Identity**: For authenticating with Azure services.
- **Microsoft.Azure.AppConfiguration.AspNetCore**: For managing application settings in Azure App Configuration.
- **Newtonsoft.Json**: For JSON serialization and deserialization.
- **System.Configuration.ConfigurationManager**: For configuration management in .NET applications.
- **System.IdentityModel.Tokens.Jwt**: For handling JWT tokens for authentication.
- **XUnit**: For unit testing the service.
- **Moq**: For mocking dependencies in unit tests.

## Service Dependencies

The MaPSCDAService has the following key service dependencies:

- **Token Integration Service**: Used to obtain an authentication token.
- **PEI Integration Service**: Calls this service in order to trigger the claims gathering process.

These dependencies are crucial for the functionality and operation of the MaPSCDAService, allowing it to interact with other services in the MHPD ecosystem effectively.

## Installation

To set up the MaPSCDAService locally, follow these steps:

1. **Clone the Repository**:
```bash
   git clone https://github.com/moneyadviceservice/mhpd-backend-cda-service.git
   cd app
```

2. **Restore Dependencies**:
```bash
dotnet restore
```

3. **Configure Application Settings**:
```bash
{
  "Logging": {
    "LogLevel": {
      "Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware": "Information",
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ApplicationInsights": {
    "ConnectionString": "$(AppInsightsConnString)"
  },
  "AllowedHosts": "*",
  "TokenIntegrationServiceUrl": "$(TokenIntegrationServiceEndpoint)",
  "PeiIntegrationServiceUrl": "$(PeiIntegrationServiceEndpoint)",
  "JwtSettings": {
    "PrivateKey": "$(maps_cda_service_private_key)",
    "ExpiryInSeconds": "$(maps_cda_service_expiry)",
    "Audience": "$(maps_cda_service_audience)",
    "Kid": "$(maps_cda_service_kid)",
    "Roles": "owner"
  },
  "UriSettings": {
    "redirectTargetUrl": "$(maps_cda_service_redirect_target_url)"
  },
  "CosmosBusinessConfiguration": {
    "DatabaseId": "$(DatabaseId)",
    "UserSessionDataContainer": "$(UserSessionDataContainer)"
  },
  "ConnectionStrings": {
    "CosmosDBConnectionString": "$(CosmosDBConnectionString)"
  }
}
# Make sure to replace the placeholder values with actual settings for your environment.
```

4. **Build the Service**:
```bash
dotnet build
```

5. **Run the Service**:
```bash
dotnet run
```


## Testing
Unit tests are implemented to ensure the reliability of the service. To run the tests, navigate to the tests directory and execute:
```bash
cd tests
dotnet test
```

## Logging
Logging is configured to capture detailed information about requests and errors. Logs are written using the ILogger interface, providing insights into the operation of the service

## Pipelines
- infrastructure-deploy.yml
  - Terraform infrastructure for the function apps and app services
  - Pipeline name is 'MHPD-backend-infrastructure'
- cda-app-service-deploy.yml
  - Deploy .NET App to CDA-service-<env>
  - Pipeline name is 'MHPD CDA Service App Service Deploy'
- cda-service-api-publish.yml
  - Exports the API spec to api-docs repo and bumps the version of the APIm resource
  - Pipeline name is 'CDA Service - Publish API Spec'
- ci.yml
  - Builds and tests the project
  - Pipeline name is 'mhpd-backend-cda-service-ci'

## Contributing
Submit a pull request or open an issue for any enhancements or bug fixes.

## 📦 Release Notes

### 🔧 Release 0.3.0 — 2025-03-04
- Added CSRF support .

### 🔧 Release 0.5.0 — 2025-09-08
- Applied industry standard security response headers.
- Updated logging output consistency to improve traceability.