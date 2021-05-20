import Localbase from 'localbase'
let db = new Localbase('db')
export default (context,inject) => {
  inject('db', db)
}