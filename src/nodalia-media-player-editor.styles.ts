import { css } from "lit";

export const editorStyles = css`
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
