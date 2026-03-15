const haBase =
  customElements.get("ha-panel-lovelace") ||
  customElements.get("home-assistant") ||
  customElements.get("hui-masonry-view");

if (!haBase) {
  throw new Error("Nodalia Media Player could not find Home Assistant base elements.");
}

const LitElement = Object.getPrototypeOf(haBase);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const CARD_TAG = "nodalia-media-player";
const EDITOR_TAG = "nodalia-media-player-editor";

const FEATURE_PAUSE = 1;
const FEATURE_SEEK = 2;
const FEATURE_VOLUME_SET = 4;
const FEATURE_VOLUME_MUTE = 8;
const FEATURE_PREVIOUS_TRACK = 16;
const FEATURE_NEXT_TRACK = 32;
const FEATURE_TURN_ON = 128;
const FEATURE_TURN_OFF = 256;
const FEATURE_SELECT_SOURCE = 2048;
const FEATURE_PLAY = 16384;
const FEATURE_GROUPING = 524288;

const TRANSLATIONS = {
  es: {
    common: {
      unavailable: "No disponible",
      noEntities: "No hay entidades configuradas.",
      noQueue: "La cola esta vacia o mass_queue no esta disponible.",
      state: "Estado",
      playing: "Reproduciendo",
      paused: "En pausa",
      idle: "En reposo",
      off: "Apagado",
      standby: "En espera",
      buffering: "Cargando",
      unknown: "Desconocido",
      moreInfo: "Mas informacion",
      volume: "Volumen",
      sources: "Fuentes",
      queue: "Cola",
      details: "Detalles",
      shortcuts: "Acciones",
      group: "Grupo",
      clear: "Vaciar",
      ungroupAll: "Separar todo",
      remove: "Quitar",
      power: "Encender o apagar",
      mute: "Silenciar",
      unmute: "Activar sonido",
      previous: "Anterior",
      play: "Reproducir",
      pause: "Pausar",
      next: "Siguiente",
      seek: "Mover reproduccion",
      currentSource: "Fuente actual",
      activeEntity: "Entidad activa",
      openQueueItem: "Reproducir elemento de la cola",
      toggleDetails: "Mostrar u ocultar detalles",
      configure: "Configura la tarjeta",
      app: "Aplicacion",
      album: "Album",
      artist: "Artista",
      soundMode: "Modo de sonido",
      groupedPlayers: "Reproductores agrupados",
      queueSoon: "Siguiente en cola",
      favorite: "Favorito",
      musicAssistant: "Music Assistant",
      device: "Dispositivo",
      sourceEntity: "Entidad de reproduccion",
      loading: "Cargando...",
      name: "Nombre",
      card: "Tarjeta",
      blurBackground: "Difuminar fondo",
      theme: "Tema",
      fit: "Ajuste",
      language: "Idioma",
    },
    editor: {
      title: "Nodalia Media Player",
      players: "Reproductores",
      playersHint:
        "Una entidad por linea. Formato opcional: entidad | nombre | icono | volumen_entidad | entidad_ma | color.",
      name: "Nombre de la tarjeta",
      language: "Idioma",
      languageAuto: "Automatico",
      appearance: "Apariencia",
      accentColor: "Color de acento",
      artworkFit: "Ajuste de caratula",
      theme: "Modo visual",
      blurBackground: "Difuminar fondo",
      behavior: "Comportamiento",
      autoSelect: "Cambiar a la entidad activa automaticamente",
      collapseWhenIdle: "Contraer en reposo",
      showTimestamps: "Mostrar tiempos",
      showVolume: "Mostrar volumen",
      showSources: "Mostrar fuentes",
      showGroupControls: "Mostrar agrupacion rapida",
      showExpandedByDefault: "Abrir detalles por defecto",
      showDetails: "Mostrar seccion de detalles",
      enableSeek: "Permitir seek",
      queueEnabled: "Mostrar cola si mass_queue esta disponible",
      queueLimit: "Elementos de cola",
      actions: "Acciones avanzadas",
      actionsHint:
        "JSON opcional para chips de accion. Usa {{ entity }}, {{ media_title }} o {{ media_artist }} en service_data.",
      actionsError: "El JSON de acciones no es valido.",
      fitCover: "Cubrir",
      fitContain: "Contener",
      themeAuto: "Automatico",
      themeLight: "Claro",
      themeDark: "Oscuro",
    },
  },
  en: {
    common: {
      unavailable: "Unavailable",
      noEntities: "No entities are configured.",
      noQueue: "Queue is empty or mass_queue is not available.",
      state: "State",
      playing: "Playing",
      paused: "Paused",
      idle: "Idle",
      off: "Off",
      standby: "Standby",
      buffering: "Buffering",
      unknown: "Unknown",
      moreInfo: "More info",
      volume: "Volume",
      sources: "Sources",
      queue: "Queue",
      details: "Details",
      shortcuts: "Shortcuts",
      group: "Group",
      clear: "Clear",
      ungroupAll: "Ungroup all",
      remove: "Remove",
      power: "Power",
      mute: "Mute",
      unmute: "Unmute",
      previous: "Previous",
      play: "Play",
      pause: "Pause",
      next: "Next",
      seek: "Seek",
      currentSource: "Current source",
      activeEntity: "Active entity",
      openQueueItem: "Play queue item",
      toggleDetails: "Show or hide details",
      configure: "Configure the card",
      app: "App",
      album: "Album",
      artist: "Artist",
      soundMode: "Sound mode",
      groupedPlayers: "Grouped players",
      queueSoon: "Up next",
      favorite: "Favorite",
      musicAssistant: "Music Assistant",
      device: "Device",
      sourceEntity: "Playback entity",
      loading: "Loading...",
      name: "Name",
      card: "Card",
      blurBackground: "Blur background",
      theme: "Theme",
      fit: "Fit",
      language: "Language",
    },
    editor: {
      title: "Nodalia Media Player",
      players: "Players",
      playersHint:
        "One entity per line. Optional format: entity | name | icon | volume_entity | ma_entity | color.",
      name: "Card name",
      language: "Language",
      languageAuto: "Automatic",
      appearance: "Appearance",
      accentColor: "Accent color",
      artworkFit: "Artwork fit",
      theme: "Visual mode",
      blurBackground: "Blur background",
      behavior: "Behavior",
      autoSelect: "Auto-select the active entity",
      collapseWhenIdle: "Collapse while idle",
      showTimestamps: "Show timestamps",
      showVolume: "Show volume",
      showSources: "Show sources",
      showGroupControls: "Show quick grouping",
      showExpandedByDefault: "Open details by default",
      showDetails: "Show details section",
      enableSeek: "Allow seek",
      queueEnabled: "Show queue if mass_queue is available",
      queueLimit: "Queue items",
      actions: "Advanced actions",
      actionsHint:
        "Optional JSON for action chips. Use {{ entity }}, {{ media_title }} or {{ media_artist }} inside service_data.",
      actionsError: "Actions JSON is not valid.",
      fitCover: "Cover",
      fitContain: "Contain",
      themeAuto: "Automatic",
      themeLight: "Light",
      themeDark: "Dark",
    },
  },
};

const DEFAULT_APPEARANCE = {
  artwork_fit: "cover",
  theme: "auto",
  accent_color: "var(--primary-text-color)",
  blur_background: false,
};

const LEGACY_DEFAULT_ACCENT = "var(--state-media-player-active-color, var(--primary-color))";

