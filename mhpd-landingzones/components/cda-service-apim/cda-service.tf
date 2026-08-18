resource "azurerm_api_management_api" "cda_service" {
  name                  = "cda-service"
  description           = "This API describes the service that provides RQP tokens for clients interacting with CDA components."
  resource_group_name   = data.azurerm_api_management.this.resource_group_name
  api_management_name   = data.azurerm_api_management.this.name
  revision              = "1"
  display_name          = "cda-service"
  path                  = "maps-cda-service"
  service_url           = local.cda_backend_url_uks
  protocols             = ["https"]
  subscription_required = false

  subscription_key_parameter_names {
    header = "Ocp-Apim-Subscription-Key"
    query  = "subscription-key"
  }

  import {
    content_format = "openapi+json"
    content_value  = replace(data.http.cda_service_spec.response_body, "\"openapi\": \"3.0.4\"", "\"openapi\": \"3.0.1\"")
  }

  lifecycle {
    ignore_changes = [revision, import]
  }
}

resource "azurerm_api_management_api_policy" "cda_service" {
  api_name            = azurerm_api_management_api.cda_service.name
  api_management_name = data.azurerm_api_management.this.name
  resource_group_name = data.azurerm_api_management.this.resource_group_name

  xml_content = <<-XML
    <policies>
      <inbound>
        <base />
        <choose>
          <when condition="@(context.Deployment.Region == &quot;UK West&quot;)">
            <set-backend-service base-url="${local.cda_backend_url_ukw}" />
          </when>
        </choose>
      </inbound>
      <backend>
        <base />
      </backend>
      <outbound>
        <base />
      </outbound>
      <on-error>
        <base />
      </on-error>
    </policies>
  XML

  lifecycle {
    ignore_changes = [xml_content]
  }
}

resource "azurerm_api_management_product_api" "cda_service" {
  api_name            = azurerm_api_management_api.cda_service.name
  product_id          = data.azurerm_api_management_product.mhpd.product_id
  api_management_name = data.azurerm_api_management.this.name
  resource_group_name = data.azurerm_api_management.this.resource_group_name
}

resource "azurerm_api_management_api_tag" "cda_service" {
  api_id = azurerm_api_management_api.cda_service.id
  name   = "mhpd"
}

resource "azurerm_api_management_api_diagnostic" "cda_service" {
  identifier                = "applicationinsights"
  resource_group_name       = data.azurerm_api_management.this.resource_group_name
  api_management_name       = data.azurerm_api_management.this.name
  api_name                  = azurerm_api_management_api.cda_service.name
  api_management_logger_id  = local.api_management_logger_id
  sampling_percentage       = var.sampling_percentage
  always_log_errors         = true
  log_client_ip             = true
  verbosity                 = var.verbosity
  http_correlation_protocol = var.http_correlation_protocol
}
