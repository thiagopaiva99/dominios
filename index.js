#! /usr/bin/env node
'use strict'

// require do node-fetch
const fetch  = require('node-fetch')

module.exports = ( url ) => fetch(`https://registro.br/ajax/avail/${url}`).then(res => res.json())
