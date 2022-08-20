---
layout: ../../layouts/post.astro
title: My Home Assistant Setup
client: Self
publishDate: 2022-04-01 00:00:00
img: https://res.cloudinary.com/dxpmd7aef/image/upload/v1601824306/ha_dashboard_f3707f9624.png
description: |
  My personal Home Assistant setup.
tags:
  - home assistant
  - work in progress
---

## Dashboard

This is my Home Assistant Dashboard. It contains everything 'at a glance' so the thermostat can be set and the lights can be turned on or off in individual rooms. Here, you can also see all the temperatures of rooms, the weather, my calendar and media controls for the TV and Nest Hub

![ha_dashboard.png](https://res.cloudinary.com/dxpmd7aef/image/upload/v1601824306/ha_dashboard_f3707f9624.png)

## Automations

### Living Room/Dining Room

Lights switch on at 3 points in the night using my Zigbee light sensors. On each trigger, the lights will turn brighter, which gives a more gradual change as the sun goes down.

__SCREENSHOTS HERE__

## Kitchen

Lights in this room are turned on via a Zigbee motion sensor (__LINK__) when the light level is low enough. This device has a state where it will trigger off after a few minutes of people not being in the room.

__SCREENSHOT_HERE__

## Misc

- Do not disturb button

__SCREENSHOT_HERE__

- Cube
- NFC
- Light Switches
- Phone low battery Alexa notifications

## Scripts

### Heating boost

This is a solution I made from when we converted from an old boiler which used to have a 'boost' button which turned the heating or/and hot water. The button on the dashboard triggers the script which sets the thermostat temperature sets the 'next period time' to one hour in the future.

## Smart Devices

- Yeelight bulbs (__LINKS__)
- Google Nest(Home) Hub
- 3+ Google Home / Mini
- Echo Dot
- __TODO__

### Zigbee / ZHA

- Light sensors
- Motion / human body sensor
- Button
- Switch
- Aqara Light Switch (No Neutral)
- Cube
- __TODO__

## DIY Devices

### WLED

#### Wall Light

__TODO__
__Seperate article?__

#### Home Assistant Box

__TODO__
__Seperate article?__

#### Lamp

__TODO__
__Seperate article??__

### ESPHome

__TODO__

- Kitchen led strips
- __TODO__

# Christmas

My setup changes (as you might imagine) at Christmas time, however a lot of my all year round setup gets reused.

## Bought/Customized

- Sonoff/Off-brand plugs and power strips flashed with ESPHome
- Yeelight bulb in a translucent 'present' bought from IKEA.

## DIY Devices

### WLED

- WS2811 living room ceiling lights
- Tree in WS2812b string/wire lights

## Misc

__TODO__
