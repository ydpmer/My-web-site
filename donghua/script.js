const getNestedMarkup = (tagName, amount) => {
  return [
    Array(amount).fill(`<${tagName}>`).join(''),
    Array(amount).fill(`</${tagName}>`).join('')
  ].join('')
}

const query = document.querySelector.bind(document)

const setCSSProperty = (key, value, scope = window.document.documentElement) => {
  scope.style.setProperty(key, value)
}

const renderTemplate = (template, data) => {
  Object.keys(data).forEach(key => {
    const pattern = new RegExp(`{${key}}`, 'g')
    template = template.replace(pattern, data[key])
  })
  return template
}

const settings = [{
  id: 'rotation',
  type: 'range',
  min: -360,
  max: 360,
  value: 90,
  hasCSSProperty: true,
  get formattedValue() {
    return `${this.value}deg`
  }
}, {
  id: 'container-width',
  type: 'range',
  max: 1000,
  value: 300,
  hasCSSProperty: true,
  get formattedValue() {
    return `${this.value}px`
  },
}, {
  id: 'container-height',
  type: 'range',
  max: 1000,
  value: 50,
  hasCSSProperty: true,
  get formattedValue() {
    return `${this.value}px`
  }
}, {
  id: 'element-width',
  type: 'range',
  max: 200,
  value: 96,
  hasCSSProperty: true,
  get formattedValue() {
    return `${this.value}%`
  }
}, {
  id: 'element-height',
  type: 'range',
  max: 200,
  value: 101,
  hasCSSProperty: true,
  get formattedValue() {
    return `${this.value}%`
  }
}, {
  id: 'element-bottom',
  type: 'range',
  min: -100,
  max: 100,
  value: -30,
  hasCSSProperty: true,
  get formattedValue() {
    return `${this.value}%`
  }
}, {
  id: 'element-right',
  type: 'range',
  min: -100,
  max: 100,
  value: -24,
  hasCSSProperty: true,
  get formattedValue() {
    return `${this.value}%`
  }
}, {
  id: 'elements',
  type: 'range',
  min: 1,
  max: 100,
  value: 100,
  fn() {
    const container = query('#scene')
    container.innerHTML = getNestedMarkup('div', +this.value)
  }
}, {
  id: 'outline-width',
  type: 'range',
  min: 1,
  max: 50,
  value: 1,
  hasCSSProperty: true,
  get formattedValue() {
    return `${this.value}px`
  }
}, {
  id: 'body-background-color',
  type: 'color',
  value: '#0a061e',
  hasCSSProperty: true
}, {
  id: 'border-top-color',
  type: 'color',
  value: '#ce92af',
  hasCSSProperty: true
}, {
  id: 'border-right-color',
  type: 'color',
  value: '#00ffcc',
  hasCSSProperty: true
}]

const settingTemplates = {
  range: query('#range-setting-template').innerHTML,
  color: query('#color-setting-template').innerHTML
}

const applySetting = (setting) => {
  const currentValue = setting.formattedValue || setting.value
  query(`#${setting.id}-value`).innerText = currentValue
  if (setting.hasCSSProperty) {
    setCSSProperty(`--${setting.id}`, currentValue)
  }
  if (setting.fn) {
    setting.fn(currentValue)
  }
}

const renderSettings = () => {
  const renderedSettings = settings
    .map(setting => {
      const template = settingTemplates[setting.type]
      return renderTemplate(template, setting)
    })
    .join('')

  query('#settings').innerHTML = renderedSettings
  settings.forEach(applySetting)

  query('#print').addEventListener('click', () => {
    const settingsText = JSON.stringify(settings, null, 2)
    console.log('const settings =', settingsText)

    const variablesText = query('html').style.cssText
      .split(';')
      .map(v => ` ${v}`)
      .join(';\n')
      .trim()
    console.log(':root {\n', variablesText, '\n}')
  })
}

const listenSettings = () => {
  settings.forEach(setting => {
    query(`#${setting.id}-input`).addEventListener('input', e => {
      setting.value = e.currentTarget.value
      applySetting(setting)
    })
  })
}

const animateRotation = (increment, interval) => {
  const rotation = settings.find(s => s.id === 'rotation')
  return setInterval(() => {
    rotation.value += increment
    applySetting(rotation)
  }, interval)
}

renderSettings()
listenSettings()
animateRotation(0.01, 1000 / 60)