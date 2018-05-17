const argv = process.argv.slice(2)
const sessionName = argv[0]

const Watcher = require('./lib/watcher')
const watcher= new Watcher(__dirname, sessionName)
watcher.initialize()

