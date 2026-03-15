export interface HassEntityAttributeBase {
  friendly_name?: string;
  icon?: string;
  entity_picture?: string;
  entity_picture_local?: string;
  supported_features?: number;
  media_title?: string;
  media_artist?: string;
  media_album_name?: string;
  media_content_id?: string;
  media_content_type?: string;
  media_duration?: number;
  media_position?: number;
  media_position_updated_at?: string;
  app_name?: string;
  source?: string;
  source_list?: string[];
  sound_mode?: string;
  sound_mode_list?: string[];
  volume_level?: number;
  is_volume_muted?: boolean;
  shuffle?: boolean;
  repeat?: string;
  group_members?: string[];
  active_queue?: string;
  [key: string]: unknown;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: HassEntityAttributeBase;
  last_changed?: string;
  last_updated?: string;
}

export interface HomeAssistant {
  language?: string;
  states: Record<string, HassEntity>;
  config?: {
    external_url?: string | null;
    internal_url?: string | null;
  };
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
  ): Promise<void>;
  callWS?<T>(message: unknown): Promise<T>;
  connection?: {
    sendMessagePromise<T>(message: unknown): Promise<T>;
  };
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}
