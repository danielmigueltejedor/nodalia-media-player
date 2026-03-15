import { PlayerEntityConfig, ShortcutConfig, ShortcutVisibility } from "./config";
import { HassEntity, HomeAssistant } from "./ha-types";

export const FEATURE_PAUSE = 1;
export const FEATURE_SEEK = 2;
export const FEATURE_VOLUME_SET = 4;
export const FEATURE_VOLUME_MUTE = 8;
export const FEATURE_PREVIOUS_TRACK = 16;
export const FEATURE_NEXT_TRACK = 32;
export const FEATURE_TURN_ON = 128;
export const FEATURE_TURN_OFF = 256;
export const FEATURE_SELECT_SOURCE = 2048;
export const FEATURE_STOP = 4096;
export const FEATURE_PLAY = 16384;
export const FEATURE_GROUPING = 524288;

export interface ResolvedPlayerEntity {
  config: PlayerEntityConfig;
  entityId: string;
  stateObj?: HassEntity;
  deviceStateObj?: HassEntity;
  musicAssistantStateObj?: HassEntity;
  playbackStateObj?: HassEntity;
  playbackEntityId: string;
  sourceStateObj?: HassEntity;
  groupStateObj?: HassEntity;
  groupEntityId: string;
  displayOrigin: "entity" | "music_assistant";
  volumeStateObj?: HassEntity;
}

export interface PlaceholderContext {
  entity: string;
  media_title: string;
  media_artist: string;
  media_album: string;
  source: string;
  app_name: string;
  friendly_name: string;
}

export interface QueueItemLike {
  queue_item_id?: string;
  name?: string;
  title?: string;
  media_title?: string;
  artist?: string;
  media_artist?: string;
  image?: string;
  media_image_url?: string;
  media_content_id?: string;
  duration?: number;
  playing?: boolean;
  [key: string]: unknown;
}

export function supportsFeature(entity: HassEntity | undefined, feature: number): boolean {
  if (!entity) {
    return false;
  }
  const supported = entity.attributes.supported_features;
  return typeof supported === "number" && (supported & feature) !== 0;
}

export function fireEvent<T>(
  node: EventTarget,
  type: string,
  detail?: T,
  options?: Omit<CustomEventInit<T>, "detail">,
): void {
  node.dispatchEvent(
    new CustomEvent(type, {
      bubbles: true,
      composed: true,
      cancelable: false,
      ...options,
      detail,
    }),
  );
}

export function resolveEntries(
  hass: HomeAssistant | undefined,
  entities: PlayerEntityConfig[],
): ResolvedPlayerEntity[] {
  return entities.map((config) => {
    const deviceStateObj = hass?.states[config.entity];
    const musicAssistantStateObj = config.music_assistant_entity
      ? hass?.states[config.music_assistant_entity]
      : undefined;
    const preferredCompanion = config.prefer_music_assistant ?? true;
    const stateObj = chooseDisplayState(
      deviceStateObj,
      musicAssistantStateObj,
      preferredCompanion,
    );
    const displayOrigin =
      stateObj && musicAssistantStateObj && stateObj.entity_id === musicAssistantStateObj.entity_id
        ? "music_assistant"
        : "entity";
    const playbackStateObj = stateObj ?? deviceStateObj ?? musicAssistantStateObj;
    const playbackEntityId =
      playbackStateObj?.entity_id ??
      config.music_assistant_entity ??
      config.entity;
    const sourceStateObj = deviceStateObj ?? playbackStateObj;
    const groupStateObj = pickGroupingState(
      playbackStateObj,
      musicAssistantStateObj,
      deviceStateObj,
    );

    return {
      config,
      entityId: config.entity,
      stateObj,
      deviceStateObj,
      musicAssistantStateObj,
      playbackStateObj,
      playbackEntityId,
      sourceStateObj,
      groupStateObj,
      groupEntityId: groupStateObj?.entity_id ?? playbackEntityId,
      displayOrigin,
      volumeStateObj: config.volume_entity
        ? hass?.states[config.volume_entity]
        : deviceStateObj ?? playbackStateObj,
    };
  });
}

