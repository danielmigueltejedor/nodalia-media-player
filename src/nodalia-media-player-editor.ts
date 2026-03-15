import { LitElement, PropertyValues, html, nothing } from "lit";

import {
  BehaviorConfig,
  NodaliaMediaPlayerConfig,
  NormalizedConfig,
  buildStubConfig,
  normalizeConfig,
} from "./config";
import { HomeAssistant, LovelaceCardConfig } from "./ha-types";
import { localize } from "./localize";
import { editorStyles } from "./nodalia-media-player-editor.styles";
import {
  fireEvent,
  parseActionEditorText,
  parseEntityEditorText,
  serializeEntityEditorText,
} from "./utils";

const EDITOR_TAG = "nodalia-media-player-editor";

export class NodaliaMediaPlayerEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _rawConfig: { state: true },
    _entitiesText: { state: true },
    _actionsText: { state: true },
    _actionsError: { state: true },
  };

  static styles = [editorStyles];

  public hass?: HomeAssistant;

  private _config?: NormalizedConfig;
  private _rawConfig?: NodaliaMediaPlayerConfig;
  private _entitiesText = "";
  private _actionsText = "";
  private _actionsError = "";

  public setConfig(config: LovelaceCardConfig): void {
    const candidate = config as NodaliaMediaPlayerConfig;
    const typed =
      candidate.entities?.length || candidate.entity ? candidate : buildStubConfig();
    this._rawConfig = typed;
    this._config = normalizeConfig(typed);
    this._entitiesText = serializeEntityEditorText(this._config.entities);
    this._actionsText = this._config.actions.length
      ? JSON.stringify(this._config.actions, null, 2)
      : "";
    this._actionsError = "";
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("_rawConfig") && this._rawConfig) {
      this._config = normalizeConfig(this._rawConfig);
    }
  }

  private _t(key: string): string {
    return localize(key, this.hass, this._config?.language ?? "auto");
  }

  private _emitConfig(config: NodaliaMediaPlayerConfig): void {
    this._rawConfig = config;
    this._config = normalizeConfig(config);
    fireEvent(this, "config-changed", { config });
  }

  private _updateRoot<Key extends keyof NodaliaMediaPlayerConfig>(
    key: Key,
    value: NodaliaMediaPlayerConfig[Key],
  ): void {
    if (!this._rawConfig) {
      return;
    }
    this._emitConfig({
      ...this._rawConfig,
      [key]: value,
    });
  }

  private _updateAppearance(
    key: keyof NonNullable<NodaliaMediaPlayerConfig["appearance"]>,
    value: string | boolean,
  ): void {
    if (!this._rawConfig) {
      return;
    }
    this._emitConfig({
      ...this._rawConfig,
      appearance: {
        ...(this._rawConfig.appearance ?? {}),
        [key]: value,
      },
    });
  }

  private _updateBehavior(key: keyof BehaviorConfig, value: boolean): void {
    if (!this._rawConfig) {
      return;
    }
    this._emitConfig({
      ...this._rawConfig,
      behavior: {
        ...(this._rawConfig.behavior ?? {}),
        [key]: value,
      },
    });
  }

  private _updateQueue(limit?: number, enabled?: boolean): void {
    if (!this._rawConfig) {
      return;
    }
    this._emitConfig({
      ...this._rawConfig,
      queue: {
        ...(this._rawConfig.queue ?? {}),
        ...(typeof enabled === "boolean" ? { enabled } : {}),
        ...(typeof limit === "number" ? { limit } : {}),
      },
    });
  }

  private _onEntitiesInput(value: string): void {
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

  private _onActionsInput(value: string): void {
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

  protected render() {
    if (!this._config) {
      return nothing;
    }

    return html`
      <div class="editor">
        <section class="section">
          <h3>${this._t("editor.players")}</h3>
          <p class="hint">${this._t("editor.playersHint")}</p>
          <label>
            <span>${this._t("editor.name")}</span>
            <input
              .value=${this._config.name ?? ""}
              @input=${(event: Event) =>
                this._updateRoot(
                  "name",
                  (event.currentTarget as HTMLInputElement).value,
                )}
            />
          </label>
          <label>
            <span>${this._t("editor.players")}</span>
            <textarea
              .value=${this._entitiesText}
              @input=${(event: Event) =>
                this._onEntitiesInput(
                  (event.currentTarget as HTMLTextAreaElement).value,
                )}
            ></textarea>
          </label>
        </section>

        <section class="section">
          <h3>${this._t("editor.appearance")}</h3>
          <div class="grid">
            <label>
              <span>${this._t("editor.language")}</span>
              <select
                .value=${this._config.language ?? "auto"}
                @change=${(event: Event) =>
                  this._updateRoot(
                    "language",
                    (event.currentTarget as HTMLSelectElement).value as
                      | "auto"
                      | "es"
                      | "en",
                  )}
              >
                <option value="auto">${this._t("editor.languageAuto")}</option>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </label>
            <label>
              <span>${this._t("editor.accentColor")}</span>
              <input
                .value=${this._config.appearance.accent_color}
                @input=${(event: Event) =>
                  this._updateAppearance(
                    "accent_color",
                    (event.currentTarget as HTMLInputElement).value,
                  )}
              />
            </label>
            <label>
              <span>${this._t("editor.artworkFit")}</span>
              <select
                .value=${this._config.appearance.artwork_fit}
                @change=${(event: Event) =>
                  this._updateAppearance(
                    "artwork_fit",
                    (event.currentTarget as HTMLSelectElement).value,
                  )}
              >
                <option value="cover">${this._t("editor.fitCover")}</option>
                <option value="contain">${this._t("editor.fitContain")}</option>
              </select>
            </label>
            <label>
              <span>${this._t("editor.theme")}</span>
              <select
                .value=${this._config.appearance.theme}
                @change=${(event: Event) =>
                  this._updateAppearance(
                    "theme",
                    (event.currentTarget as HTMLSelectElement).value,
                  )}
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
                .checked=${this._config.appearance.blur_background}
                @change=${(event: Event) =>
                  this._updateAppearance(
                    "blur_background",
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
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
                .checked=${this._config.behavior.auto_select_active}
                @change=${(event: Event) =>
                  this._updateBehavior(
                    "auto_select_active",
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
              />
              <span>${this._t("editor.autoSelect")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${this._config.behavior.collapse_when_idle}
                @change=${(event: Event) =>
                  this._updateBehavior(
                    "collapse_when_idle",
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
              />
              <span>${this._t("editor.collapseWhenIdle")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${this._config.behavior.expanded_by_default}
                @change=${(event: Event) =>
                  this._updateBehavior(
                    "expanded_by_default",
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
              />
              <span>${this._t("editor.showExpandedByDefault")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${this._config.behavior.show_timestamps}
                @change=${(event: Event) =>
                  this._updateBehavior(
                    "show_timestamps",
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
              />
              <span>${this._t("editor.showTimestamps")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${this._config.behavior.show_volume}
                @change=${(event: Event) =>
                  this._updateBehavior(
                    "show_volume",
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
              />
              <span>${this._t("editor.showVolume")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${this._config.behavior.show_sources}
                @change=${(event: Event) =>
                  this._updateBehavior(
                    "show_sources",
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
              />
              <span>${this._t("editor.showSources")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${this._config.behavior.show_group_controls}
                @change=${(event: Event) =>
                  this._updateBehavior(
                    "show_group_controls",
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
              />
              <span>${this._t("editor.showGroupControls")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${this._config.behavior.enable_seek}
                @change=${(event: Event) =>
                  this._updateBehavior(
                    "enable_seek",
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
              />
              <span>${this._t("editor.enableSeek")}</span>
            </label>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${this._config.queue.enabled}
                @change=${(event: Event) =>
                  this._updateQueue(
                    undefined,
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
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
                @input=${(event: Event) =>
                  this._updateQueue(
                    Number((event.currentTarget as HTMLInputElement).value),
                    undefined,
                  )}
              />
            </label>
          </div>
        </section>

        <section class="section">
          <h3>${this._t("editor.actions")}</h3>
          <p class="hint">${this._t("editor.actionsHint")}</p>
          <textarea
            .value=${this._actionsText}
            @input=${(event: Event) =>
              this._onActionsInput(
                (event.currentTarget as HTMLTextAreaElement).value,
              )}
          ></textarea>
          ${this._actionsError
            ? html`<div class="error">${this._actionsError}</div>`
            : nothing}
        </section>
      </div>
    `;
  }
}

if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, NodaliaMediaPlayerEditor);
}
