const dirTree   = require('directory-tree')

class TreeGenerator{

  static scan(path, sessionName){
    let tree = dirTree(path, {exclude:/node_modules|\.git/})
    let treeDirectory   = this.generate(tree)
    if(sessionName){ treeDirectory.text = sessionName }
    return treeDirectory
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

  static generateObj(tree, isChild=false, path){
    let isFile = tree.name.match(/\.[0-9a-z]+$/)
    let obj = { text: tree.name, li_attr: {path: tree.path} }
    if(isChild) { obj.id    = new Date().valueOf() }
    if(isFile)  { obj.type  = "file" }

    return obj
  }



}

module.exports = TreeGenerator