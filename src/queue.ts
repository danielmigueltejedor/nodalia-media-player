import { HomeAssistant } from "./ha-types";
import { QueueItemLike } from "./utils";

interface QueueResponse {
  response: Record<string, QueueItemLike[]>;
}

async function callWS<T>(hass: HomeAssistant, message: unknown): Promise<T> {
  if (typeof hass.callWS === "function") {
    return hass.callWS<T>(message);
  }
  if (hass.connection?.sendMessagePromise) {
    return hass.connection.sendMessagePromise<T>(message);
  }
  throw new Error("Home Assistant websocket API is not available.");
}

export async function fetchQueueItems(
  hass: HomeAssistant,
  entityId: string,
  limit: number,
): Promise<QueueItemLike[]> {
  const response = await callWS<QueueResponse>(hass, {
    type: "call_service",
    domain: "mass_queue",
    service: "get_queue_items",
    service_data: {
      entity: entityId,
      limit_before: 0,
      limit_after: limit,
    },
    return_response: true,
  });
  return response.response?.[entityId] ?? [];
}

export async function playQueueItem(
  hass: HomeAssistant,
  entityId: string,
  queueItemId: string,
): Promise<void> {
  await hass.callService("mass_queue", "play_queue_item", {
    entity: entityId,
    queue_item_id: queueItemId,
  });
}

export async function removeQueueItem(
  hass: HomeAssistant,
  entityId: string,
  queueItemId: string,
): Promise<void> {
  await hass.callService("mass_queue", "remove_queue_item", {
    entity: entityId,
    queue_item_id: queueItemId,
  });
}

export async function clearQueue(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService("media_player", "clear_playlist", {
    entity_id: entityId,
  });
}
