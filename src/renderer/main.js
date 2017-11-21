import RendererConfig from './libs/rendererConfig'
// force retrieve config before vue start.
RendererConfig().then(() => {
  require('./init')
})
