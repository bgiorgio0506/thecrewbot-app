const settings = require('electron-settings',);
const path = require('path',);

let langpath;

//Lang set default Italian
const getLang = () => {
    //console.log(settings.getSync('config.lang'))
    if (settings.getSync('config.lang',) === undefined){
        settings.set('config.lang', 'it',);
        //'/lang/'+ process.env.APP_DEF_LANG_FILE
        //let path = '../../lang/'+process.env.APP_DEF_LANG_FILE
        //let fileString = process.env.APP_DEF_LANG_FILE;
        langpath = path.join('C:\\thecrewbot-app\\', 'lang\\it.json',);
        return require(langpath,);
    }
    else {
        //let langprefix = settings.getSync('config.lang')
        //let path ='../../lang/'+settings.getSync('config.lang')+'.json'
        langpath = path.join('C:\\thecrewbot-app\\', 'lang\\'+settings.getSync('config.lang',)+'.json',);
        return require(langpath,);
    }
};

export default getLang;