const DEFAULT_BEHAVIOR = {
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

const DEFAULT_QUEUE = {
  enabled: true,
  limit: 5,
};

function getPathValue(source, path) {
  return path.split(".").reduce((value, key) => {
    if (value && typeof value === "object" && key in value) {
      return value[key];
    }
    return undefined;
  }, source);
}

function resolveLanguage(hass, configLanguage) {
  if (configLanguage && configLanguage !== "auto") {
    return configLanguage;
  }
  const language = (hass && hass.language ? hass.language : "es")
    .toLowerCase()
    .split("-")[0];
  if (language === "en") {
    return "en";
  }
  return "es";
}

function localize(key, hass, configLanguage) {
  const lang = resolveLanguage(hass, configLanguage);
  return (
    getPathValue(TRANSLATIONS[lang], key) ||
    getPathValue(TRANSLATIONS.es, key) ||
    getPathValue(TRANSLATIONS.en, key) ||
    key
  );
}

function fireEvent(node, type, detail, options) {
  node.dispatchEvent(
    new CustomEvent(type, {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail,
      ...(options || {}),
    }),
  );
}

function supportsFeature(entity, feature) {
  if (!entity || typeof entity.attributes.supported_features !== "number") {
    return false;
  }
  return (entity.attributes.supported_features & feature) !== 0;
}

function normalizeEntity(entity) {
  if (typeof entity === "string") {
    return { entity };
  }
  return {
    ...entity,
    hide_controls: Array.isArray(entity.hide_controls) ? entity.hide_controls : [],
  };
}

function normalizeConfig(config) {
  const rawEntities = Array.isArray(config.entities) && config.entities.length
    ? config.entities
    : config.entity
      ? [config.entity]
      : [];
  const entities = rawEntities.map(normalizeEntity).filter((item) => item.entity);

  if (!entities.length) {
    throw new Error("You need to define at least one media player entity.");
  }

  const accentWasLegacy =
    !config.appearance ||
    !config.appearance.accent_color ||
    config.appearance.accent_color === LEGACY_DEFAULT_ACCENT;
  const appearance = {
    ...DEFAULT_APPEARANCE,
    ...(config.appearance || {}),
    accent_color: accentWasLegacy
      ? DEFAULT_APPEARANCE.accent_color
      : config.appearance && config.appearance.accent_color
        ? config.appearance.accent_color
        : DEFAULT_APPEARANCE.accent_color,
    blur_background:
      accentWasLegacy &&
      config.appearance &&
      config.appearance.blur_background === true
        ? DEFAULT_APPEARANCE.blur_background
        : config.appearance &&
            typeof config.appearance.blur_background === "boolean"
          ? config.appearance.blur_background
          : DEFAULT_APPEARANCE.blur_background,
  };

  return {
    ...config,
    type: "custom:nodalia-media-player",
    language: config.language || "auto",
    entities,
    appearance,
    behavior: {
      ...DEFAULT_BEHAVIOR,
      ...(config.behavior || {}),
    },
    queue: {
      ...DEFAULT_QUEUE,
      ...(config.queue || {}),
      limit: Math.max(
        1,
        Math.min(
          Number((config.queue && config.queue.limit) || DEFAULT_QUEUE.limit),
          20,
        ),
      ),
    },
    actions: Array.isArray(config.actions) ? config.actions : [],
  };
}

function buildStubConfig(entityId) {
  return {
    type: "custom:nodalia-media-player",
    entities: [entityId || "media_player.example"],
  };
}

function resolveEntries(hass, entities) {
  return entities.map((config) => {
    const deviceStateObj = hass && hass.states ? hass.states[config.entity] : undefined;
    const musicAssistantStateObj =
      hass && hass.states && config.music_assistant_entity
        ? hass.states[config.music_assistant_entity]
        : undefined;
    const preferredCompanion =
      typeof config.prefer_music_assistant === "boolean"
        ? config.prefer_music_assistant
        : true;
    const stateObj = chooseDisplayState(
      deviceStateObj,
      musicAssistantStateObj,
      preferredCompanion,
    );
    const displayOrigin =
      stateObj &&
      musicAssistantStateObj &&
      stateObj.entity_id === musicAssistantStateObj.entity_id
        ? "music_assistant"
        : "entity";
    const playbackStateObj = stateObj || deviceStateObj || musicAssistantStateObj;
    const playbackEntityId =
      (playbackStateObj && playbackStateObj.entity_id) ||
      config.music_assistant_entity ||
      config.entity;
    const sourceStateObj = deviceStateObj || playbackStateObj;
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
      groupEntityId:
        (groupStateObj && groupStateObj.entity_id) || playbackEntityId,
      displayOrigin,
      volumeStateObj:
        hass && hass.states
          ? hass.states[config.volume_entity || config.entity] ||
            deviceStateObj ||
            playbackStateObj
          : undefined,
    };
  });
}

function hasUsableMedia(entity) {
  return Boolean(
    entity &&
      entity.attributes &&
      (entity.attributes.media_title ||
        entity.attributes.media_content_id ||
        entity.attributes.entity_picture ||
        entity.attributes.entity_picture_local),
  );
}

