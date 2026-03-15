import { LitElement, PropertyValues, html, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import {
  HiddenControl,
  NodaliaMediaPlayerConfig,
  NormalizedConfig,
  ShortcutConfig,
  buildStubConfig,
  normalizeConfig,
} from "./config";
import { clearQueue, fetchQueueItems, playQueueItem, removeQueueItem } from "./queue";
import { HomeAssistant, LovelaceCardConfig } from "./ha-types";
import { localize } from "./localize";
import { cardStyles } from "./nodalia-media-player.styles";
import {
  FEATURE_GROUPING,
  FEATURE_NEXT_TRACK,
  FEATURE_PAUSE,
  FEATURE_PLAY,
  FEATURE_PREVIOUS_TRACK,
  FEATURE_SEEK,
  FEATURE_SELECT_SOURCE,
  FEATURE_TURN_OFF,
  FEATURE_TURN_ON,
  FEATURE_VOLUME_MUTE,
  FEATURE_VOLUME_SET,
  ResolvedPlayerEntity,
  artworkForEntity,
  buildStateLabel,
  clamp,
  currentMediaPosition,
  fireEvent,
  formatTime,
  friendlyName,
  iconForEntity,
  interpolateTemplate,
  isIdleLike,
  isPlaying,
  isSessionActive,
  mediaSubtitle,
  mediaSupportingText,
  mediaTitle,
  normalizeGroupMembers,
  placeholderContext,
  queueItemImage,
  queueItemSubtitle,
  queueItemTitle,
  resolveEntries,
  supportsFeature,
  visibilityMatches,
  QueueItemLike,
} from "./utils";

const CARD_TAG = "nodalia-media-player";

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: CARD_TAG,
  name: "Nodalia Media Player",
  description:
    "Mushroom-inspired media player card with multi-entity control, quick grouping, optional queue, and translations.",
  preview: true,
});

export class NodaliaMediaPlayer extends LitElement {
  static properties = {
    hass: { attribute: false },
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

  static styles = [cardStyles];

  public hass?: HomeAssistant;

  private _config?: NormalizedConfig;
  private _selectedEntityId?: string;
  private _detailsOpen = false;
  private _draftSeek?: number;
  private _draftVolume?: number;
  private _queueItems: QueueItemLike[] = [];
  private _queueLoading = false;
  private _queueAvailable?: boolean = undefined;
  private _now = Date.now();

  private _progressTicker?: number;
  private _queueTicker?: number;
  private _lastQueueSignature = "";

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement("nodalia-media-player-editor");
  }

  public static getStubConfig(hass: HomeAssistant): NodaliaMediaPlayerConfig {
    const firstEntity = Object.keys(hass.states).find((entityId) =>
      entityId.startsWith("media_player."),
    );
    return buildStubConfig(firstEntity);
  }

  public setConfig(config: LovelaceCardConfig): void {
    this._config = normalizeConfig(config as NodaliaMediaPlayerConfig);
    this._detailsOpen = this._config.behavior.expanded_by_default;
  }

  public getCardSize(): number {
    return this._detailsOpen ? 7 : 3;
  }

