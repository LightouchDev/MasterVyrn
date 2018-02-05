'use strict'

import { remote } from 'electron'

window.jsonStorage = remote.getGlobal('jsonStorage')
