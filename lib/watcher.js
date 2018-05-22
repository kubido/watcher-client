const fs        = require('fs')
const io        = require('socket.io-client')
const socket    = io('http://localhost:50001')
const chokidar  = require('chokidar')
const dirTree   = require('directory-tree')

const TreeGenerator = require('./tree-generator')

class Watcher{

  constructor(path, sessionName){
    this.watcher = chokidar.watch(path, {ignored: /node_modules/})
    this.path = path
    this.sessionName = sessionName
    this.ready = false
  }

  initialize(){
    this.watcher.on('ready', () => {
      console.log('----------------ready')
      this.ready = true
      let treeStructures = TreeGenerator.scan(this.path)
      socket.emit('ready', treeStructures)
    } )

    this.watcher
      .on('all', (event, path) => {

        let events = ['add', 'change', 'unlink']

        if( events.includes(event) && this.ready ) {          
          this.eventHandler(event,path)
        }
      })
  }

  eventHandler(event, path){
    let treeStructures = TreeGenerator.scan(this.path)
    if(event == "change"){
      treeStructures.fileStr = fs.readFileSync(path, 'utf8')
    }
    socket.emit(event, treeStructures)
  }

  


}

module.exports = Watcher
