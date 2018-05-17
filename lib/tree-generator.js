const dirTree   = require('directory-tree')

class TreeGenerator{

  static scan(path){
    let tree = dirTree(path, {exclude:/node_modules|\.git/})
    return this.generate(tree)
  }

  static generate(tree){
    let obj = this.generateObj(tree)
    if(tree.children){
      obj['children'] = tree.children.map( child => {
        return this.generate(child, true)
      })
    }
    return obj
  }

  static generateObj(tree, isChild=false){
    let isFile = tree.name.match(/\.[0-9a-z]+$/)
    let obj = { text: tree.name }
    if(isChild) { obj.id    = new Date().valueOf() }
    if(isFile)  { obj.type  = "file" }

    return obj
  }



}

module.exports = TreeGenerator