import { LovelaceCardConfig } from "./ha-types";

export type HiddenControl =
  | "power"
  | "previous"
  | "play_pause"
  | "next"
  | "mute"
  | "volume"
  | "source"
  | "seek";

export type ShortcutVisibility = "always" | "playing" | "idle";
export type ShortcutActionType =
  | "call-service"
  | "navigate"
  | "url"
  | "more-info"
  | "toggle";

export interface PlayerEntityConfig {
  entity: string;
  name?: string;
  icon?: string;
  image?: string;
  volume_entity?: string;
  music_assistant_entity?: string;
  prefer_music_assistant?: boolean;
  accent_color?: string;
  favorite_service?: string;
  favorite_service_data?: Record<string, unknown>;
  hide_controls?: HiddenControl[];
}

export interface ShortcutConfig {
  label: string;
  icon?: string;
  visibility?: ShortcutVisibility;
  entity?: string;
  action: ShortcutActionType;
  service?: string;
  service_data?: Record<string, unknown>;
  navigation_path?: string;
  url_path?: string;
  new_tab?: boolean;
}

export interface AppearanceConfig {
  artwork_fit?: "cover" | "contain";
  theme?: "auto" | "light" | "dark";
  accent_color?: string;
  blur_background?: boolean;
}

export interface BehaviorConfig {
  auto_select_active?: boolean;
  collapse_when_idle?: boolean;
  expanded_by_default?: boolean;
  show_timestamps?: boolean;
  show_details?: boolean;
  show_sources?: boolean;
  show_volume?: boolean;
  show_group_controls?: boolean;
  enable_seek?: boolean;
}

export interface QueueConfig {
  enabled?: boolean;
  limit?: number;
}

export interface NodaliaMediaPlayerConfig extends LovelaceCardConfig {
  type: "custom:nodalia-media-player";
  entity?: string;
  entities?: Array<string | PlayerEntityConfig>;
  name?: string;
  language?: "auto" | "es" | "en";
  appearance?: AppearanceConfig;
  behavior?: BehaviorConfig;
  queue?: QueueConfig;
  actions?: ShortcutConfig[];
}

export interface NormalizedConfig
  extends Omit<NodaliaMediaPlayerConfig, "entities" | "appearance" | "behavior" | "queue"> {
  entities: PlayerEntityConfig[];
  appearance: Required<AppearanceConfig>;
  behavior: Required<BehaviorConfig>;
  queue: Required<QueueConfig>;
  actions: ShortcutConfig[];
}

export const DEFAULT_APPEARANCE: Required<AppearanceConfig> = {
  artwork_fit: "cover",
  theme: "auto",
  accent_color: "var(--primary-text-color)",
  blur_background: false,
};

const LEGACY_DEFAULT_ACCENT = "var(--state-media-player-active-color, var(--primary-color))";

export const DEFAULT_BEHAVIOR: Required<BehaviorConfig> = {
  auto_select_active: true,
  collapse_when_idle: false,
  expanded_by_default: false,
  show_timestamps: true,
  show_details: true,
  show_sources: true,
  show_volume: true,
  show_group_controls: true,
  enable_seek: true,
};

export const DEFAULT_QUEUE: Required<QueueConfig> = {
  enabled: true,
  limit: 5,
};

function normalizeEntity(entity: string | PlayerEntityConfig): PlayerEntityConfig {
  if (typeof entity === "string") {
    return { entity };
  }
  return {
    ...entity,
    hide_controls: entity.hide_controls ?? [],
  };
}

export function normalizeConfig(
  config: NodaliaMediaPlayerConfig,
): NormalizedConfig {
  const rawEntities = config.entities?.length
    ? config.entities
    : config.entity
      ? [config.entity]
      : [];

  const entities = rawEntities.map(normalizeEntity).filter((item) => item.entity);

  if (!entities.length) {
    throw new Error("You need to define at least one media player entity.");
  }

  const accentWasLegacy =
    !config.appearance?.accent_color ||
    config.appearance.accent_color === LEGACY_DEFAULT_ACCENT;
  const appearance: Required<AppearanceConfig> = {
    ...DEFAULT_APPEARANCE,
    ...(config.appearance ?? {}),
    accent_color: accentWasLegacy
      ? DEFAULT_APPEARANCE.accent_color
      : config.appearance?.accent_color ?? DEFAULT_APPEARANCE.accent_color,
    blur_background:
      accentWasLegacy && config.appearance?.blur_background === true
        ? DEFAULT_APPEARANCE.blur_background
        : config.appearance?.blur_background ?? DEFAULT_APPEARANCE.blur_background,
  };

  return {
    ...config,
    entities,
    language: config.language ?? "auto",
    appearance,
    behavior: {
      ...DEFAULT_BEHAVIOR,
      ...(config.behavior ?? {}),
    },
    queue: {
      ...DEFAULT_QUEUE,
      ...(config.queue ?? {}),
      limit: Math.max(1, Math.min(config.queue?.limit ?? DEFAULT_QUEUE.limit, 20)),
    },
    actions: config.actions ?? [],
  };
}

export function buildStubConfig(entityId?: string): NodaliaMediaPlayerConfig {
  const fallback = entityId ?? "media_player.example";
  return {
    type: "custom:nodalia-media-player",
    entities: [fallback],
  };
}
