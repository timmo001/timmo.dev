---
layout: ../../layouts/post.astro
title: WLED Wake Up Lamp
client: Self
publishDate: 2022-03-15 00:00:00
img: https://res.cloudinary.com/dxpmd7aef/image/upload/v1661000308/IMG_20201025_165747_9d28149243_cropped_rbzrzv.jpg
description: |
  Building a wake up light using WLED and Home Assistant.
tags:
  - lighting
  - wled
  - home assistant
---

I recently bought a glass lamp shade from [AliExpress](https://www.aliexpress.com/item/4000384823406.html). This works great on my desk with [WLED](http://wled.me), but it gave me the idea to make a second lamp as a wake-up light.

![IMG_20201025_165747.jpg](https://res.cloudinary.com/dxpmd7aef/image/upload/v1603645183/medium_IMG_20201025_165747_9d28149243.jpg)

## Parts

- ESP8266 or an equivalent ESP chip compatible with WLED.
- WS2812b or similar digital LED 1-2m strip. I recommend [these](https://www.aliexpress.com/item/2036819167.html) from BTF-Lighting. Never had any issues with this brand. 30/m LEDs are fine as the lamp does a nice job of diffusing the light.
- Gyverlamp from [AliExpress](https://www.aliexpress.com/item/4000384823406.html)
- A cardboard tube (Kitchen roll or wrapping paper tubes are simple solutions) cut to size

## Setup

Pretty simple here:

- Wrap a cardboard tube with the LED strip, tape down to secure, and wire into ESP chip.
- Flash chip with WLED, connect to WiFi, give it a name, set the led count and integrate with Home Assistant via discovery or IP.

## Home Assistant Automation

### Datetime Helper

Once you have connected your light to Home Assistant, create an input_datetime helper via the frontend or in yaml.

![Input Datetime](https://res.cloudinary.com/dxpmd7aef/image/upload/v1603643000/Selection_001_4a35a4f14a.png)

Then, create an automation to set the datetime helper.

```yaml
timestamp: "{{ as_timestamp(states('sensor.oneplus_8_pro_next_alarm')) -  as_timestamp('1970-01-01T00:04:00.000Z') }}"
```

What I am doing here is getting the timestamp of my phone's next alarm, minus 4 minutes. This means the script will start 4 minutes before the alarm triggers, and the script will be halfway by the time your alarm triggers.

Here is the full automation in yaml to paste and adjust:

```yaml
alias: Wake Up Datetime
description: 'Sets datetime helper to next alarm'
trigger:
  - platform: state
    entity_id: sensor.oneplus_8_pro_next_alarm
condition:
  - condition: not
    conditions:
      - condition: state
        entity_id: sensor.oneplus_8_pro_next_alarm
        state: unavaliable
action:
  - service: input_datetime.set_datetime
    data:
      timestamp: >-
        {{ as_timestamp(states('sensor.oneplus_8_pro_next_alarm')) -
        as_timestamp('1970-01-01T00:04:00.000Z') }}
    entity_id: input_datetime.next_wake_up
mode: single
```

### Script

Here is the full script I use, which:

- Sends a sticky notification to my phone which is configured in another automation to cancel the script and turn off the lamp when dismissed.
- Sets the WLED effect and palette to the one of choice. I set this back after the script is complete after a delay.
- Sets the brightness to 10, then increases it every 2 seconds by 1. Adjust this to your own taste. This repeats until the lamp is at full brightness (255 or 100%)

```yaml
alias: Wake Up Lamp
sequence:
  - service: notify.mobile_app_oneplus_8_pro
    data:
      title: Wake up Routine
      message: Clear to turn off lamp
      data:
        channel: Wake up Routine
        color: '#FFC107'
        priority: high
        sticky: true
        ttl: 0
  - service: wled.effect
    data:
      effect: Sunrise
      intensity: 220
      palette: Sunset
      speed: 120
    entity_id: light.bedroom_lamp
  - service: light.turn_on
    data:
      brightness: 10
    entity_id: light.bedroom_lamp
  - repeat:
      count: '245'
      sequence:
        - delay: '00:00:02'
        - service: light.turn_on
          data:
            brightness: '{{ state_attr(''light.bedroom_lamp'', ''brightness'') + 1 }}'
          entity_id: light.bedroom_lamp
mode: restart
```

This whole script takes about 8 minutes in total.

### Automation

Pretty simple this one, trigger the script at the date and time that we set in the helper.

```yaml
alias: Wake Up Routine
description: ''
trigger:
  - platform: time
    at: input_datetime.next_wake_up
condition: []
action:
  - service: script.wake_up_lamp
    data: {}
mode: restart
```

### Turning off the lamp

So you've got up, turned off your alarm and now want to turn off the lamp? You could automate this by using the next alarm change again, but instead, lets turn off the lamp using the mobile app dismissed event instead.

```yaml
alias: Wake up Routine Complete
description: ''
trigger:
  - platform: event
    event_type: mobile_app_notification_cleared
    event_data:
      title: Wake up Routine
condition: []
action:
  - service: script.turn_off
    data: {}
    entity_id: script.wake_up_lamp
  - delay: '00:00:02'
  - type: turn_off
    device_id: 75c8258ae843e73d8d8f5426d57f4e41
    entity_id: light.bedroom_lamp
    domain: light
mode: restart
```

This simply looks for the event with the title of the notification we used before and cancels the script, then turns off the lamp.

---

And that's it, 100% Home Assistant only automations to wake you up in the morning!

Let me know what you think and throw me any suggestions or improvements via the usual social links
