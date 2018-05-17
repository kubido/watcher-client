class TreeGenerator{

  static generate(tree){
    let obj = this.generateObj(tree)
    if(tree.children){
      obj['children'] = tree.children.map( child => {
        return this.generate(child)
      })
    }
    return obj
  }

  static generateObj(tree){
    return {
      id: new Date().valueOf(),
      text: tree.name,
    }
  }

}

module.exports = TreeGenerator