  protected updated(changedProperties: PropertyValues<this>): void {
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
      void this._refreshQueue();
    }
  }

  disconnectedCallback(): void {
    this._clearProgressTicker();
    this._clearQueueTicker();
    super.disconnectedCallback();
  }

  private _t(key: string): string {
    return localize(key, this.hass, this._config?.language ?? "auto");
  }

  private get _entries(): ResolvedPlayerEntity[] {
    return this._config ? resolveEntries(this.hass, this._config.entities) : [];
  }

  private _pickSelectedEntityId(): string | undefined {
    const entries = this._entries;
    if (!entries.length) {
      return undefined;
    }

    const currentSelection = entries.find(
      (entry) => entry.entityId === this._selectedEntityId,
    );
    const playingEntry = entries.find((entry) => isPlaying(entry.stateObj));
    const activeEntry = entries.find((entry) => isSessionActive(entry.stateObj));

    if (!currentSelection) {
      return playingEntry?.entityId ?? activeEntry?.entityId ?? entries[0].entityId;
    }

    if (
      this._config?.behavior.auto_select_active &&
      isIdleLike(currentSelection.stateObj) &&
      playingEntry
    ) {
      return playingEntry.entityId;
    }

    return currentSelection.entityId;
  }

  private _activeEntry(entries = this._entries): ResolvedPlayerEntity | undefined {
    return (
      entries.find((entry) => entry.entityId === this._selectedEntityId) ?? entries[0]
    );
  }

  private _queueSignature(): string {
    const active = this._activeEntry();
    if (
      !this._config?.queue.enabled ||
      !active?.playbackStateObj ||
      !isSessionActive(active.playbackStateObj)
    ) {
      return "";
    }
    return [
      active.playbackEntityId,
      active.playbackStateObj.state,
      active.playbackStateObj.attributes.media_content_id ?? "",
      this._config.queue.limit,
    ].join("|");
  }

  private _syncProgressTicker(): void {
    const active = this._activeEntry();
    if (!active?.stateObj || active.stateObj.state !== "playing") {
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

  private _clearProgressTicker(): void {
    if (this._progressTicker) {
      window.clearInterval(this._progressTicker);
      this._progressTicker = undefined;
    }
  }

  private _syncQueueTicker(): void {
    const active = this._activeEntry();
    if (
      !this._config?.queue.enabled ||
      this._queueAvailable === false ||
      !active?.stateObj ||
      !isSessionActive(active.stateObj)
    ) {
      this._clearQueueTicker();
      return;
    }
    if (this._queueTicker) {
      return;
    }
    this._queueTicker = window.setInterval(() => {
      void this._refreshQueue();
    }, 15000);
  }

  private _clearQueueTicker(): void {
    if (this._queueTicker) {
      window.clearInterval(this._queueTicker);
      this._queueTicker = undefined;
    }
  }

  private async _refreshQueue(): Promise<void> {
    const active = this._activeEntry();
    if (
      !this.hass ||
      !this._config?.queue.enabled ||
      !active?.playbackStateObj ||
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
      const currentId = String(active.playbackStateObj.attributes.media_content_id ?? "");
      this._queueAvailable = true;
      this._queueItems = items.map((item) => ({
        ...item,
        playing: Boolean(item.playing) || String(item.media_content_id ?? "") === currentId,
      }));
    } catch (_error) {
      this._queueAvailable = false;
      this._queueItems = [];
    } finally {
      this._queueLoading = false;
    }
  }

  private _stateLabel(entry?: ResolvedPlayerEntity): string {
    const state = buildStateLabel(entry?.stateObj);
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

  private _isHidden(entry: ResolvedPlayerEntity, control: HiddenControl): boolean {
    return entry.config.hide_controls?.includes(control) ?? false;
  }

  private _displayState(entry: ResolvedPlayerEntity): ResolvedPlayerEntity["stateObj"] {
    return entry.playbackStateObj ?? entry.stateObj;
  }

  private _deviceState(entry: ResolvedPlayerEntity): ResolvedPlayerEntity["stateObj"] {
    return entry.deviceStateObj ?? entry.stateObj;
  }

  private _sourceState(entry: ResolvedPlayerEntity): ResolvedPlayerEntity["stateObj"] {
    return entry.sourceStateObj ?? this._deviceState(entry);
  }

  private _groupState(entry: ResolvedPlayerEntity): ResolvedPlayerEntity["stateObj"] {
    return entry.groupStateObj ?? this._displayState(entry);
  }

  private _selectEntity(entityId: string): void {
    this._selectedEntityId = entityId;
  }

  private _openMoreInfo(entityId: string): void {
    fireEvent(this, "hass-more-info", { entityId });
  }

  private async _togglePower(entry: ResolvedPlayerEntity): Promise<void> {
    const deviceState = this._deviceState(entry);
    if (!this.hass || !deviceState) {
      return;
    }
    const service =
      deviceState.state === "off" || deviceState.state === "standby"
        ? "turn_on"
        : "turn_off";
    await this.hass.callService("media_player", service, {
      entity_id: entry.entityId,
    });
  }

  private async _togglePlayPause(entry: ResolvedPlayerEntity): Promise<void> {
    const playbackState = this._displayState(entry);
    if (!this.hass || !playbackState) {
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

  private async _previousTrack(entry: ResolvedPlayerEntity): Promise<void> {
    if (!this.hass) {
      return;
    }
    await this.hass.callService("media_player", "media_previous_track", {
      entity_id: entry.playbackEntityId,
    });
  }

  private async _nextTrack(entry: ResolvedPlayerEntity): Promise<void> {
    if (!this.hass) {
      return;
    }
    await this.hass.callService("media_player", "media_next_track", {
      entity_id: entry.playbackEntityId,
    });
  }

  private async _toggleMute(entry: ResolvedPlayerEntity): Promise<void> {
    if (!this.hass || !entry.volumeStateObj) {
      return;
    }
    await this.hass.callService("media_player", "volume_mute", {
      entity_id: entry.volumeStateObj.entity_id,
      is_volume_muted: !Boolean(entry.volumeStateObj.attributes.is_volume_muted),
    });
  }

  private async _seek(entry: ResolvedPlayerEntity, seconds: number): Promise<void> {
    if (!this.hass) {
      return;
    }
    await this.hass.callService("media_player", "media_seek", {
      entity_id: entry.playbackEntityId,
      seek_position: seconds,
    });
  }

  private async _setVolume(entry: ResolvedPlayerEntity, volumePercent: number): Promise<void> {
    if (!this.hass) {
      return;
    }
    const target = entry.volumeStateObj?.entity_id ?? entry.entityId;
    await this.hass.callService("media_player", "volume_set", {
      entity_id: target,
      volume_level: clamp(volumePercent / 100, 0, 1),
    });
  }

  private async _selectSource(entry: ResolvedPlayerEntity, source: string): Promise<void> {
    if (!this.hass) {
      return;
    }
    await this.hass.callService("media_player", "select_source", {
      entity_id: this._sourceState(entry)?.entity_id ?? entry.entityId,
      source,
    });
  }

  private async _toggleGroupMember(
    activeEntry: ResolvedPlayerEntity,
    memberId: string,
  ): Promise<void> {
    const groupState = this._groupState(activeEntry);
    if (!this.hass || !groupState || memberId === activeEntry.groupEntityId) {
      return;
    }
    const groupMembers = normalizeGroupMembers(groupState);
    if (groupMembers.includes(memberId)) {
      await this.hass.callService("media_player", "unjoin", {
        entity_id: memberId,
      });
      return;
    }
    await this.hass.callService("media_player", "join", {
      entity_id: activeEntry.groupEntityId,
      group_members: [memberId],
    });
  }

  private async _ungroupAll(activeEntry: ResolvedPlayerEntity): Promise<void> {
    const groupState = this._groupState(activeEntry);
    if (!this.hass || !groupState) {
      return;
    }
    const members = normalizeGroupMembers(groupState).filter(
      (memberId) => memberId !== activeEntry.groupEntityId,
    );
    await Promise.all(
      members.map((memberId) =>
        this.hass!.callService("media_player", "unjoin", {
          entity_id: memberId,
        }),
      ),
    );
  }

  private async _triggerFavorite(entry: ResolvedPlayerEntity): Promise<void> {
    if (!this.hass || !entry.config.favorite_service) {
      return;
    }
    const [domain, service] = entry.config.favorite_service.split(".");
    if (!domain || !service) {
      return;
    }
    const entity = this._displayState(entry);
    const data = interpolateTemplate(
      entry.config.favorite_service_data ?? { entity_id: entry.playbackEntityId },
      placeholderContext(entity),
    );
    await this.hass.callService(domain, service, data as Record<string, unknown>);
  }

  private async _runShortcut(
    shortcut: ShortcutConfig,
    activeEntry: ResolvedPlayerEntity,
  ): Promise<void> {
    if (!this.hass) {
      return;
    }

    const entityId =
      shortcut.entity && shortcut.entity !== "current"
        ? shortcut.entity
        : activeEntry.playbackEntityId;
    const entity = this.hass.states[entityId] ?? activeEntry.stateObj;
    const context = placeholderContext(entity);

    switch (shortcut.action) {
      case "call-service": {
        if (!shortcut.service) {
          return;
        }
        const [domain, service] = shortcut.service.split(".");
        if (!domain || !service) {
          return;
        }
        const serviceData = interpolateTemplate(
          shortcut.service_data ?? { entity_id: entityId },
          context,
        ) as Record<string, unknown>;
        if (!("entity_id" in serviceData) && entityId) {
          serviceData.entity_id = entityId;
        }
        await this.hass.callService(domain, service, serviceData);
        return;
      }
      case "navigate": {
        const path = interpolateTemplate(shortcut.navigation_path ?? "", context);
        if (!path) {
          return;
        }
        window.history.pushState(null, "", path);
        fireEvent(window, "location-changed", { replace: false });
        return;
      }
      case "url": {
        const url = interpolateTemplate(shortcut.url_path ?? "", context);
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
        await this.hass.callService(entityId.split(".")[0], "toggle", {
          entity_id: entityId,
        });
        return;
      default:
        return;
    }
  }

  private _renderIconButton(
    icon: string,
    label: string,
    onClick: () => void | Promise<void>,
    classes: Record<string, boolean> = {},
  ) {
    return html`
      <button
        class=${classMap({ "icon-button": true, ...classes })}
        title=${label}
        @click=${onClick}
      >
        <ha-icon .icon=${icon}></ha-icon>
      </button>
    `;
  }

  private _renderHeroProgress(active: ResolvedPlayerEntity) {
    const playbackState = this._displayState(active);
    if (!playbackState) {
      return nothing;
    }
    const duration = Number(playbackState.attributes.media_duration ?? 0);
    if (!duration) {
      return nothing;
    }
    const current = clamp(
      currentMediaPosition(playbackState, this._now),
      0,
      duration,
    );
    const width = `${(current / duration) * 100}%`;
    return html`
      <div class="hero-progress">
        <div class="hero-progress-track">
          <div class="hero-progress-fill" style=${styleMap({ width })}></div>
        </div>
        ${this._config?.behavior.show_timestamps
          ? html`
              <div class="hero-times">
                <span>${formatTime(current)}</span>
                <span>${formatTime(duration)}</span>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderHeroTransport(active: ResolvedPlayerEntity) {
    const playbackState = this._displayState(active);
    const deviceState = this._deviceState(active);
    if (!playbackState && !deviceState) {
      return nothing;
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

    const playIcon = playbackState?.state === "playing" ? "mdi:pause" : "mdi:play";
    const playLabel =
      playbackState?.state === "playing"
        ? this._t("common.pause")
        : this._t("common.play");

    return html`
      <div class="hero-bottom">
        <div class="hero-controls">
          ${canPower
            ? this._renderIconButton(
                deviceState?.state === "off" || deviceState?.state === "standby"
                  ? "mdi:power"
                  : "mdi:power-standby",
                this._t("common.power"),
                () => this._togglePower(active),
                { subtle: true, small: true },
              )
            : nothing}
          ${canPrevious
            ? this._renderIconButton(
                "mdi:skip-previous",
                this._t("common.previous"),
                () => this._previousTrack(active),
                { subtle: true, small: true },
              )
            : nothing}
          ${playbackState
            ? this._renderIconButton(
                playIcon,
                playLabel,
                () => this._togglePlayPause(active),
                { primary: true, "play-button": true },
              )
            : nothing}
          ${canNext
            ? this._renderIconButton(
                "mdi:skip-next",
                this._t("common.next"),
                () => this._nextTrack(active),
                { subtle: true, small: true },
              )
            : nothing}
          ${canMute
            ? this._renderIconButton(
                active.volumeStateObj?.attributes.is_volume_muted
                  ? "mdi:volume-off"
                  : "mdi:volume-high",
                active.volumeStateObj?.attributes.is_volume_muted
                  ? this._t("common.unmute")
                  : this._t("common.mute"),
                () => this._toggleMute(active),
                { subtle: true, small: true },
              )
            : nothing}
        </div>
        <div class="hero-actions-inline">
          ${active.config.favorite_service
            ? this._renderIconButton(
                "mdi:heart-outline",
                this._t("common.favorite"),
                () => this._triggerFavorite(active),
                { subtle: true, small: true },
              )
            : nothing}
          ${this._renderIconButton(
            this._detailsOpen ? "mdi:chevron-up" : "mdi:chevron-down",
            this._t("common.toggleDetails"),
            () => {
              this._detailsOpen = !this._detailsOpen;
            },
            { subtle: true, small: true },
          )}
          ${this._renderIconButton(
            "mdi:dots-horizontal",
            this._t("common.moreInfo"),
            () => this._openMoreInfo(active.playbackEntityId),
            { subtle: true, small: true },
          )}
        </div>
      </div>
    `;
  }

  private _renderHero(active: ResolvedPlayerEntity, collapsed: boolean) {
    const displayState = this._displayState(active);
    const deviceState = this._deviceState(active);
    const artwork = artworkForEntity(displayState, active.config.image);
    const title = displayState
      ? mediaTitle(displayState)
      : active.config.name ?? active.entityId;
    const subtitle = displayState
      ? mediaSubtitle(displayState) || friendlyName(displayState, active.config.name)
      : this._t("common.unavailable");
    const supporting = displayState
      ? mediaSupportingText(displayState) ||
        friendlyName(deviceState, active.config.name)
      : active.entityId;
    const stateClass = `state-${displayState?.state ?? "unknown"}`;
    const blurClass = this._config?.appearance.blur_background ? "blur" : "";
    const entityLabel =
      active.config.name ?? friendlyName(deviceState, active.entityId);

    return html`
      <section class="hero">
        ${artwork
          ? html`
              <div
                class="hero-backdrop ${blurClass}"
                style=${styleMap({ backgroundImage: `url("${artwork}")` })}
              ></div>
            `
          : nothing}
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
                    style=${styleMap({
                      objectFit: this._config?.appearance.artwork_fit ?? "cover",
                    })}
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
              <span class=${classMap({ "hero-chip": true, [stateClass]: true })}>
                ${this._stateLabel(active)}
              </span>
              <span class="hero-chip">${entityLabel}</span>
              ${active.displayOrigin === "music_assistant"
                ? html`<span class="hero-chip accent">${this._t("common.musicAssistant")}</span>`
                : nothing}
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

  private _renderEntityChips(entries: ResolvedPlayerEntity[], active: ResolvedPlayerEntity) {
    if (entries.length <= 1) {
      return nothing;
    }

    return html`
      <div class="entity-row">
        ${entries.map((entry) => {
          const label =
            entry.config.name ??
            friendlyName(entry.deviceStateObj ?? entry.stateObj, entry.entityId);
          return html`
            <button
              class=${classMap({
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

  private _renderProgress(active: ResolvedPlayerEntity) {
    if (!this._detailsOpen) {
      return nothing;
    }
    const playbackState = this._displayState(active);
    if (
      !playbackState ||
      this._isHidden(active, "seek") ||
      !this._config?.behavior.enable_seek ||
      !supportsFeature(playbackState, FEATURE_SEEK)
    ) {
      return nothing;
    }

    const duration = Number(playbackState.attributes.media_duration ?? 0);
    if (!duration) {
      return nothing;
    }
    const current = clamp(
      this._draftSeek ?? currentMediaPosition(playbackState, this._now),
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
            : nothing}
        </div>
        <input
          type="range"
          min="0"
          max=${String(Math.floor(duration))}
          step="1"
          .value=${String(Math.floor(current))}
          @input=${(event: Event) => {
            this._draftSeek = Number((event.currentTarget as HTMLInputElement).value);
          }}
          @change=${(event: Event) =>
            this._seek(
              active,
              Number((event.currentTarget as HTMLInputElement).value),
            )}
        />
      </div>
    `;
  }

  private _renderTransport(active: ResolvedPlayerEntity) {
    if (!active.stateObj) {
      return nothing;
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
      active.stateObj.state === "playing"
        ? this._t("common.pause")
        : this._t("common.play");

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
                )
              : nothing}
          </div>
          <div class="transport-controls">
            ${canPrevious
              ? this._renderIconButton(
                  "mdi:skip-previous",
                  this._t("common.previous"),
                  () => this._previousTrack(active),
                )
              : nothing}
            ${this._renderIconButton(
              playIcon,
              playLabel,
              () => this._togglePlayPause(active),
              { primary: true, "play-button": true },
            )}
            ${canNext
              ? this._renderIconButton(
                  "mdi:skip-next",
                  this._t("common.next"),
                  () => this._nextTrack(active),
                )
              : nothing}
          </div>
          <div class="transport-side">
            ${canMute
              ? this._renderIconButton(
                  active.volumeStateObj?.attributes.is_volume_muted
                    ? "mdi:volume-off"
                    : "mdi:volume-high",
                  active.volumeStateObj?.attributes.is_volume_muted
                    ? this._t("common.unmute")
                    : this._t("common.mute"),
                  () => this._toggleMute(active),
                )
              : nothing}
          </div>
        </div>
      </section>
    `;
  }

  private _renderVolume(active: ResolvedPlayerEntity) {
    if (!this._detailsOpen) {
      return nothing;
    }
    const volumeEntity = active.volumeStateObj;
    if (
      !this._config?.behavior.show_volume ||
      !volumeEntity ||
      this._isHidden(active, "volume") ||
      !supportsFeature(volumeEntity, FEATURE_VOLUME_SET)
    ) {
      return nothing;
    }

    const value = clamp(
      this._draftVolume ?? Math.round(Number(volumeEntity.attributes.volume_level ?? 0) * 100),
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
          @input=${(event: Event) => {
            this._draftVolume = Number((event.currentTarget as HTMLInputElement).value);
          }}
          @change=${(event: Event) =>
            this._setVolume(
              active,
              Number((event.currentTarget as HTMLInputElement).value),
            )}
        />
      </div>
    `;
  }

  private _renderSources(active: ResolvedPlayerEntity) {
    const sourceState = this._sourceState(active);
    const sources = sourceState?.attributes.source_list;
    if (
      !this._config?.behavior.show_sources ||
      !sourceState ||
      this._isHidden(active, "source") ||
      !supportsFeature(sourceState, FEATURE_SELECT_SOURCE) ||
      !Array.isArray(sources) ||
      !sources.length
    ) {
      return nothing;
    }

    return html`
      <section class="section">
        <div class="section-header">
          <div>
            <h3>${this._t("common.sources")}</h3>
            <p>${this._t("common.currentSource")}: ${String(sourceState.attributes.source ?? "-")}</p>
          </div>
        </div>
        <div class="source-row">
          ${sources.map(
            (source) => html`
              <button
                class=${classMap({
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

  private _renderShortcuts(active: ResolvedPlayerEntity) {
    if (!this._detailsOpen) {
      return nothing;
    }
    const shortcuts = (this._config?.actions ?? []).filter((shortcut) =>
      visibilityMatches(shortcut.visibility, this._displayState(active)),
    );
    if (!shortcuts.length) {
      return nothing;
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
              <button
                class="action-chip"
                @click=${() => this._runShortcut(shortcut, active)}
              >
                ${shortcut.icon
                  ? html`<ha-icon .icon=${shortcut.icon}></ha-icon>`
                  : nothing}
                <span class="action-label">${shortcut.label}</span>
              </button>
            `,
          )}
        </div>
      </section>
    `;
  }

  private _renderGroupControls(entries: ResolvedPlayerEntity[], active: ResolvedPlayerEntity) {
    const groupState = this._groupState(active);
    if (
      !this._config?.behavior.show_group_controls ||
      !groupState ||
      entries.length <= 1
    ) {
      return nothing;
    }

    const groupedPlayers = normalizeGroupMembers(groupState);
    const canGroup =
      supportsFeature(groupState, FEATURE_GROUPING) || groupedPlayers.length > 1;
    if (!canGroup) {
      return nothing;
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
                <button
                  class="queue-clear"
                  @click=${() => this._ungroupAll(active)}
                >
                  ${this._t("common.ungroupAll")}
                </button>
              `
            : nothing}
        </div>
        <div class="group-row">
          ${entries.map((entry) => {
            const joined = groupedPlayers.includes(entry.entityId);
            const label = entry.config.name ?? friendlyName(entry.stateObj, entry.entityId);
            return html`
              <button
                class=${classMap({
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

  private _renderQueue(active: ResolvedPlayerEntity) {
    if (!this._config?.queue.enabled || !this._detailsOpen) {
      return nothing;
    }

    if (this._queueAvailable === false) {
      return nothing;
    }

    if (!this._queueLoading && !this._queueItems.length) {
      return nothing;
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
            : nothing}
        </div>
        ${this._queueLoading
          ? html`<div class="queue-loading">${this._t("common.queue")}</div>`
          : nothing}
        <div class="queue-list">
          ${this._queueItems.length
            ? this._queueItems.map(
                (item) => html`
                  <div
                    class=${classMap({
                      "queue-row": true,
                      playing: Boolean(item.playing),
                    })}
                  >
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
                              this.hass!,
                              active.playbackEntityId,
                              item.queue_item_id!,
                            );
                            await this._refreshQueue();
                          },
                        )
                      : nothing}
                  </div>
                `,
              )
            : html`<div class="queue-empty">${this._t("common.noQueue")}</div>`}
        </div>
      </section>
    `;
  }

  private _renderDetails(active: ResolvedPlayerEntity) {
    const displayState = this._displayState(active);
    const deviceState = this._deviceState(active);
    if (!this._config?.behavior.show_details || !this._detailsOpen || !displayState) {
      return nothing;
    }

    const details = [
      {
        label: this._t("common.device"),
        value: active.config.name ?? friendlyName(deviceState, active.entityId),
      },
      {
        label: this._t("common.sourceEntity"),
        value:
          active.displayOrigin === "music_assistant"
            ? this._t("common.musicAssistant")
            : this._t("common.device"),
      },
      {
        label: this._t("common.state"),
        value: this._stateLabel(active),
      },
      {
        label: this._t("common.artist"),
        value: String(displayState.attributes.media_artist ?? ""),
      },
      {
        label: this._t("common.album"),
        value: String(displayState.attributes.media_album_name ?? ""),
      },
      {
        label: this._t("common.currentSource"),
        value: String(this._sourceState(active)?.attributes.source ?? ""),
      },
      {
        label: this._t("common.app"),
        value: String(displayState.attributes.app_name ?? ""),
      },
      {
        label: this._t("common.soundMode"),
        value: String(this._sourceState(active)?.attributes.sound_mode ?? ""),
      },
    ].filter((item) => item.value);

    if (!details.length) {
      return nothing;
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

  protected render() {
    if (!this._config) {
      return html`
        <ha-card>
          <div class="notice">${this._t("common.configure")}</div>
        </ha-card>
      `;
    }

    const entries = this._entries;
    const active = this._activeEntry(entries);

    if (!active) {
      return html`
        <ha-card>
          <div class="notice">${this._t("common.noEntities")}</div>
        </ha-card>
      `;
    }

    const collapsed =
      this._config.behavior.collapse_when_idle && isIdleLike(active.stateObj);
    const accent =
      active.config.accent_color &&
      active.config.accent_color !== "var(--state-media-player-active-color, var(--primary-color))"
        ? active.config.accent_color
        : this._config.appearance.accent_color;
    const theme =
      this._config.appearance.theme === "auto"
        ? this.hass?.themes?.darkMode
          ? "dark"
          : "light"
        : this._config.appearance.theme;

    return html`
      <ha-card
        class=${classMap({
          collapsed,
          "theme-dark": theme === "dark",
          "theme-light": theme === "light",
        })}
        style=${styleMap({
          "--nodalia-accent": accent,
        })}
      >
        <div class=${classMap({ shell: true, collapsed })}>
          ${this._renderHero(active, collapsed)}
          ${this._renderEntityChips(entries, active)}
          ${this._renderProgress(active)}
          ${this._renderVolume(active)}
          ${this._renderShortcuts(active)}
          ${collapsed || !this._detailsOpen ? nothing : this._renderSources(active)}
          ${collapsed || !this._detailsOpen
            ? nothing
            : this._renderGroupControls(entries, active)}
          ${collapsed ? nothing : this._renderQueue(active)}
          ${collapsed ? nothing : this._renderDetails(active)}
        </div>
      </ha-card>
    `;
  }
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, NodaliaMediaPlayer);
}
