import RendererConfig from './libs/RendererConfig'
// force retrieve config before vue start.
RendererConfig().then(() => {
  require('./init')
})
