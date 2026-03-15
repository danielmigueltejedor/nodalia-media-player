import { css } from "lit";

export const cardStyles = css`
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
