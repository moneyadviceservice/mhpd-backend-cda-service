locals {
  location_short = {
    uksouth = "uks"
    ukwest  = "ukw"
  }
  loc = local.location_short[var.location]

  resource_group_name = "rg-${var.product}-${var.env}-${var.location}"

  pe_enabled     = var.env == "nft" || var.env == "stg" || var.env == "prod"
  sku_name       = local.pe_enabled ? "P1v2" : "B3"
  zone_redundant = var.env == "prod" && var.location == "uksouth"

  app_name          = "cda-service-${local.loc}-${var.env}"
  service_plan_name = "${var.product}-asp-cda-svc-${local.loc}-${var.env}"

  logs_resource_group = "rg-mhpd-${var.env}-logs-${var.location}"
  logs_workspace_name = "mhpd-logs-${var.env}-${local.loc}"
  logs_workspace_id   = "/subscriptions/${var.subscription_id}/resourceGroups/${local.logs_resource_group}/providers/Microsoft.OperationalInsights/workspaces/${local.logs_workspace_name}"

  spoke_rg        = "rg-mhpd-${var.env}-spoke-${var.location}"
  spoke_vnet_name = "vnet-mhpd-${var.env}-spoke-${var.location}"
  apps_subnet_id  = "/subscriptions/${var.subscription_id}/resourceGroups/${local.spoke_rg}/providers/Microsoft.Network/virtualNetworks/${local.spoke_vnet_name}/subnets/mhpd-apps"
  apim_subnet_id  = "/subscriptions/${var.subscription_id}/resourceGroups/${local.spoke_rg}/providers/Microsoft.Network/virtualNetworks/${local.spoke_vnet_name}/subnets/mhpd-apim"

  enable_vnet_integration       = local.pe_enabled
  ip_restriction_default_action = local.pe_enabled ? "Deny" : "Allow"

  ip_restrictions = local.pe_enabled ? [
    {
      name                      = "mhpd-apim-allow"
      priority                  = 200
      action                    = "Allow"
      virtual_network_subnet_id = local.apim_subnet_id
      ip_address                = null
      headers                   = []
    },
    {
      name                      = "firewall-ip-allow"
      priority                  = 300
      action                    = "Allow"
      virtual_network_subnet_id = null
      ip_address                = "${var.hub_firewall_private_ip}/32"
      headers                   = []
    }
  ] : []

  # Cosmos account is global (always -uks); UKWest uses the region-suffixed endpoint
  # resolved by the privatelink DNS zone to the UKW private endpoint.
  cosmos_account_name = "cosmos-${var.product}-${var.env}-uks"
  cosmos_endpoint     = var.location == "uksouth" ? "https://${local.cosmos_account_name}.documents.azure.com:443/" : "https://${local.cosmos_account_name}-${var.location}.documents.azure.com:443/"

  cosmos_db_connection_string = {
    name  = "CosmosDBConnectionString"
    type  = "Custom"
    value = "AccountEndpoint=${local.cosmos_endpoint};AccountKey=${data.azurerm_cosmosdb_account.mhpd.primary_key}"
  }

  apim_base_url = local.pe_enabled ? "https://apim-internal-mhpd-${var.env}-uks.azure-api.net" : "https://apim-mhpd-${var.env}-uks.azure-api.net"

  cda_service_app_settings = {
    "APPLICATIONINSIGHTS_CONNECTION_STRING"                 = azurerm_application_insights.this.connection_string
    "WEBSITE_ENABLE_SYNC_UPDATE_SITE"                       = "true"
    "KeyVaultConfiguration__KeyVaultURL"                    = "https://kv-${var.product}-${var.env}-uks.vault.azure.net/"
    "UriSettings__RedirectTargetUrl"                        = var.env == "prod" ? "https://auth.find-your-pensions.service.gov.uk/ig/authorize" : "https://pdp-data-access-test-harness.netlify.app/"
    "JwtSettings__PrivateKey"                               = data.azurerm_key_vault_secret.cda_service_private_key.value
    "JwtSettings__ExpiryInSeconds"                          = 600
    "JwtSettings__Audience"                                 = var.env == "prod" ? "https://auth.find-your-pensions.service.gov.uk" : "https://pdp-data-access-test-harness.netlify.app"
    "JwtSettings__Kid"                                      = data.azurerm_key_vault_secret.cda_service_kid.value
    "JwtSettings__Role"                                     = "owner"
    "TokenIntegrationServiceUrl"                            = "https://token-integration-service-${local.loc}-${var.env}.azurewebsites.net/"
    "PeiIntegrationServiceUrl"                              = "https://pei-integration-service-${local.loc}-${var.env}.azurewebsites.net/"
    "OpenApiServerUrl"                                      = "${local.apim_base_url}/cda-service/"
    "CosmosBusinessConfiguration__DatabaseId"               = "mhpd-business-layer"
    "CosmosBusinessConfiguration__UserSessionDataContainer" = "mhpdUserSessionData"
  }
}
