const argv = process.argv.slice(2)
const sessionName = argv[0]
const host = argv[1]

const Watcher = require('./lib/watcher')
const watcher = new Watcher(__dirname, sessionName, host)

watcher.initialize()