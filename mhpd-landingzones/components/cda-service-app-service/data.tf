data "azurerm_cosmosdb_account" "mhpd" {
  name                = "cosmos-${var.product}-${var.env}-uks"
  resource_group_name = "rg-${var.product}-${var.env}-uksouth"
}

data "azurerm_key_vault" "mhpd" {
  name                = "kv-${var.product}-${var.env}-uks"
  resource_group_name = "rg-${var.product}-${var.env}-uksouth"
}

data "azurerm_key_vault_secret" "cda_service_private_key" {
  name         = "maps-cda-service-private-key"
  key_vault_id = data.azurerm_key_vault.mhpd.id
}

data "azurerm_key_vault_secret" "cda_service_kid" {
  name         = "maps-cda-service-kid"
  key_vault_id = data.azurerm_key_vault.mhpd.id
}
