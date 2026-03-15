import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    position: relative;
    overflow: hidden;
    border-radius: 26px;
    border: 1px solid color-mix(in srgb, var(--nodalia-accent) 14%, transparent);
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--nodalia-accent) 5%, var(--ha-card-background, var(--card-background-color)) 95%),
        var(--ha-card-background, var(--card-background-color))
      );
    box-shadow: none;
  }

  ha-card.theme-dark {
    color-scheme: dark;
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--nodalia-accent) 10%, #1b2027 90%),
        #12161c
      );
  }

  ha-card.theme-light {
    color-scheme: light;
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--nodalia-accent) 8%, #fbfdff 92%),
        #f5f7fb
      );
  }

  .shell {
    position: relative;
    display: grid;
    gap: 10px;
    padding: 12px;
    color: var(--primary-text-color);
  }

  .hero {
    position: relative;
    display: block;
    padding: 16px;
    border-radius: 24px;
    overflow: hidden;
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--nodalia-accent) 12%, transparent),
        color-mix(in srgb, var(--nodalia-accent) 4%, transparent)
      );
    border: 1px solid color-mix(in srgb, var(--nodalia-accent) 12%, transparent);
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
    opacity: 0.28;
    transform: scale(1.08);
  }

  .hero-backdrop.blur {
    filter: blur(28px) saturate(1.2);
  }

  .hero-veil {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent),
      linear-gradient(90deg, rgba(0, 0, 0, 0.08), transparent 68%);
  }

  .hero > *:not(.hero-backdrop):not(.hero-veil) {
    position: relative;
    z-index: 1;
  }

  .hero-layout {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 14px;
    align-items: center;
  }

  .artwork-button {
    display: grid;
    place-items: center;
    width: 84px;
    height: 84px;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.12);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.14),
      inset 0 0 0 1px rgba(255, 255, 255, 0.18);
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
      radial-gradient(circle at top, color-mix(in srgb, var(--nodalia-accent) 28%, white), transparent 70%),
      color-mix(in srgb, var(--nodalia-accent) 14%, transparent);
  }

  .artwork-placeholder ha-icon {
    --mdc-icon-size: 34px;
  }

  .hero-copy {
    min-width: 0;
    display: grid;
    gap: 10px;
  }

  .hero-topline {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .hero-title {
    margin: 0;
    font-size: 1.28rem;
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: -0.02em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hero-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }

  .hero-heading-copy {
    min-width: 0;
    display: grid;
    gap: 4px;
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
    font-weight: 500;
  }

  .hero-supporting {
    color: var(--secondary-text-color);
    font-size: 0.84rem;
  }

  .hero-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.32rem 0.68rem;
    border-radius: 999px;
    font-size: 0.72rem;
    line-height: 1;
    font-weight: 700;
    letter-spacing: 0.02em;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
  }

  .hero-chip.state-playing {
    background: color-mix(in srgb, var(--nodalia-accent) 24%, rgba(255, 255, 255, 0.1));
  }

  .hero-chip.state-paused,
  .hero-chip.state-buffering {
    background: rgba(255, 255, 255, 0.18);
  }

  .hero-chip.accent {
    background: color-mix(in srgb, var(--nodalia-accent) 18%, transparent);
  }

  .hero-progress {
    display: grid;
    gap: 6px;
  }

  .hero-progress-track {
    width: 100%;
    height: 6px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
  }

  .hero-progress-fill {
    height: 100%;
    border-radius: inherit;
    background:
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--nodalia-accent) 86%, white 14%),
        color-mix(in srgb, var(--nodalia-accent) 64%, white 36%)
      );
  }

  .hero-times {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    color: var(--secondary-text-color);
    font-size: 0.76rem;
  }

  .hero-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }

  .hero-controls,
  .hero-actions-inline {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .hero-actions-inline {
    justify-content: flex-end;
  }

  .hero-ghost {
    position: absolute;
    right: -10px;
    bottom: -12px;
    display: grid;
    place-items: center;
    width: 120px;
    height: 120px;
    opacity: 0.14;
    pointer-events: none;
  }

  .hero-ghost-artwork {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.7);
  }

  .hero-ghost-icon {
    --mdc-icon-size: 84px;
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
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.18),
        rgba(255, 255, 255, 0.08)
      );
    color: inherit;
    cursor: pointer;
    transition:
      transform 0.18s ease,
      background 0.18s ease;
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
    background: color-mix(in srgb, var(--nodalia-accent) 28%, white 8%);
  }

  .icon-button.subtle {
    background: rgba(255, 255, 255, 0.08);
  }

  .icon-button.small {
    width: 38px;
    height: 38px;
  }

  .icon-button ha-icon {
    --mdc-icon-size: 19px;
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
    min-height: 38px;
    padding: 0.58rem 0.9rem;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    color: inherit;
    white-space: nowrap;
    cursor: pointer;
    transition:
      transform 0.18s ease,
      background 0.18s ease,
      color 0.18s ease;
  }

  .entity-chip.selected,
  .source-chip.selected,
  .group-chip.joined {
    background: color-mix(in srgb, var(--nodalia-accent) 18%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--nodalia-accent) 24%, transparent);
  }

  .entity-chip.playing::before,
  .group-chip.joined::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--nodalia-accent) 70%, white);
  }

  .action-chip {
    background: color-mix(in srgb, var(--nodalia-accent) 10%, transparent);
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
    padding: 13px;
    border-radius: 20px;
    background: color-mix(in srgb, var(--primary-text-color) 3%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 6%, transparent);
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
    font-size: 0.96rem;
    font-weight: 700;
  }

  .section-header p,
  .transport-header p {
    margin: 2px 0 0;
    color: var(--secondary-text-color);
    font-size: 0.82rem;
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
    width: 58px;
    height: 58px;
  }

  .play-button ha-icon {
    --mdc-icon-size: 28px;
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
    font-size: 0.82rem;
  }

  input[type="range"] {
    width: 100%;
    margin: 0;
    accent-color: var(--nodalia-accent);
  }

  .section {
    display: grid;
    gap: 12px;
  }

  .detail-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
  }

  .detail-card {
    display: grid;
    gap: 4px;
    padding: 12px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.04);
  }

  .detail-label {
    color: var(--secondary-text-color);
    font-size: 0.78rem;
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
    padding: 10px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.04);
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
    background: color-mix(in srgb, var(--nodalia-accent) 14%, transparent);
  }

  .queue-thumb {
    width: 52px;
    height: 52px;
    overflow: hidden;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.08);
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
    font-size: 0.84rem;
  }

  .queue-row .icon-button {
    width: 36px;
    height: 36px;
  }

  .queue-empty {
    color: var(--secondary-text-color);
    font-size: 0.9rem;
  }

  .queue-clear {
    padding: 0.5rem 0.8rem;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--nodalia-accent) 10%, transparent);
    color: inherit;
    cursor: pointer;
  }

  .details-toggle {
    background: transparent;
  }

  .collapsed .hero {
    padding: 14px;
  }

  .collapsed .artwork-button {
    width: 72px;
    height: 72px;
    border-radius: 18px;
  }

  .collapsed .hero-title {
    font-size: 1.12rem;
  }

  .notice {
    padding: 16px;
    color: var(--secondary-text-color);
  }

  .queue-loading {
    color: var(--secondary-text-color);
    font-size: 0.88rem;
  }

  @media (max-width: 640px) {
    .shell {
      padding: 10px;
    }

    .hero-layout {
      grid-template-columns: 72px minmax(0, 1fr);
      gap: 12px;
    }

    .artwork-button {
      width: 72px;
      height: 72px;
      border-radius: 18px;
    }

    .hero-ghost {
      width: 96px;
      height: 96px;
      right: -8px;
      bottom: -10px;
    }
  }
`;
