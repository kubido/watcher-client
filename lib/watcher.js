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
  }

  initialize(){
    this.watcher.on('ready', () => this.readyHandler(this.path) )

    this.watcher
      .on('all', (event, path) => {
        switch (event) {
          case 'add':
            this.addHandler(path)
            break;
          case 'change':
            this.changeHandler(path)
            break;
          case 'unlink':
            this.unlinkHandler(path)
            break;
          default:
            let tree = dirTree(__dirname);
        }
      })
  }

  readyHandler(path){
    let tree = dirTree(path, {exclude:/node_modules/})
    let treeStructures = TreeGenerator.generate(tree)
    soclet.emit('ready', treeStructures)
  }

  addHandler(path){
    const contentFile = fs.readFileSync(path, 'utf8')
    socket.emit('add', {
      name: path,
      content: contentFile
    })
  }

  changeHandler(path){
    const contentFile = fs.readFileSync(path, 'utf8')
    socket.emit('change', {
      name: path,
      content: contentFile
    })
  }

  unlinkHandler(path){
    socket.emit('unlink', path)
  }


}

module.exports = Watcher