function displayScore(entity, preferred = false) {
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

function chooseDisplayState(deviceStateObj, musicAssistantStateObj, preferredCompanion = true) {
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

function pickGroupingState(playbackStateObj, musicAssistantStateObj, deviceStateObj) {
  return [playbackStateObj, musicAssistantStateObj, deviceStateObj].find(
    (entity) =>
      supportsFeature(entity, FEATURE_GROUPING) ||
      Array.isArray(entity && entity.attributes && entity.attributes.group_members),
  );
}

function friendlyName(entity, fallback) {
  return (
    (entity && entity.attributes && entity.attributes.friendly_name) ||
    fallback ||
    (entity ? entity.entity_id : "") ||
    ""
  );
}

function artworkForEntity(entity, override) {
  if (override) {
    return override;
  }
  if (!entity) {
    return "";
  }
  return entity.attributes.entity_picture_local || entity.attributes.entity_picture || "";
}

function iconForEntity(entity, override) {
  if (override) {
    return override;
  }
  if (entity && entity.attributes.icon) {
    return entity.attributes.icon;
  }
  return "mdi:play-circle-outline";
}

function isPlaying(entity) {
  return !!entity && entity.state === "playing";
}

function isSessionActive(entity) {
  return !!entity && ["playing", "paused", "buffering"].includes(entity.state);
}

function isIdleLike(entity) {
  return !entity || ["idle", "off", "standby", "unavailable", "unknown"].includes(entity.state);
}

function mediaTitle(entity) {
  return (
    (entity && entity.attributes.media_title) ||
    friendlyName(entity) ||
    (entity ? entity.entity_id : "") ||
    ""
  );
}

function mediaSubtitle(entity) {
  return (
    (entity && entity.attributes.media_artist) ||
    (entity && entity.attributes.media_album_name) ||
    (entity && entity.attributes.app_name) ||
    (entity && entity.attributes.source) ||
    ""
  );
}

function mediaSupportingText(entity) {
  if (!entity) {
    return "";
  }
  const parts = [
    entity.attributes.media_album_name,
    entity.attributes.source,
    entity.attributes.app_name,
  ].filter(Boolean);
  return [...new Set(parts)].join(" · ");
}

function buildStateLabel(entity) {
  return entity ? entity.state : "unknown";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatTime(totalSeconds) {
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

function currentMediaPosition(entity, now) {
  if (!entity) {
    return 0;
  }
  const basePosition =
    typeof entity.attributes.media_position === "number"
      ? entity.attributes.media_position
      : 0;
  if (entity.state !== "playing" || !entity.attributes.media_position_updated_at) {
    return basePosition;
  }
  const updated = new Date(entity.attributes.media_position_updated_at).getTime();
  if (Number.isNaN(updated)) {
    return basePosition;
  }
  return basePosition + Math.max(0, (now - updated) / 1000);
}

function parseEntityEditorText(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [entity, name, icon, volume_entity, maybeMusicAssistantOrColor, maybeColor] = line
        .split("|")
        .map((item) => item.trim());
      const result = { entity };
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

function serializeEntityEditorText(entities) {
  return entities
    .map((entity) => {
      const parts = [entity.entity, entity.name || "", entity.icon || "", entity.volume_entity || ""];
      if (entity.music_assistant_entity || entity.accent_color) {
        parts.push(entity.music_assistant_entity || "");
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

function parseActionEditorText(value) {
  if (!value.trim()) {
    return [];
  }
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error("Actions JSON must be an array.");
  }
  return parsed;
}

function visibilityMatches(visibility, entity) {
  if (!visibility || visibility === "always") {
    return true;
  }
  if (visibility === "playing") {
    return isPlaying(entity);
  }
  return isIdleLike(entity);
}

function placeholderContext(entity) {
  return {
    entity: entity ? entity.entity_id : "",
    media_title: String((entity && entity.attributes.media_title) || ""),
    media_artist: String((entity && entity.attributes.media_artist) || ""),
    media_album: String((entity && entity.attributes.media_album_name) || ""),
    source: String((entity && entity.attributes.source) || ""),
    app_name: String((entity && entity.attributes.app_name) || ""),
    friendly_name: friendlyName(entity),
  };
}

function interpolateString(value, context) {
  return value.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_match, key) => {
    return context[key] || "";
  });
}

function interpolateTemplate(value, context) {
  if (typeof value === "string") {
    return interpolateString(value, context);
  }
  if (Array.isArray(value)) {
    return value.map((item) => interpolateTemplate(item, context));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, interpolateTemplate(item, context)]),
    );
  }
  return value;
}

function normalizeGroupMembers(entity) {
  const members = Array.isArray(entity && entity.attributes.group_members)
    ? entity.attributes.group_members
    : [];
  return [...new Set([entity ? entity.entity_id : "", ...members].filter(Boolean))];
}

function queueItemTitle(item) {
  return item.name || item.media_title || item.title || "";
}

function queueItemSubtitle(item) {
  return item.artist || item.media_artist || "";
}

function queueItemImage(item) {
  return item.image || item.media_image_url || "";
}

function classes(map) {
  return Object.entries(map)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key)
    .join(" ");
}

async function callWS(hass, message) {
  if (typeof hass.callWS === "function") {
    return hass.callWS(message);
  }
  if (hass.connection && typeof hass.connection.sendMessagePromise === "function") {
    return hass.connection.sendMessagePromise(message);
  }
  throw new Error("Home Assistant websocket API is not available.");
}

async function fetchQueueItems(hass, entityId, limit) {
  const response = await callWS(hass, {
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
  return (response && response.response && response.response[entityId]) || [];
}

async function playQueueItem(hass, entityId, queueItemId) {
  await hass.callService("mass_queue", "play_queue_item", {
    entity: entityId,
    queue_item_id: queueItemId,
  });
}

async function removeQueueItem(hass, entityId, queueItemId) {
  await hass.callService("mass_queue", "remove_queue_item", {
    entity: entityId,
    queue_item_id: queueItemId,
  });
}

async function clearQueue(hass, entityId) {
  await hass.callService("media_player", "clear_playlist", {
    entity_id: entityId,
  });
}

const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    --nodalia-card-bg:
      color-mix(
        in srgb,
        var(--ha-card-background, var(--card-background-color)) 94%,
        var(--primary-text-color) 6%
      );
    --nodalia-card-bg-end:
      color-mix(
        in srgb,
        var(--ha-card-background, var(--card-background-color)) 90%,
        var(--primary-text-color) 10%
      );
    --nodalia-hero-bg:
      color-mix(
        in srgb,
        var(--ha-card-background, var(--card-background-color)) 90%,
        var(--primary-text-color) 10%
      );
    --nodalia-hero-bg-end:
      color-mix(
        in srgb,
        var(--ha-card-background, var(--card-background-color)) 86%,
        var(--primary-text-color) 14%
      );
    --nodalia-surface:
      color-mix(
        in srgb,
        var(--ha-card-background, var(--card-background-color)) 88%,
        var(--primary-text-color) 12%
      );
    --nodalia-surface-soft:
      color-mix(
        in srgb,
        var(--ha-card-background, var(--card-background-color)) 92%,
        var(--primary-text-color) 8%
      );
    --nodalia-chip-bg: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    --nodalia-control-bg: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    --nodalia-control-bg-strong:
      color-mix(in srgb, var(--primary-text-color) 14%, transparent);
    --nodalia-outline: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    --nodalia-outline-strong:
      color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    position: relative;
    overflow: hidden;
    border-radius: 26px;
    border: 1px solid var(--nodalia-outline);
    background:
      linear-gradient(
        180deg,
        var(--nodalia-card-bg),
        var(--nodalia-card-bg-end)
      );
    box-shadow: none;
  }

  ha-card.theme-dark {
    color-scheme: dark;
    --nodalia-card-bg: #24262d;
    --nodalia-card-bg-end: #202229;
    --nodalia-hero-bg: #2a2d34;
    --nodalia-hero-bg-end: #282b32;
    --nodalia-surface: #2e3138;
    --nodalia-surface-soft: #31343c;
    --nodalia-chip-bg: rgba(255, 255, 255, 0.06);
    --nodalia-control-bg: rgba(255, 255, 255, 0.07);
    --nodalia-control-bg-strong: rgba(255, 255, 255, 0.12);
    --nodalia-outline: rgba(255, 255, 255, 0.06);
    --nodalia-outline-strong: rgba(255, 255, 255, 0.1);
  }

  ha-card.theme-light {
    color-scheme: light;
    --nodalia-card-bg: #f6f7fb;
    --nodalia-card-bg-end: #eef1f7;
    --nodalia-hero-bg: #ffffff;
    --nodalia-hero-bg-end: #f3f5fa;
    --nodalia-surface: #ffffff;
    --nodalia-surface-soft: #eef1f7;
    --nodalia-chip-bg: rgba(15, 23, 42, 0.05);
    --nodalia-control-bg: rgba(15, 23, 42, 0.06);
    --nodalia-control-bg-strong: rgba(15, 23, 42, 0.1);
    --nodalia-outline: rgba(15, 23, 42, 0.08);
    --nodalia-outline-strong: rgba(15, 23, 42, 0.12);
  }

  .shell {
    position: relative;
    display: grid;
    gap: 8px;
    padding: 10px;
    color: var(--primary-text-color);
  }

  .hero {
    position: relative;
    display: block;
    padding: 14px;
    border-radius: 22px;
    overflow: hidden;
    background:
      linear-gradient(
        180deg,
        var(--nodalia-hero-bg),
        var(--nodalia-hero-bg-end)
      );
    border: 1px solid var(--nodalia-outline);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  }

  .hero-backdrop,
  .hero-veil {
    position: absolute;
    inset: 0;
  }

  .hero-backdrop {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.12;
    transform: scale(1.06);
  }

  .hero-backdrop.blur {
    filter: blur(36px) saturate(0.75);
  }

  .hero-veil {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 34%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.01), rgba(0, 0, 0, 0.12));
  }

  .hero > *:not(.hero-backdrop):not(.hero-veil) {
    position: relative;
    z-index: 1;
  }

  .hero-layout {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 12px;
    align-items: center;
  }

  .artwork-button {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--nodalia-outline-strong);
    border-radius: 20px;
    background: var(--nodalia-surface);
    box-shadow: none;
    cursor: pointer;
  }

  .artwork-button img {
    width: 100%;
    height: 100%;
  }

  .artwork-placeholder {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--nodalia-surface-soft) 82%, var(--primary-text-color) 18%),
        var(--nodalia-surface)
      );
  }

  .artwork-placeholder ha-icon {
    --mdc-icon-size: 30px;
    opacity: 0.82;
  }

  .hero-copy {
    min-width: 0;
    display: grid;
    gap: 8px;
  }

  .hero-topline {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .hero-title {
    margin: 0;
    font-size: 1.18rem;
    line-height: 1.08;
    font-weight: 700;
    letter-spacing: -0.02em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hero-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
  }

  .hero-heading-copy {
    min-width: 0;
    display: grid;
    gap: 3px;
  }

  .hero-subtitle,
  .hero-supporting {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hero-subtitle {
    color: var(--primary-text-color);
    opacity: 0.92;
    font-size: 1rem;
    font-weight: 500;
  }

  .hero-supporting {
    color: var(--secondary-text-color);
    font-size: 0.82rem;
  }

  .hero-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.34rem 0.72rem;
    border: 1px solid var(--nodalia-outline);
    border-radius: 999px;
    font-size: 0.72rem;
    line-height: 1;
    font-weight: 700;
    letter-spacing: 0.02em;
    background: var(--nodalia-chip-bg);
  }

  .hero-chip.state-playing {
    background:
      color-mix(in srgb, var(--nodalia-accent) 12%, var(--nodalia-chip-bg));
    border-color:
      color-mix(in srgb, var(--nodalia-accent) 18%, var(--nodalia-outline));
  }

  .hero-chip.state-paused,
  .hero-chip.state-buffering {
    background: var(--nodalia-control-bg);
  }

  .hero-chip.accent {
    background:
      color-mix(in srgb, var(--nodalia-accent) 9%, var(--nodalia-chip-bg));
    border-color:
      color-mix(in srgb, var(--nodalia-accent) 14%, var(--nodalia-outline));
  }

  .hero-progress {
    display: grid;
    gap: 5px;
  }

  .hero-progress-track {
    width: 100%;
    height: 4px;
    overflow: hidden;
    border-radius: 999px;
    background: var(--nodalia-control-bg);
  }

  .hero-progress-fill {
    height: 100%;
    border-radius: inherit;
    background: color-mix(in srgb, var(--nodalia-accent) 76%, white 24%);
  }

  .hero-times {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    color: var(--secondary-text-color);
    font-size: 0.74rem;
  }

  .hero-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
  }

  .hero-controls,
  .hero-actions-inline {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .hero-actions-inline {
    justify-content: flex-end;
  }

  .hero-ghost {
    position: absolute;
    right: 6px;
    bottom: 8px;
    display: grid;
    place-items: center;
    width: 92px;
    height: 92px;
    opacity: 0.07;
    pointer-events: none;
  }

  .hero-ghost-artwork {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.45);
  }

  .hero-ghost-icon {
    --mdc-icon-size: 64px;
  }

  .icon-button,
  .action-chip,
  .entity-chip,
  .source-chip,
  .group-chip,
  .queue-clear {
    font: inherit;
  }

  .icon-button {
    display: inline-grid;
    place-items: center;
    width: 38px;
    height: 38px;
    padding: 0;
    border: 1px solid var(--nodalia-outline);
    border-radius: 50%;
    background: var(--nodalia-control-bg);
    color: inherit;
    cursor: pointer;
    transition:
      transform 0.18s ease,
      background 0.18s ease,
      border-color 0.18s ease;
  }

  .icon-button:hover,
  .action-chip:hover,
  .entity-chip:hover,
  .source-chip:hover,
  .group-chip:hover,
  .queue-row:hover,
  .queue-item-main:hover {
    transform: translateY(-1px);
  }

  .icon-button.primary {
    background:
      color-mix(in srgb, var(--nodalia-accent) 12%, var(--nodalia-control-bg-strong));
    border-color:
      color-mix(in srgb, var(--nodalia-accent) 18%, var(--nodalia-outline));
  }

  .icon-button.subtle {
    background: var(--nodalia-control-bg);
  }

  .icon-button.small {
    width: 36px;
    height: 36px;
  }

  .icon-button ha-icon {
    --mdc-icon-size: 18px;
  }

  .entity-row,
  .source-row,
  .shortcut-row,
  .group-row {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 0 2px 2px;
    scrollbar-width: none;
  }

  .entity-row::-webkit-scrollbar,
  .source-row::-webkit-scrollbar,
  .shortcut-row::-webkit-scrollbar,
  .group-row::-webkit-scrollbar {
    display: none;
  }

  .entity-chip,
  .source-chip,
  .group-chip,
  .action-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 36px;
    padding: 0.54rem 0.85rem;
    border: 1px solid transparent;
    border-radius: 999px;
    background: var(--nodalia-chip-bg);
    color: inherit;
    white-space: nowrap;
    cursor: pointer;
    transition:
      transform 0.18s ease,
      background 0.18s ease,
      border-color 0.18s ease,
      color 0.18s ease;
  }

  .entity-chip.selected,
  .source-chip.selected,
  .group-chip.joined {
    background:
      color-mix(in srgb, var(--nodalia-accent) 10%, var(--nodalia-chip-bg));
    border-color:
      color-mix(in srgb, var(--nodalia-accent) 16%, var(--nodalia-outline));
    box-shadow: none;
  }

  .entity-chip.playing::before,
  .group-chip.joined::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--nodalia-accent) 42%, white 58%);
  }

  .action-chip {
    background: var(--nodalia-control-bg);
    border-color: var(--nodalia-outline);
  }

  .chip-label,
  .source-label,
  .group-label,
  .action-label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .transport-shell,
  .slider-shell,
  .section {
    padding: 12px;
    border-radius: 18px;
    background: var(--nodalia-surface-soft);
    border: 1px solid var(--nodalia-outline);
  }

  .transport-shell {
    display: grid;
    gap: 14px;
  }

  .transport-header,
  .slider-header,
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .section-header h3,
  .transport-header h3 {
    margin: 0;
    font-size: 0.94rem;
    font-weight: 700;
  }

  .section-header p,
  .transport-header p {
    margin: 2px 0 0;
    color: var(--secondary-text-color);
    font-size: 0.8rem;
  }

  .transport-main {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 12px;
    align-items: center;
  }

  .transport-controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .play-button {
    width: 52px;
    height: 52px;
  }

  .play-button ha-icon {
    --mdc-icon-size: 24px;
  }

  .transport-side {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .slider-shell {
    display: grid;
    gap: 10px;
  }

  .slider-values {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    color: var(--secondary-text-color);
    font-size: 0.8rem;
  }

  input[type="range"] {
    width: 100%;
    margin: 0;
    accent-color: color-mix(in srgb, var(--nodalia-accent) 68%, white 32%);
  }

  .section {
    display: grid;
    gap: 12px;
  }

  .detail-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
  }

  .detail-card {
    display: grid;
    gap: 4px;
    padding: 12px;
    border: 1px solid var(--nodalia-outline);
    border-radius: 16px;
    background: var(--nodalia-control-bg);
  }

  .detail-label {
    color: var(--secondary-text-color);
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .detail-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
  }

  .queue-list {
    display: grid;
    gap: 10px;
  }

  .queue-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    align-items: center;
    padding: 9px;
    border: 1px solid transparent;
    border-radius: 16px;
    background: var(--nodalia-control-bg);
  }

  .queue-item-main {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 12px;
    align-items: center;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }

  .queue-row.playing {
    background:
      color-mix(in srgb, var(--nodalia-accent) 10%, var(--nodalia-control-bg));
    border-color:
      color-mix(in srgb, var(--nodalia-accent) 14%, var(--nodalia-outline));
  }

  .queue-thumb {
    width: 48px;
    height: 48px;
    overflow: hidden;
    border-radius: 14px;
    background: var(--nodalia-surface);
  }

  .queue-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .queue-meta {
    min-width: 0;
    display: grid;
    gap: 4px;
  }

  .queue-title,
  .queue-subtitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .queue-title {
    font-weight: 600;
  }

  .queue-subtitle {
    color: var(--secondary-text-color);
    font-size: 0.82rem;
  }

  .queue-row .icon-button {
    width: 34px;
    height: 34px;
  }

  .queue-empty,
  .queue-loading,
  .notice {
    color: var(--secondary-text-color);
    font-size: 0.88rem;
  }

  .queue-clear {
    padding: 0.46rem 0.76rem;
    border: 1px solid var(--nodalia-outline);
    border-radius: 999px;
    background: var(--nodalia-chip-bg);
    color: inherit;
    cursor: pointer;
  }

  .details-toggle {
    background: transparent;
  }

  .collapsed .hero {
    padding: 13px;
  }

  .collapsed .artwork-button {
    width: 68px;
    height: 68px;
    border-radius: 18px;
  }

  .collapsed .hero-title {
    font-size: 1.08rem;
  }

  .notice {
    padding: 16px;
  }

  @media (max-width: 640px) {
    .shell {
      padding: 9px;
    }

    .hero-layout {
      grid-template-columns: 68px minmax(0, 1fr);
      gap: 10px;
    }

    .artwork-button {
      width: 68px;
      height: 68px;
      border-radius: 18px;
    }

    .hero-title {
      font-size: 1.08rem;
    }

    .hero-ghost {
      width: 82px;
      height: 82px;
    }
  }
