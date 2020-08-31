const settings = require('electron-settings')

//Lang set default Italian
const getLang = ()=>{
    if(settings.getSync('config.lang') === undefined){
        settings.set('config.lang', 'it')
        //'/lang/'+ process.env.APP_DEF_LANG_FILE
        return require('../../lang'+ process.env.APP_DEF_LANG_FILE)
      }
      else{
        return require('../../lang/'+settings.getSync('config.lang')+'.json')
    }
}

export default getLang