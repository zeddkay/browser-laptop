/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const { nativeImage } = require('electron')

// BrowserWindow ctor options which can be manually
// set after window creation
const optionsSetCompatible = new Set([
  'width',
  'height',
  'x',
  'y',
  'show',
  'fullscreen',
  'center',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'resizable',
  'movable',
  'alwaysOnTop',
  'focusable',
  'icon'
])

function canSetAllPropertiesOnExistingWindow (properties) {
  // cannot set properties we don't know about
  const anyPropertiesNotCompatible = Object.keys(properties)
    .some(optionKey =>
      !optionsSetCompatible.has(optionKey) && properties[optionKey] != null
    )
  return !anyPropertiesNotCompatible
}

function setPropertiesOnExistingWindow (browserWindow, properties) {
  // set size and position
  if (properties.x != null && properties.y != null) {
    browserWindow.setPosition(properties.x, properties.y)
  }
  if (properties.width != null && properties.height != null) {
    browserWindow.setSize(properties.width, properties.height)
  }
  if (properties.maxWidth != null && properties.maxHeight != null) {
    browserWindow.setMaximumSize(properties.maxWidth, properties.maxHeight)
  }
  if (properties.minWidth != null && properties.minHeight != null) {
    browserWindow.setMinimumSize(properties.minWidth, properties.minHeight)
  }
  if (properties.resizable != null) {
    browserWindow.setResizable(properties.resizable)
  }
  if (properties.center === true) {
    browserWindow.center()
  }
  if (properties.movable != null) {
    browserWindow.setMovable(properties.movable)
  }
  if (properties.parent != null || properties.parent === null) {
    browserWindow.setParent(properties.parent)
  }
  if (properties.icon != null) {
    let windowIcon
    if (typeof properties.icon === 'string') {
      try {
        windowIcon = nativeImage.createFromPath(properties.icon)
      } catch (e) {
        console.error('Error creating nativeImage instance from window icon path: ' + e.message)
        console.error(e)
      }
    } else { // there is no electron.nativeImage fn for detecting instanceof, so assume
      windowIcon = properties.icon
    }
    if (windowIcon) {
      browserWindow.setIcon(windowIcon)
    }
  }
  if (properties.show !== false) {
    browserWindow.show()
  }
  if (properties.fullscreen) {
    browserWindow.setFullScreen(true)
  }
  if (properties.alwaysOnTop) {
    browserWindow.setAlwaysOnTop(true)
  }
  if (properties.focusable != null) {
    browserWindow.setFocusable(properties.focusable)
  }
}

module.exports = {
  canSetAllPropertiesOnExistingWindow,
  setPropertiesOnExistingWindow
}
