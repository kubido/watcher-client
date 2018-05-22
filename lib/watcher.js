const fs        = require('fs')
const io        = require('socket.io-client')
const chokidar  = require('chokidar')
const dirTree   = require('directory-tree')
const TreeGenerator = require('./tree-generator')

class Watcher{

  constructor(path, sessionName, host){
    let ioHost   = host || 'http://localhost:50001' 
    this.socket  = io(ioHost)
    this.watcher = chokidar.watch(path, {ignored: /node_modules/})
    this.path = path
    this.sessionName = sessionName
    this.ready = false
  }

  initialize(){
    this.watcher.on('ready', () => {this.onReady()} )
    this.watcher.on('all', (event,path) => this.onListen(event,path) )
    console.log('listening..')
  }

  onReady(){
    this.ready = true
    let treeStructures = TreeGenerator.scan(this.path, this.sessionName)
    this.socket.emit('ready', treeStructures)
  }

  onListen(event, path){
    if( ['add', 'change', 'unlink'].includes(event) && this.ready ) {          
      this.eventHandler(event,path)
      console.log('emitting..', event)
    }
  }

  eventHandler(event, path){
    let treeStructures = TreeGenerator.scan(this.path)
    if(event == "change"){
      treeStructures.fileStr = fs.readFileSync(path, 'utf8')
    }
    this.socket.emit(event, treeStructures)
  }

}

module.exports = Watcher
