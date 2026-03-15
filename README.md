# Nodalia Media Player

Tarjeta `custom:nodalia-media-player` para Home Assistant creada desde cero con una direccion visual inspirada en Mushroom y una base pensada para crecer hacia funciones avanzadas tipo Music Assistant.

## Lo que ya incluye

- Estetica suave y compacta para integrarse bien con dashboards basados en Mushroom.
- Control multi-entidad en una sola tarjeta con chips horizontales.
- Auto-seleccion de la entidad que esta reproduciendo.
- Controles principales de transporte, encendido y mute.
- Seek y volumen con sliders nativos.
- Seleccion rapida de fuente.
- Agrupacion rapida con `media_player.join` y `media_player.unjoin`.
- Cola opcional usando `mass_queue` si esta disponible.
- Chips de acciones personalizadas con plantillas simples.
- Editor visual basico.
- Traducciones integradas priorizando `es`, con `en` como respaldo.

## Instalacion para desarrollo

```bash
npm install
npm run build
```

Para probarlo ya con HACS, el artefacto que usa el repositorio es `nodalia-media-player.js` en la raiz.

## Instalacion con HACS como repositorio personalizado

1. En HACS ve a los tres puntos de la esquina superior derecha.
2. Entra en `Custom repositories`.
3. Añade este repositorio como categoria `Dashboard`.
4. Instala `Nodalia Media Player`.
5. Comprueba que HACS haya añadido el recurso:

```text
/hacsfiles/nodalia-media-player/nodalia-media-player.js
```

6. Usa la tarjeta en Lovelace:

```yaml
type: custom:nodalia-media-player
entities:
  - media_player.salon
```

## Configuracion minima

```yaml
type: custom:nodalia-media-player
entities:
  - media_player.salon
```

## Ejemplo mas completo

```yaml
type: custom:nodalia-media-player
name: Zona de musica
language: es
appearance:
  accent_color: "#8ec5ff"
  artwork_fit: cover
behavior:
  auto_select_active: true
  collapse_when_idle: true
  show_sources: true
  show_group_controls: true
queue:
  enabled: true
  limit: 6
entities:
  - entity: media_player.salon
    name: Salon
    icon: mdi:speaker-wireless
  - entity: media_player.cocina
    name: Cocina
    icon: mdi:speaker
actions:
  - label: Favoritos
    icon: mdi:heart-outline
    action: navigate
    navigation_path: /lovelace-musica/favoritos
  - label: Playlist
    icon: mdi:playlist-music
    action: call-service
    service: media_player.play_media
    service_data:
      entity_id: "{{ entity }}"
      media_content_type: playlist
      media_content_id: spotify:playlist:xxxxxxxx
```

## Editor visual

El editor usa una sintaxis compacta para la lista de reproductores:

```text
media_player.salon | Salon | mdi:speaker-wireless | media_player.soundbar | #8ec5ff
media_player.cocina | Cocina | mdi:speaker
```

Formato:

```text
entidad | nombre | icono | volume_entity | color
```

Las acciones avanzadas se editan como JSON. Puedes usar estas variables en `service_data`, `navigation_path` o `url_path`:

- `{{ entity }}`
- `{{ media_title }}`
- `{{ media_artist }}`
- `{{ media_album }}`
- `{{ source }}`
- `{{ app_name }}`
- `{{ friendly_name }}`

## Hoja de ruta natural para la siguiente iteracion

- Busqueda integrada para Music Assistant.
- Vista mas rica de cola con mover arriba, siguiente y eliminar.
- Editor visual mas completo para acciones y overrides por entidad.
- Mas idiomas ademas de `es` y `en`.
