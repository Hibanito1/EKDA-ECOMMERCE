import { NextResponse } from "next/server";

interface IntegrationUnavailableOptions {
  service: string;
  requiredEnv?: readonly string[];
  developerAction: string;
}

export function integrationUnavailable({
  service,
  requiredEnv = [],
  developerAction,
}: IntegrationUnavailableOptions) {
  return NextResponse.json(
    {
      error: `${service} integration is not configured`,
      code: "INTEGRATION_NOT_CONFIGURED",
      required_env: requiredEnv,
      developer_action: developerAction,
    },
    { status: 501 },
  );
}