function hasUsableMedia(entity?: HassEntity): boolean {
  return Boolean(
    entity?.attributes.media_title ||
      entity?.attributes.media_content_id ||
      entity?.attributes.entity_picture ||
      entity?.attributes.entity_picture_local,
  );
}

function displayScore(entity: HassEntity | undefined, preferred = false): number {
  if (!entity) {
    return -1;
  }
  let score = 0;
  if (isSessionActive(entity)) {
    score += 100;
  }
  if (entity.state === "playing") {
    score += 30;
  }
  if (hasUsableMedia(entity)) {
    score += 18;
  }
  if (preferred) {
    score += 5;
  }
  return score;
}

function chooseDisplayState(
  deviceStateObj?: HassEntity,
  musicAssistantStateObj?: HassEntity,
  preferredCompanion = true,
): HassEntity | undefined {
  if (!musicAssistantStateObj) {
    return deviceStateObj;
  }
  if (!deviceStateObj) {
    return musicAssistantStateObj;
  }

  const deviceActive = isSessionActive(deviceStateObj);
  const companionActive = isSessionActive(musicAssistantStateObj);

  if (!deviceActive && !companionActive) {
    if (
      deviceStateObj.state === "unavailable" &&
      musicAssistantStateObj.state !== "unavailable"
    ) {
      return musicAssistantStateObj;
    }
    return deviceStateObj;
  }

  return displayScore(musicAssistantStateObj, preferredCompanion) >
    displayScore(deviceStateObj)
    ? musicAssistantStateObj
    : deviceStateObj;
}

function pickGroupingState(
  playbackStateObj?: HassEntity,
  musicAssistantStateObj?: HassEntity,
  deviceStateObj?: HassEntity,
): HassEntity | undefined {
  const candidates = [playbackStateObj, musicAssistantStateObj, deviceStateObj];
  return candidates.find(
    (entity) =>
      supportsFeature(entity, FEATURE_GROUPING) ||
      Array.isArray(entity?.attributes.group_members),
  );
}

export function isPlaying(entity?: HassEntity): boolean {
  return entity?.state === "playing";
}

export function isIdleLike(entity?: HassEntity): boolean {
  return !entity || ["idle", "off", "standby", "unavailable", "unknown"].includes(entity.state);
}

export function isSessionActive(entity?: HassEntity): boolean {
  return !!entity && ["playing", "paused", "buffering"].includes(entity.state);
}

export function friendlyName(entity?: HassEntity, fallback?: string): string {
  return (
    entity?.attributes.friendly_name ??
    fallback ??
    entity?.entity_id ??
    ""
  );
}

export function artworkForEntity(entity?: HassEntity, override?: string): string {
  if (override) {
    return override;
  }
  return (
    entity?.attributes.entity_picture_local ??
    entity?.attributes.entity_picture ??
    ""
  );
}

export function iconForEntity(entity?: HassEntity, override?: string): string {
  return override ?? entity?.attributes.icon ?? "mdi:play-circle-outline";
}