`;

const editorStyles = css`
  :host {
    display: block;
    padding: 12px 0 0;
    color: var(--primary-text-color);
  }

  .editor {
    display: grid;
    gap: 18px;
  }

  .section {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 20px;
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
  }

  .section h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
  }

  .hint {
    margin: 0;
    color: var(--secondary-text-color);
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  }

  label {
    display: grid;
    gap: 6px;
    font-size: 0.9rem;
  }

  input,
  textarea,
  select {
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem 0.9rem;
    border: 1px solid var(--divider-color);
    border-radius: 14px;
    background: var(--card-background-color, var(--secondary-background-color));
    color: inherit;
    font: inherit;
  }

  textarea {
    min-height: 118px;
    resize: vertical;
  }

  .toggle-grid {
    display: grid;
    gap: 10px;
  }

  .toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.75rem 0.9rem;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
  }

  .toggle input {
    width: auto;
    margin: 0;
  }

  .error {
    color: var(--error-color);
    font-size: 0.85rem;
  }
`;

class NodaliaMediaPlayerEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: { state: true },
      _rawConfig: { state: true },
      _entitiesText: { state: true },
      _actionsText: { state: true },
      _actionsError: { state: true },
    };
  }

  static get styles() {
    return editorStyles;
  }

  constructor() {
    super();
    this.hass = undefined;
    this._config = undefined;
    this._rawConfig = undefined;
    this._entitiesText = "";
    this._actionsText = "";
    this._actionsError = "";
  }

  setConfig(config) {
    const candidate = config || {};
    const typed =
      (candidate.entities && candidate.entities.length) || candidate.entity
        ? candidate
        : buildStubConfig();
    this._rawConfig = typed;
    this._config = normalizeConfig(typed);
    this._entitiesText = serializeEntityEditorText(this._config.entities);
    this._actionsText = this._config.actions.length
      ? JSON.stringify(this._config.actions, null, 2)
      : "";
    this._actionsError = "";
  }

  _t(key) {
    return localize(key, this.hass, this._config ? this._config.language : "auto");
  }

  _emitConfig(config) {
    this._rawConfig = config;
    this._config = normalizeConfig(config);
    fireEvent(this, "config-changed", { config });
  }

  _updateRoot(key, value) {
    if (!this._rawConfig) {
      return;
    }
    this._emitConfig({
      ...this._rawConfig,
      [key]: value,
    });
  }

  _updateAppearance(key, value) {
    if (!this._rawConfig) {
      return;
    }
    this._emitConfig({
      ...this._rawConfig,
      appearance: {
        ...(this._rawConfig.appearance || {}),
        [key]: value,
      },
    });
  }

  _updateBehavior(key, value) {
    if (!this._rawConfig) {
      return;
    }
    this._emitConfig({
      ...this._rawConfig,
      behavior: {
        ...(this._rawConfig.behavior || {}),
        [key]: value,
      },
    });
  }

  _updateQueue(limit, enabled) {
    if (!this._rawConfig) {
      return;
    }
    this._emitConfig({
      ...this._rawConfig,
      queue: {
        ...(this._rawConfig.queue || {}),
        ...(typeof enabled === "boolean" ? { enabled } : {}),
        ...(typeof limit === "number" && !Number.isNaN(limit) ? { limit } : {}),
      },
    });
  }

  _onEntitiesInput(value) {
    this._entitiesText = value;
    const entities = parseEntityEditorText(value);
    if (!entities.length || !this._rawConfig) {
      return;
    }
    this._emitConfig({
      ...this._rawConfig,
      entities,
    });
  }

  _onActionsInput(value) {
    this._actionsText = value;
    if (!this._rawConfig) {
      return;
    }
    try {
      const actions = parseActionEditorText(value);
      this._actionsError = "";
      this._emitConfig({
        ...this._rawConfig,
        actions,
      });
    } catch (_error) {
      this._actionsError = value.trim() ? this._t("editor.actionsError") : "";
      if (!value.trim()) {
        this._actionsError = "";
        this._emitConfig({
          ...this._rawConfig,
          actions: [],
        });
      }
    }
  }

  render() {
    if (!this._config) {
      return html``;
    }

    return html`
      <div class="editor">
        <section class="section">
          <h3>${this._t("editor.players")}</h3>
          <p class="hint">${this._t("editor.playersHint")}</p>
          <label>
            <span>${this._t("editor.name")}</span>
            <input
              .value=${this._config.name || ""}
              @input=${(event) => this._updateRoot("name", event.currentTarget.value)}
            />
          </label>
          <label>
            <span>${this._t("editor.players")}</span>
            <textarea
              .value=${this._entitiesText}
              @input=${(event) => this._onEntitiesInput(event.currentTarget.value)}
            ></textarea>
          </label>
        </section>

        <section class="section">
          <h3>${this._t("editor.appearance")}</h3>
          <div class="grid">
            <label>
              <span>${this._t("editor.language")}</span>
              <select
                .value=${this._config.language || "auto"}
                @change=${(event) => this._updateRoot("language", event.currentTarget.value)}
              >
                <option value="auto">${this._t("editor.languageAuto")}</option>
                <option value="es">Espanol</option>
                <option value="en">English</option>
              </select>
            </label>
            <label>
              <span>${this._t("editor.accentColor")}</span>
              <input
                .value=${this._config.appearance.accent_color}
                @input=${(event) =>
                  this._updateAppearance("accent_color", event.currentTarget.value)}
              />
            </label>
            <label>
              <span>${this._t("editor.artworkFit")}</span>
              <select
                .value=${this._config.appearance.artwork_fit}
                @change=${(event) =>
                  this._updateAppearance("artwork_fit", event.currentTarget.value)}
              >
                <option value="cover">${this._t("editor.fitCover")}</option>
                <option value="contain">${this._t("editor.fitContain")}</option>
              </select>
            </label>
            <label>
              <span>${this._t("editor.theme")}</span>
              <select
                .value=${this._config.appearance.theme}
                @change=${(event) => this._updateAppearance("theme", event.currentTarget.value)}
              >
                <option value="auto">${this._t("editor.themeAuto")}</option>
                <option value="light">${this._t("editor.themeLight")}</option>
                <option value="dark">${this._t("editor.themeDark")}</option>
              </select>
            </label>
          </div>
          <div class="toggle-grid">
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${Boolean(this._config.appearance.blur_background)}
                @change=${(event) =>
                  this._updateAppearance("blur_background", event.currentTarget.checked)}
              />
              <span>${this._t("editor.blurBackground")}</span>
            </label>
          </div>
        </section>

        <section class="section">
          <h3>${this._t("editor.behavior")}</h3>
          <div class="toggle-grid">
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${Boolean(this._config.behavior.auto_select_active)}
                @change=${(event) =>
                  this._updateBehavior("auto_select_active", event.currentTarget.checked)}
              />
              <span>${this._t("editor.autoSelect")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${Boolean(this._config.behavior.collapse_when_idle)}
                @change=${(event) =>
                  this._updateBehavior("collapse_when_idle", event.currentTarget.checked)}
              />
              <span>${this._t("editor.collapseWhenIdle")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${Boolean(this._config.behavior.expanded_by_default)}
                @change=${(event) =>
                  this._updateBehavior("expanded_by_default", event.currentTarget.checked)}
              />
              <span>${this._t("editor.showExpandedByDefault")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${Boolean(this._config.behavior.show_timestamps)}
                @change=${(event) =>
                  this._updateBehavior("show_timestamps", event.currentTarget.checked)}
              />
              <span>${this._t("editor.showTimestamps")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${Boolean(this._config.behavior.show_volume)}
                @change=${(event) =>
                  this._updateBehavior("show_volume", event.currentTarget.checked)}
              />
              <span>${this._t("editor.showVolume")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${Boolean(this._config.behavior.show_sources)}
                @change=${(event) =>
                  this._updateBehavior("show_sources", event.currentTarget.checked)}
              />
              <span>${this._t("editor.showSources")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${Boolean(this._config.behavior.show_group_controls)}
                @change=${(event) =>
                  this._updateBehavior("show_group_controls", event.currentTarget.checked)}
              />
              <span>${this._t("editor.showGroupControls")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${Boolean(this._config.behavior.show_details)}
                @change=${(event) =>
                  this._updateBehavior("show_details", event.currentTarget.checked)}
              />
              <span>${this._t("editor.showDetails")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${Boolean(this._config.behavior.enable_seek)}
                @change=${(event) =>
                  this._updateBehavior("enable_seek", event.currentTarget.checked)}
              />
              <span>${this._t("editor.enableSeek")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${Boolean(this._config.queue.enabled)}
                @change=${(event) =>
                  this._updateQueue(undefined, event.currentTarget.checked)}
              />
              <span>${this._t("editor.queueEnabled")}</span>
            </label>
          </div>
          <div class="grid">
            <label>
              <span>${this._t("editor.queueLimit")}</span>
              <input
                type="number"
                min="1"
                max="20"
                .value=${String(this._config.queue.limit)}
                @input=${(event) =>
                  this._updateQueue(Number(event.currentTarget.value), undefined)}
              />
            </label>
          </div>
        </section>

        <section class="section">
          <h3>${this._t("editor.actions")}</h3>
          <p class="hint">${this._t("editor.actionsHint")}</p>
          <textarea
            .value=${this._actionsText}
            @input=${(event) => this._onActionsInput(event.currentTarget.value)}
          ></textarea>
          ${this._actionsError ? html`<div class="error">${this._actionsError}</div>` : html``}
        </section>
      </div>
    `;
  }
}

class NodaliaMediaPlayer extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: { state: true },
      _selectedEntityId: { state: true },
      _detailsOpen: { state: true },
      _draftSeek: { state: true },
      _draftVolume: { state: true },
      _queueItems: { state: true },
      _queueLoading: { state: true },
      _queueAvailable: { state: true },
      _now: { state: true },
    };
  }

  static get styles() {
    return cardStyles;
  }

  static async getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }

  static getStubConfig(hass) {
    const firstEntity = Object.keys(hass.states || {}).find((entityId) =>
      entityId.startsWith("media_player."),
    );
    return buildStubConfig(firstEntity);
  }

  constructor() {
    super();
    this.hass = undefined;
    this._config = undefined;
    this._selectedEntityId = undefined;
    this._detailsOpen = false;
    this._draftSeek = undefined;
    this._draftVolume = undefined;
    this._queueItems = [];
    this._queueLoading = false;
    this._queueAvailable = undefined;
    this._now = Date.now();
    this._progressTicker = undefined;
    this._queueTicker = undefined;
    this._lastQueueSignature = "";
  }

  setConfig(config) {
    this._config = normalizeConfig(config);
    this._detailsOpen = this._config.behavior.expanded_by_default;
  }

  getCardSize() {
    return this._detailsOpen ? 7 : 3;
  }

  updated(changedProperties) {
    if (!this._config) {
      return;
    }

    if (changedProperties.has("hass") || changedProperties.has("_config")) {
      const nextSelected = this._pickSelectedEntityId();
      if (nextSelected && nextSelected !== this._selectedEntityId) {
        this._selectedEntityId = nextSelected;
        return;
      }
    }

    if (changedProperties.has("_selectedEntityId")) {
      this._draftSeek = undefined;
      this._draftVolume = undefined;
      this._queueAvailable = undefined;
      this._queueItems = [];
    }

    this._syncProgressTicker();
    this._syncQueueTicker();

    const queueSignature = this._queueSignature();
    if (queueSignature !== this._lastQueueSignature) {
      this._lastQueueSignature = queueSignature;
      this._refreshQueue();
    }
  }

  disconnectedCallback() {
    this._clearProgressTicker();
    this._clearQueueTicker();
    super.disconnectedCallback();
  }

  _t(key) {
    return localize(key, this.hass, this._config ? this._config.language : "auto");
  }

  _entries() {
    return this._config ? resolveEntries(this.hass, this._config.entities) : [];
  }

  _pickSelectedEntityId() {
    const entries = this._entries();
    if (!entries.length) {
      return undefined;
    }

    const currentSelection = entries.find((entry) => entry.entityId === this._selectedEntityId);
    const playingEntry = entries.find((entry) => isPlaying(entry.stateObj));
    const activeEntry = entries.find((entry) => isSessionActive(entry.stateObj));

    if (!currentSelection) {
      return (
        (playingEntry && playingEntry.entityId) ||
        (activeEntry && activeEntry.entityId) ||
        entries[0].entityId
      );
    }

    if (
      this._config.behavior.auto_select_active &&
      isIdleLike(currentSelection.stateObj) &&
      playingEntry
    ) {
      return playingEntry.entityId;
    }

    return currentSelection.entityId;
  }

  _activeEntry(entries) {
    const resolved = entries || this._entries();
    return resolved.find((entry) => entry.entityId === this._selectedEntityId) || resolved[0];
  }

  _queueSignature() {
    const active = this._activeEntry();
    if (
      !this._config ||
      !this._config.queue.enabled ||
      !active ||
      !active.playbackStateObj ||
      !isSessionActive(active.playbackStateObj)
    ) {
      return "";
    }
    return [
      active.playbackEntityId,
      active.playbackStateObj.state,
      active.playbackStateObj.attributes.media_content_id || "",
      this._config.queue.limit,
    ].join("|");
  }

  _syncProgressTicker() {
    const active = this._activeEntry();
    if (!active || !active.playbackStateObj || active.playbackStateObj.state !== "playing") {
      this._clearProgressTicker();
      return;
    }
    if (this._progressTicker) {
      return;
    }
    this._progressTicker = window.setInterval(() => {
      this._now = Date.now();
    }, 1000);
  }

  _clearProgressTicker() {
    if (this._progressTicker) {
      window.clearInterval(this._progressTicker);
      this._progressTicker = undefined;
    }
  }

  _syncQueueTicker() {
    const active = this._activeEntry();
    if (
      !this._config ||
      !this._config.queue.enabled ||
      this._queueAvailable === false ||
      !active ||
      !active.playbackStateObj ||
      !isSessionActive(active.playbackStateObj)
    ) {
      this._clearQueueTicker();
      return;
    }
    if (this._queueTicker) {
      return;
    }
    this._queueTicker = window.setInterval(() => {
      this._refreshQueue();
    }, 15000);
  }

  _clearQueueTicker() {
    if (this._queueTicker) {
      window.clearInterval(this._queueTicker);
      this._queueTicker = undefined;
    }
  }

  async _refreshQueue() {
    const active = this._activeEntry();
    if (
      !this.hass ||
      !this._config ||
      !this._config.queue.enabled ||
      !active ||
      !active.playbackStateObj ||
      !isSessionActive(active.playbackStateObj)
    ) {
      this._queueItems = [];
      this._queueLoading = false;
      return;
    }

    if (this._queueAvailable === false) {
      this._queueItems = [];
      return;
    }

    this._queueLoading = true;
    try {
      const items = await fetchQueueItems(
        this.hass,
        active.playbackEntityId,
        this._config.queue.limit,
      );
      const currentId = String(active.playbackStateObj.attributes.media_content_id || "");
      this._queueAvailable = true;
      this._queueItems = items.map((item) => ({
        ...item,
        playing: Boolean(item.playing) || String(item.media_content_id || "") === currentId,
      }));
    } catch (_error) {
      this._queueAvailable = false;
      this._queueItems = [];
    } finally {
      this._queueLoading = false;
    }
  }

  _stateLabel(entry) {
    const state = buildStateLabel(entry && entry.stateObj);
    switch (state) {
      case "playing":
        return this._t("common.playing");
      case "paused":
        return this._t("common.paused");
      case "idle":
        return this._t("common.idle");
      case "off":
        return this._t("common.off");
      case "standby":
        return this._t("common.standby");
      case "buffering":
        return this._t("common.buffering");
      case "unavailable":
        return this._t("common.unavailable");
      default:
        return state || this._t("common.unknown");
    }
  }

  _isHidden(entry, control) {
    return Array.isArray(entry.config.hide_controls) && entry.config.hide_controls.includes(control);
  }

  _displayState(entry) {
    return entry.playbackStateObj || entry.stateObj;
  }

  _deviceState(entry) {
    return entry.deviceStateObj || entry.stateObj;
  }

  _sourceState(entry) {
    return entry.sourceStateObj || this._deviceState(entry);
  }

  _groupState(entry) {
    return entry.groupStateObj || this._displayState(entry);
  }

  _selectEntity(entityId) {
    this._selectedEntityId = entityId;
  }

  _openMoreInfo(entityId) {
    fireEvent(this, "hass-more-info", { entityId });
  }

  async _togglePower(entry) {
    const deviceState = this._deviceState(entry);
    if (!this.hass || !entry || !deviceState) {
      return;
    }
    const service =
      deviceState.state === "off" || deviceState.state === "standby"
        ? "turn_on"
        : "turn_off";
    await this.hass.callService("media_player", service, { entity_id: entry.entityId });
  }

  async _togglePlayPause(entry) {
    const playbackState = this._displayState(entry);
    if (!this.hass || !entry || !playbackState) {
      return;
    }

    if (playbackState.state === "playing" && supportsFeature(playbackState, FEATURE_PAUSE)) {
      await this.hass.callService("media_player", "media_pause", {
        entity_id: entry.playbackEntityId,
      });
      return;
    }

    if (supportsFeature(playbackState, FEATURE_PLAY)) {
      await this.hass.callService("media_player", "media_play", {
        entity_id: entry.playbackEntityId,
      });
      return;
    }

    await this.hass.callService("media_player", "media_play_pause", {
      entity_id: entry.playbackEntityId,
    });
  }

  async _previousTrack(entry) {
    if (!this.hass) {
      return;
    }
    await this.hass.callService("media_player", "media_previous_track", {
      entity_id: entry.playbackEntityId,
    });
  }

  async _nextTrack(entry) {
    if (!this.hass) {
      return;
    }
    await this.hass.callService("media_player", "media_next_track", {
      entity_id: entry.playbackEntityId,
    });
  }

  async _toggleMute(entry) {
    if (!this.hass || !entry || !entry.volumeStateObj) {
      return;
    }
    await this.hass.callService("media_player", "volume_mute", {
      entity_id: entry.volumeStateObj.entity_id,
      is_volume_muted: !Boolean(entry.volumeStateObj.attributes.is_volume_muted),
    });
  }

  async _seek(entry, seconds) {
    if (!this.hass) {
      return;
    }
    await this.hass.callService("media_player", "media_seek", {
      entity_id: entry.playbackEntityId,
      seek_position: seconds,
    });
  }

  async _setVolume(entry, volumePercent) {
    if (!this.hass) {
      return;
    }
    const target = (entry.volumeStateObj && entry.volumeStateObj.entity_id) || entry.entityId;
    await this.hass.callService("media_player", "volume_set", {
      entity_id: target,
      volume_level: clamp(volumePercent / 100, 0, 1),
    });
  }

  async _selectSource(entry, source) {
    if (!this.hass) {
      return;
    }
    await this.hass.callService("media_player", "select_source", {
      entity_id: (this._sourceState(entry) && this._sourceState(entry).entity_id) || entry.entityId,
      source,
    });
  }

  async _toggleGroupMember(activeEntry, memberId) {
    const groupState = this._groupState(activeEntry);
    if (!this.hass || !activeEntry || !groupState || memberId === activeEntry.groupEntityId) {
      return;
    }
    const groupMembers = normalizeGroupMembers(groupState);
    if (groupMembers.includes(memberId)) {
      await this.hass.callService("media_player", "unjoin", { entity_id: memberId });
      return;
    }
    await this.hass.callService("media_player", "join", {
      entity_id: activeEntry.groupEntityId,
      group_members: [memberId],
    });
  }

  async _ungroupAll(activeEntry) {
    const groupState = this._groupState(activeEntry);
    if (!this.hass || !activeEntry || !groupState) {
      return;
    }
    const members = normalizeGroupMembers(groupState).filter(
      (memberId) => memberId !== activeEntry.groupEntityId,
    );
    await Promise.all(
      members.map((memberId) =>
        this.hass.callService("media_player", "unjoin", { entity_id: memberId }),
      ),
    );
  }

  async _triggerFavorite(entry) {
    if (!this.hass || !entry || !entry.config.favorite_service) {
      return;
    }
    const parts = entry.config.favorite_service.split(".");
    if (parts.length !== 2) {
      return;
    }
    const data = interpolateTemplate(
      entry.config.favorite_service_data || { entity_id: entry.playbackEntityId },
      placeholderContext(this._displayState(entry)),
    );
    await this.hass.callService(parts[0], parts[1], data);
  }

  async _runShortcut(shortcut, activeEntry) {
    if (!this.hass) {
      return;
    }

    const entityId =
      shortcut.entity && shortcut.entity !== "current"
        ? shortcut.entity
        : activeEntry.playbackEntityId;
    const entity =
      (this.hass.states && this.hass.states[entityId]) || this._displayState(activeEntry);
    const context = placeholderContext(entity);

    switch (shortcut.action) {
      case "call-service": {
        if (!shortcut.service) {
          return;
        }
        const parts = shortcut.service.split(".");
        if (parts.length !== 2) {
          return;
        }
        const serviceData = interpolateTemplate(
          shortcut.service_data || { entity_id: entityId },
          context,
        );
        if (entityId && !("entity_id" in serviceData)) {
          serviceData.entity_id = entityId;
        }
        await this.hass.callService(parts[0], parts[1], serviceData);
        return;
      }
      case "navigate": {
        const path = interpolateTemplate(shortcut.navigation_path || "", context);
        if (!path) {
          return;
        }
        window.history.pushState(null, "", path);
        fireEvent(window, "location-changed", { replace: false });
        return;
      }
      case "url": {
        const url = interpolateTemplate(shortcut.url_path || "", context);
        if (!url) {
          return;
        }
        window.open(url, shortcut.new_tab ? "_blank" : "_self");
        return;
      }
      case "more-info":
        this._openMoreInfo(entityId);
        return;
      case "toggle":
        await this.hass.callService(entityId.split(".")[0], "toggle", { entity_id: entityId });
        return;
      default:
        return;
    }
  }

  _renderIconButton(icon, label, onClick, className) {
    return html`
      <button class=${className || "icon-button"} title=${label} @click=${onClick}>
        <ha-icon .icon=${icon}></ha-icon>
      </button>
    `;
  }

  _renderHeroProgress(active) {
    const playbackState = this._displayState(active);
    if (!playbackState) {
      return html``;
    }
    const duration = Number(playbackState.attributes.media_duration || 0);
    if (!duration) {
      return html``;
    }
    const current = clamp(currentMediaPosition(playbackState, this._now), 0, duration);
    const width = `${(current / duration) * 100}%`;
    return html`
      <div class="hero-progress">
        <div class="hero-progress-track">
          <div class="hero-progress-fill" style=${`width:${width};`}></div>
        </div>
        ${this._config.behavior.show_timestamps
          ? html`
              <div class="hero-times">
                <span>${formatTime(current)}</span>
                <span>${formatTime(duration)}</span>
              </div>
            `
          : html``}
      </div>
    `;
  }

  _renderHeroTransport(active) {
    const playbackState = this._displayState(active);
    const deviceState = this._deviceState(active);
    if (!playbackState && !deviceState) {
      return html``;
    }

    const canPower =
      !this._isHidden(active, "power") &&
      !!deviceState &&
      (supportsFeature(deviceState, FEATURE_TURN_ON) ||
        supportsFeature(deviceState, FEATURE_TURN_OFF));
    const canPrevious =
      !this._isHidden(active, "previous") &&
      !!playbackState &&
      supportsFeature(playbackState, FEATURE_PREVIOUS_TRACK);
    const canNext =
      !this._isHidden(active, "next") &&
      !!playbackState &&
      supportsFeature(playbackState, FEATURE_NEXT_TRACK);
    const canMute =
      !this._isHidden(active, "mute") &&
      !!active.volumeStateObj &&
      supportsFeature(active.volumeStateObj, FEATURE_VOLUME_MUTE);
    const playIcon = playbackState && playbackState.state === "playing" ? "mdi:pause" : "mdi:play";
    const playLabel =
      playbackState && playbackState.state === "playing"
        ? this._t("common.pause")
        : this._t("common.play");

    return html`
      <div class="hero-bottom">
        <div class="hero-controls">
          ${canPower
            ? this._renderIconButton(
                deviceState && (deviceState.state === "off" || deviceState.state === "standby")
                  ? "mdi:power"
                  : "mdi:power-standby",
                this._t("common.power"),
                () => this._togglePower(active),
                "icon-button subtle small",
              )
            : html``}
          ${canPrevious
            ? this._renderIconButton(
                "mdi:skip-previous",
                this._t("common.previous"),
                () => this._previousTrack(active),
                "icon-button subtle small",
              )
            : html``}
          ${playbackState
            ? this._renderIconButton(
                playIcon,
                playLabel,
                () => this._togglePlayPause(active),
                "icon-button primary play-button",
              )
            : html``}
          ${canNext
            ? this._renderIconButton(
                "mdi:skip-next",
                this._t("common.next"),
                () => this._nextTrack(active),
                "icon-button subtle small",
              )
            : html``}
          ${canMute
            ? this._renderIconButton(
                active.volumeStateObj.attributes.is_volume_muted
                  ? "mdi:volume-off"
                  : "mdi:volume-high",
                active.volumeStateObj.attributes.is_volume_muted
                  ? this._t("common.unmute")
                  : this._t("common.mute"),
                () => this._toggleMute(active),
                "icon-button subtle small",
              )
            : html``}
        </div>
        <div class="hero-actions-inline">
          ${active.config.favorite_service
            ? this._renderIconButton(
                "mdi:heart-outline",
                this._t("common.favorite"),
                () => this._triggerFavorite(active),
                "icon-button subtle small",
              )
            : html``}
          ${this._renderIconButton(
            this._detailsOpen ? "mdi:chevron-up" : "mdi:chevron-down",
            this._t("common.toggleDetails"),
            () => {
              this._detailsOpen = !this._detailsOpen;
            },
            "icon-button subtle small",
          )}
          ${this._renderIconButton(
            "mdi:dots-horizontal",
            this._t("common.moreInfo"),
            () => this._openMoreInfo(active.playbackEntityId),
            "icon-button subtle small",
          )}
        </div>
      </div>
    `;
  }

  _renderHero(active) {
    const displayState = this._displayState(active);
    const deviceState = this._deviceState(active);
    const artwork = artworkForEntity(displayState, active.config.image);
    const title = displayState ? mediaTitle(displayState) : active.config.name || active.entityId;
    const subtitle = displayState
      ? mediaSubtitle(displayState) || friendlyName(displayState, active.config.name)
      : this._t("common.unavailable");
    const supporting = displayState
      ? mediaSupportingText(displayState) || friendlyName(deviceState, active.config.name)
      : active.entityId;
    const stateClass = `hero-chip state-${(displayState && displayState.state) || "unknown"}`;
    const backdropStyle = artwork ? `background-image:url("${artwork}")` : "";
    const blurClass = this._config.appearance.blur_background ? "hero-backdrop blur" : "hero-backdrop";
    const entityLabel = active.config.name || friendlyName(deviceState, active.entityId);

    return html`
      <section class="hero">
        ${artwork ? html`<div class=${blurClass} style=${backdropStyle}></div>` : html``}
        <div class="hero-veil"></div>
        <div class="hero-ghost">
          ${artwork
            ? html`<img class="hero-ghost-artwork" src=${artwork} alt="" />`
            : html`
                <ha-icon
                  class="hero-ghost-icon"
                  .icon=${iconForEntity(displayState, active.config.icon)}
                ></ha-icon>
              `}
        </div>

        <div class="hero-layout">
          <button
            class="artwork-button"
            title=${this._t("common.moreInfo")}
            @click=${() => this._openMoreInfo(active.playbackEntityId)}
          >
            ${artwork
              ? html`
                  <img
                    src=${artwork}
                    alt=${title}
                    style=${`object-fit:${this._config.appearance.artwork_fit};`}
                  />
                `
              : html`
                  <div class="artwork-placeholder">
                    <ha-icon .icon=${iconForEntity(displayState, active.config.icon)}></ha-icon>
                  </div>
                `}
          </button>

          <div class="hero-copy">
            <div class="hero-topline">
              <span class=${stateClass}>${this._stateLabel(active)}</span>
              <span class="hero-chip">${entityLabel}</span>
              ${active.displayOrigin === "music_assistant"
                ? html`<span class="hero-chip accent">${this._t("common.musicAssistant")}</span>`
                : html``}
            </div>
            <div class="hero-heading">
              <div class="hero-heading-copy">
                <h2 class="hero-title">${title}</h2>
                <p class="hero-subtitle">${subtitle}</p>
                <p class="hero-supporting">${supporting}</p>
              </div>
            </div>
            ${this._renderHeroProgress(active)}
            ${this._renderHeroTransport(active)}
          </div>
        </div>
      </section>
    `;
  }

  _renderEntityChips(entries, active) {
    if (entries.length <= 1) {
      return html``;
    }

    return html`
      <div class="entity-row">
        ${entries.map((entry) => {
          const label =
            entry.config.name ||
            friendlyName(entry.deviceStateObj || entry.stateObj, entry.entityId);
          return html`
            <button
              class=${classes({
                "entity-chip": true,
                selected: entry.entityId === active.entityId,
                playing: isPlaying(entry.stateObj),
              })}
              title=${label}
              @click=${() => this._selectEntity(entry.entityId)}
            >
              <ha-icon .icon=${iconForEntity(entry.stateObj, entry.config.icon)}></ha-icon>
              <span class="chip-label">${label}</span>
            </button>
          `;
        })}
      </div>
    `;
  }

  _renderProgress(active) {
    if (!this._detailsOpen) {
      return html``;
    }
    const playbackState = this._displayState(active);
    if (
      !playbackState ||
      this._isHidden(active, "seek") ||
      !this._config.behavior.enable_seek ||
      !supportsFeature(playbackState, FEATURE_SEEK)
    ) {
      return html``;
    }

    const duration = Number(playbackState.attributes.media_duration || 0);
    if (!duration) {
      return html``;
    }

    const current = clamp(
      this._draftSeek !== undefined
        ? this._draftSeek
        : currentMediaPosition(playbackState, this._now),
      0,
      duration,
    );

    return html`
      <div class="slider-shell">
        <div class="slider-header">
          <strong>${this._t("common.seek")}</strong>
          ${this._config.behavior.show_timestamps
            ? html`
                <div class="slider-values">
                  <span>${formatTime(current)}</span>
                  <span>${formatTime(duration)}</span>
                </div>
              `
            : html``}
        </div>
        <input
          type="range"
          min="0"
          max=${String(Math.floor(duration))}
          step="1"
          .value=${String(Math.floor(current))}
          @input=${(event) => {
            this._draftSeek = Number(event.currentTarget.value);
          }}
          @change=${(event) => this._seek(active, Number(event.currentTarget.value))}
        />
      </div>
    `;
  }

  _renderTransport(active) {
    if (!active.stateObj) {
      return html``;
    }

    const canPower =
      !this._isHidden(active, "power") &&
      (supportsFeature(active.stateObj, FEATURE_TURN_ON) ||
        supportsFeature(active.stateObj, FEATURE_TURN_OFF));
    const canPrevious =
      !this._isHidden(active, "previous") &&
      supportsFeature(active.stateObj, FEATURE_PREVIOUS_TRACK);
    const canNext =
      !this._isHidden(active, "next") &&
      supportsFeature(active.stateObj, FEATURE_NEXT_TRACK);
    const canMute =
      !this._isHidden(active, "mute") &&
      active.volumeStateObj &&
      supportsFeature(active.volumeStateObj, FEATURE_VOLUME_MUTE);

    const playIcon = active.stateObj.state === "playing" ? "mdi:pause" : "mdi:play";
    const playLabel =
      active.stateObj.state === "playing" ? this._t("common.pause") : this._t("common.play");

    return html`
      <section class="transport-shell">
        <div class="transport-header">
          <div>
            <h3>${this._t("common.activeEntity")}</h3>
            <p>${friendlyName(active.stateObj, active.config.name)}</p>
          </div>
        </div>
        <div class="transport-main">
          <div class="transport-side">
            ${canPower
              ? this._renderIconButton(
                  active.stateObj.state === "off" || active.stateObj.state === "standby"
                    ? "mdi:power"
                    : "mdi:power-standby",
                  this._t("common.power"),
                  () => this._togglePower(active),
                  "icon-button",
                )
              : html``}
          </div>
          <div class="transport-controls">
            ${canPrevious
              ? this._renderIconButton(
                  "mdi:skip-previous",
                  this._t("common.previous"),
                  () => this._previousTrack(active),
                  "icon-button",
                )
              : html``}
            ${this._renderIconButton(
              playIcon,
              playLabel,
              () => this._togglePlayPause(active),
              "icon-button primary play-button",
            )}
            ${canNext
              ? this._renderIconButton(
                  "mdi:skip-next",
                  this._t("common.next"),
                  () => this._nextTrack(active),
                  "icon-button",
                )
              : html``}
          </div>
          <div class="transport-side">
            ${canMute
              ? this._renderIconButton(
                  active.volumeStateObj.attributes.is_volume_muted
                    ? "mdi:volume-off"
                    : "mdi:volume-high",
                  active.volumeStateObj.attributes.is_volume_muted
                    ? this._t("common.unmute")
                    : this._t("common.mute"),
                  () => this._toggleMute(active),
                  "icon-button",
                )
              : html``}
          </div>
        </div>
      </section>
    `;
  }

  _renderVolume(active) {
    if (!this._detailsOpen) {
      return html``;
    }
    const volumeEntity = active.volumeStateObj;
    if (
      !this._config.behavior.show_volume ||
      !volumeEntity ||
      this._isHidden(active, "volume") ||
      !supportsFeature(volumeEntity, FEATURE_VOLUME_SET)
    ) {
      return html``;
    }

    const value = clamp(
      this._draftVolume !== undefined
        ? this._draftVolume
        : Math.round(Number(volumeEntity.attributes.volume_level || 0) * 100),
      0,
      100,
    );

    return html`
      <div class="slider-shell">
        <div class="slider-header">
          <strong>${this._t("common.volume")}</strong>
          <div class="slider-values">
            <span>${value}%</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          .value=${String(value)}
          @input=${(event) => {
            this._draftVolume = Number(event.currentTarget.value);
          }}
          @change=${(event) => this._setVolume(active, Number(event.currentTarget.value))}
        />
      </div>
    `;
  }

  _renderSources(active) {
    const sourceState = this._sourceState(active);
    const sources = sourceState ? sourceState.attributes.source_list : undefined;
    if (
      !this._config.behavior.show_sources ||
      !sourceState ||
      this._isHidden(active, "source") ||
      !supportsFeature(sourceState, FEATURE_SELECT_SOURCE) ||
      !Array.isArray(sources) ||
      !sources.length
    ) {
      return html``;
    }

    return html`
      <section class="section">
        <div class="section-header">
          <div>
            <h3>${this._t("common.sources")}</h3>
            <p>${this._t("common.currentSource")}: ${String(sourceState.attributes.source || "-")}</p>
          </div>
        </div>
        <div class="source-row">
          ${sources.map(
            (source) => html`
              <button
                class=${classes({
                  "source-chip": true,
                  selected: source === sourceState.attributes.source,
                })}
                @click=${() => this._selectSource(active, source)}
              >
                <span class="source-label">${source}</span>
              </button>
            `,
          )}
        </div>
      </section>
    `;
  }

  _renderShortcuts(active) {
    if (!this._detailsOpen) {
      return html``;
    }
    const shortcuts = this._config.actions.filter((shortcut) =>
      visibilityMatches(shortcut.visibility, this._displayState(active)),
    );
    if (!shortcuts.length) {
      return html``;
    }

    return html`
      <section class="section">
        <div class="section-header">
          <div>
            <h3>${this._t("common.shortcuts")}</h3>
          </div>
        </div>
        <div class="shortcut-row">
          ${shortcuts.map(
            (shortcut) => html`
              <button class="action-chip" @click=${() => this._runShortcut(shortcut, active)}>
                ${shortcut.icon ? html`<ha-icon .icon=${shortcut.icon}></ha-icon>` : html``}
                <span class="action-label">${shortcut.label}</span>
              </button>
            `,
          )}
        </div>
      </section>
    `;
  }

  _renderGroupControls(entries, active) {
    const groupState = this._groupState(active);
    if (!this._config.behavior.show_group_controls || !groupState || entries.length <= 1) {
      return html``;
    }

    const groupedPlayers = normalizeGroupMembers(groupState);
    const canGroup = supportsFeature(groupState, FEATURE_GROUPING) || groupedPlayers.length > 1;
    if (!canGroup) {
      return html``;
    }

    return html`
      <section class="section">
        <div class="section-header">
          <div>
            <h3>${this._t("common.group")}</h3>
            <p>${this._t("common.groupedPlayers")}: ${groupedPlayers.length}</p>
          </div>
          ${groupedPlayers.length > 1
            ? html`
                <button class="queue-clear" @click=${() => this._ungroupAll(active)}>
                  ${this._t("common.ungroupAll")}
                </button>
              `
            : html``}
        </div>
        <div class="group-row">
          ${entries.map((entry) => {
            const joined = groupedPlayers.includes(entry.entityId);
            const label = entry.config.name || friendlyName(entry.stateObj, entry.entityId);
            return html`
              <button
                class=${classes({
                  "group-chip": true,
                  joined,
                  selected: entry.entityId === active.entityId,
                })}
                @click=${() => this._toggleGroupMember(active, entry.entityId)}
              >
                <ha-icon .icon=${iconForEntity(entry.stateObj, entry.config.icon)}></ha-icon>
                <span class="group-label">${label}</span>
              </button>
            `;
          })}
        </div>
      </section>
    `;
  }

  _renderQueue(active) {
    if (!this._config.queue.enabled || !this._detailsOpen || this._queueAvailable === false) {
      return html``;
    }

    if (!this._queueLoading && !this._queueItems.length) {
      return html``;
    }

    return html`
      <section class="section">
        <div class="section-header">
          <div>
            <h3>${this._t("common.queue")}</h3>
            <p>${this._t("common.queueSoon")}</p>
          </div>
          ${this._queueItems.length
            ? html`
                <button
                  class="queue-clear"
                  @click=${async () => {
                    if (!this.hass) {
                      return;
                    }
                    await clearQueue(this.hass, active.playbackEntityId);
                    await this._refreshQueue();
                  }}
                >
                  ${this._t("common.clear")}
                </button>
              `
            : html``}
        </div>
        ${this._queueLoading ? html`<div class="queue-loading">${this._t("common.loading")}</div>` : html``}
        <div class="queue-list">
          ${this._queueItems.length
            ? this._queueItems.map(
                (item) => html`
                  <div class=${classes({ "queue-row": true, playing: Boolean(item.playing) })}>
                    <button
                      class="queue-item-main"
                      title=${this._t("common.openQueueItem")}
                      @click=${() =>
                        this.hass &&
                        item.queue_item_id &&
                        playQueueItem(this.hass, active.playbackEntityId, item.queue_item_id)}
                    >
                      <div class="queue-thumb">
                        ${queueItemImage(item)
                          ? html`<img src=${queueItemImage(item)} alt=${queueItemTitle(item)} />`
                          : html`
                              <div class="artwork-placeholder">
                                <ha-icon icon="mdi:music"></ha-icon>
                              </div>
                            `}
                      </div>
                      <div class="queue-meta">
                        <span class="queue-title">${queueItemTitle(item)}</span>
                        <span class="queue-subtitle">${queueItemSubtitle(item)}</span>
                      </div>
                    </button>
                    ${item.queue_item_id && this.hass
                      ? this._renderIconButton(
                          "mdi:close",
                          this._t("common.remove"),
                          async () => {
                            await removeQueueItem(
                              this.hass,
                              active.playbackEntityId,
                              item.queue_item_id,
                            );
                            await this._refreshQueue();
                          },
                          "icon-button",
                        )
                      : html``}
                  </div>
                `,
              )
            : html`<div class="queue-empty">${this._t("common.noQueue")}</div>`}
        </div>
      </section>
    `;
  }

  _renderDetails(active) {
    const displayState = this._displayState(active);
    const deviceState = this._deviceState(active);
    if (!this._config.behavior.show_details || !this._detailsOpen || !displayState) {
      return html``;
    }

    const details = [
      {
        label: this._t("common.device"),
        value: active.config.name || friendlyName(deviceState, active.entityId),
      },
      {
        label: this._t("common.sourceEntity"),
        value:
          active.displayOrigin === "music_assistant"
            ? this._t("common.musicAssistant")
            : this._t("common.device"),
      },
      { label: this._t("common.state"), value: this._stateLabel(active) },
      { label: this._t("common.artist"), value: String(displayState.attributes.media_artist || "") },
      { label: this._t("common.album"), value: String(displayState.attributes.media_album_name || "") },
      {
        label: this._t("common.currentSource"),
        value: String((this._sourceState(active) && this._sourceState(active).attributes.source) || ""),
      },
      { label: this._t("common.app"), value: String(displayState.attributes.app_name || "") },
      {
        label: this._t("common.soundMode"),
        value: String((this._sourceState(active) && this._sourceState(active).attributes.sound_mode) || ""),
      },
    ].filter((item) => item.value);

    if (!details.length) {
      return html``;
    }

    return html`
      <section class="section">
        <div class="section-header">
          <div>
            <h3>${this._t("common.details")}</h3>
          </div>
        </div>
        <div class="detail-grid">
          ${details.map(
            (item) => html`
              <div class="detail-card">
                <span class="detail-label">${item.label}</span>
                <span class="detail-value">${item.value}</span>
              </div>
            `,
          )}
        </div>
      </section>
    `;
  }

  render() {
    if (!this._config) {
      return html`
        <ha-card>
          <div class="notice">${this._t("common.configure")}</div>
        </ha-card>
      `;
    }

    const entries = this._entries();
    const active = this._activeEntry(entries);

    if (!active) {
      return html`
        <ha-card>
          <div class="notice">${this._t("common.noEntities")}</div>
        </ha-card>
      `;
    }

    const collapsed = this._config.behavior.collapse_when_idle && isIdleLike(active.stateObj);
    const accent =
      active.config.accent_color &&
      active.config.accent_color !== LEGACY_DEFAULT_ACCENT
        ? active.config.accent_color
        : this._config.appearance.accent_color;
    const theme =
      this._config.appearance.theme === "auto"
        ? this.hass && this.hass.themes && this.hass.themes.darkMode
          ? "dark"
          : "light"
        : this._config.appearance.theme;
    const cardClass = classes({
      collapsed,
      "theme-dark": theme === "dark",
      "theme-light": theme === "light",
    });

    return html`
      <ha-card class=${cardClass} style=${`--nodalia-accent:${accent};`}>
        <div class=${classes({ shell: true, collapsed })}>
          ${this._renderHero(active)}
          ${this._renderEntityChips(entries, active)}
          ${this._renderProgress(active)}
          ${this._renderVolume(active)}
          ${this._renderShortcuts(active)}
          ${collapsed || !this._detailsOpen ? html`` : this._renderSources(active)}
          ${collapsed || !this._detailsOpen ? html`` : this._renderGroupControls(entries, active)}
          ${collapsed ? html`` : this._renderQueue(active)}
          ${collapsed ? html`` : this._renderDetails(active)}
        </div>
      </ha-card>
    `;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TAG,
  name: "Nodalia Media Player",
  description:
    "Mushroom-inspired media player card with multi-entity control, quick grouping, optional queue, and translations.",
  preview: true,
});

if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, NodaliaMediaPlayerEditor);
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, NodaliaMediaPlayer);
}