export function formatTime(totalSeconds?: number): string {
  if (typeof totalSeconds !== "number" || Number.isNaN(totalSeconds)) {
    return "0:00";
  }
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function currentMediaPosition(entity: HassEntity | undefined, now: number): number {
  if (!entity) {
    return 0;
  }
  const basePosition = typeof entity.attributes.media_position === "number"
    ? entity.attributes.media_position
    : 0;
  if (entity.state !== "playing") {
    return basePosition;
  }
  const updatedAt = entity.attributes.media_position_updated_at;
  if (!updatedAt) {
    return basePosition;
  }
  const updated = new Date(updatedAt).getTime();
  if (Number.isNaN(updated)) {
    return basePosition;
  }
  return basePosition + Math.max(0, (now - updated) / 1000);
}

export function mediaTitle(entity?: HassEntity): string {
  return (
    entity?.attributes.media_title ??
    entity?.attributes.friendly_name ??
    entity?.entity_id ??
    ""
  );
}

export function mediaSubtitle(entity?: HassEntity): string {
  return (
    entity?.attributes.media_artist ??
    entity?.attributes.media_album_name ??
    entity?.attributes.app_name ??
    entity?.attributes.source ??
    ""
  );
}

export function mediaSupportingText(entity?: HassEntity): string {
  const parts = [
    entity?.attributes.media_album_name,
    entity?.attributes.source,
    entity?.attributes.app_name,
  ].filter((value): value is string => !!value);
  return Array.from(new Set(parts)).join(" · ");
}

export function buildStateLabel(entity?: HassEntity): string {
  return entity?.state ?? "unknown";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function parseEntityEditorText(value: string): PlayerEntityConfig[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [
        entity,
        name,
        icon,
        volume_entity,
        maybeMusicAssistantOrColor,
        maybeColor,
      ] = line
        .split("|")
        .map((item) => item.trim());
      const result: PlayerEntityConfig = { entity };
      if (name) {
        result.name = name;
      }
      if (icon) {
        result.icon = icon;
      }
      if (volume_entity) {
        result.volume_entity = volume_entity;
      }
      if (maybeColor) {
        result.music_assistant_entity = maybeMusicAssistantOrColor;
        result.accent_color = maybeColor;
      } else if (maybeMusicAssistantOrColor) {
        if (/^[a-z_]+\.[a-zA-Z0-9_]+$/.test(maybeMusicAssistantOrColor)) {
          result.music_assistant_entity = maybeMusicAssistantOrColor;
        } else {
          result.accent_color = maybeMusicAssistantOrColor;
        }
      }
      return result;
    })
    .filter((item) => item.entity);
}

export function serializeEntityEditorText(entities: PlayerEntityConfig[]): string {
  return entities
    .map((entity) => {
      const parts = [
        entity.entity,
        entity.name ?? "",
        entity.icon ?? "",
        entity.volume_entity ?? "",
      ];
      if (entity.music_assistant_entity || entity.accent_color) {
        parts.push(entity.music_assistant_entity ?? "");
      }
      if (entity.accent_color) {
        parts.push(entity.accent_color);
      }
      while (parts.length > 1 && !parts[parts.length - 1]) {
        parts.pop();
      }
      return parts.join(" | ");
    })
    .join("\n");
}

export function parseActionEditorText(value: string): ShortcutConfig[] {
  if (!value.trim()) {
    return [];
  }
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Actions JSON must be an array.");
  }
  return parsed as ShortcutConfig[];
}

export function visibilityMatches(
  visibility: ShortcutVisibility | undefined,
  entity?: HassEntity,
): boolean {
  if (!visibility || visibility === "always") {
    return true;
  }
  if (visibility === "playing") {
    return isPlaying(entity);
  }
  return isIdleLike(entity);
}

export function placeholderContext(entity?: HassEntity): PlaceholderContext {
  return {
    entity: entity?.entity_id ?? "",
    media_title: String(entity?.attributes.media_title ?? ""),
    media_artist: String(entity?.attributes.media_artist ?? ""),
    media_album: String(entity?.attributes.media_album_name ?? ""),
    source: String(entity?.attributes.source ?? ""),
    app_name: String(entity?.attributes.app_name ?? ""),
    friendly_name: friendlyName(entity),
  };
}

function interpolateString(value: string, context: PlaceholderContext): string {
  return value.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_match, key: keyof PlaceholderContext) => {
    return context[key] ?? "";
  });
}

export function interpolateTemplate<T>(value: T, context: PlaceholderContext): T {
  if (typeof value === "string") {
    return interpolateString(value, context) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => interpolateTemplate(item, context)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        interpolateTemplate(item, context),
      ]),
    ) as T;
  }
  return value;
}

export function normalizeGroupMembers(entity?: HassEntity): string[] {
  const members = entity?.attributes.group_members;
  if (!Array.isArray(members)) {
    return entity ? [entity.entity_id] : [];
  }
  return Array.from(new Set([entity?.entity_id, ...members].filter(Boolean) as string[]));
}

export function queueItemTitle(item: QueueItemLike): string {
  return item.name ?? item.media_title ?? item.title ?? "";
}

export function queueItemSubtitle(item: QueueItemLike): string {
  return item.artist ?? item.media_artist ?? "";
}

export function queueItemImage(item: QueueItemLike): string {
  return item.image ?? item.media_image_url ?? "";
}
