const fs = require("fs")
const path = require("path")


const {langsType}  = require('../src/settings')

const dirList = foreachDir([
  // path.resolve(__dirname, '../src/views'), 
  // path.resolve(__dirname, '../src/layout'), 
  // path.resolve(__dirname, '../src/components'),
  // path.resolve(__dirname, '../src/components/VueSku')
])

// createLang(dirList, langsType)

function foreachDir (filePathList) {
  const DirList = []
  filePathList.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let fileNameList = []
      // console.log(filePath)
      const fileList = fs.readdirSync(filePath)
      fileList.forEach(name => {
        const fileName = path.resolve(filePath, `./${name}`)
        const stat = fs.statSync(fileName)
        if (stat.isDirectory()) {
          // let templatePath = fileName.replace(/views/, 'views1')
          if(!fs.existsSync(fileName) ) {
            fs.mkdirSync(fileName)
          }
          // !fs.existsSync(fileName) && fs.mkdirSync(fileName)
          fileNameList = [...fileNameList, ...(foreachDir([fileName])).flat()]
        } else {
          fileNameList.push(fileName)
        }
      })
      DirList.push(fileNameList)
    }
  })
  return DirList
}

function createLang(dirList, langs) {
  let langObj = {}
  for(let key in langs) {
    const lang = langs[key]
    langObj[lang.name] = {}
  }
  matchRouter(langObj)
  dirList.forEach(fileNameList => {
    langObj = match(fileNameList, langObj)
  })
  // for(let key in langs) {
  //   const lang = langs[key]
  //   fs.writeFileSync(lang.path, JSON.stringify(langObj[lang.name]))
  //   if(key !== 'zh') {
  //     // translate(langObj[lang.name], lang)
  //   }
  // }
}

function matchRouter (langObj) {
  const router = fs.readFileSync(path.resolve(__dirname, '../src/router/asyncRouter.js')).toString()
  router.replace(/[\u4e00-\u9fa5]+/g, value => {
    insetWord(langObj, value)
  })
}

function match(fileNameList, langObj) {
  
  fileNameList.forEach(file => {
    // 中文标点符号
    const punctuationReg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g
    // 中文
    const cnReg = /[\u4e00-\u9fa5][A-z0-9/\s]*[\u4e00-\u9fa5]*/g
    // 标签中的中文及标点符号
    const tagCnAndPunReg = />[\s]*[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]+[\s]*</g
    // 中文带标点符号
    const cnAndPunReg = /[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]+/g
    // 标签中的中文
    const tagCnReg = />[\s]*([\u4e00-\u9fa5]\s*)+[\s]*</g
    // 属性中的中文
    const propCnReg = /\S+="([\u4e00-\u9fa5]\s*)+"/g
    // 属性中的中文及标点符号
    const propCnAndPunReg = /\S+="[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]+"/g
    // js 中的中文
    const jsCnReg = /<script[\d\D]*<\/script>/g
    // template 
    const templateReg = /<template>[\d\D]*<\/template>/

    // 三目运算符 中的中文
    // :tag-name="id!=''? '编辑商品': '新增商品'"
    const ternaryReg = /\?\s{0,1}['"][\u4e00-\u9fa5]+['"]\s{0,1}:\s{0,1}['"][\u4e00-\u9fa5]+'"/g

    // 接口提示信息
    // res.msg | data.msg | res.data.msg
    const apiHintReg = /[res|data|res.data].msg/g

    // 带引号的中文
    const qmCnReg = /['"][\u4e00-\u9fa5]+\s{0,1}[\u4e00-\u9fa5|A-z0-9\/\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]*[!|?]{0,1}['"]/g
    const content = fs.readFileSync(file)
    let template = content.toString().replace(tagCnReg, (value) => {
      // console.log(value)
      value = value.replace(cnReg, val => { 
        insetWord(langObj, val)
        return `{{ $t('${val}') }}`
      })
      return value
    })
    template = template.replace(propCnReg, (value) => {
      // console.log(value)
      value = value.replace(cnReg, val => {
        insetWord(langObj, val)
        return `$t('${val}')`
      })
      return `:${value}`
    })
    template = template.replace(tagCnAndPunReg, (value) => {
      value = value.replace(cnAndPunReg, val => { 
        return "{{ `" + val + "` }}"
      })
      value = value.replace(punctuationReg, val => {
        insetWord(langObj, val)
        return "${" + `$t('${val}')` + "}"
      })
      value = value.replace(cnReg, val => {
        insetWord(langObj, val)
        return "${" + `$t('${val}')` + "}"
      })
     
      return value
    }) 
    template = template.replace(propCnAndPunReg, (value) => {
      // console.log(value, 'old')
      value = value.replace(cnAndPunReg, val => { 
        return "`" + val + "`"
      })
      value = value.replace(punctuationReg, val => {
        insetWord(langObj, val)
        return "${" + `$t('${val}')` + "}"
      })
      value = value.replace(cnReg, val => {
        insetWord(langObj, val)
        return "${" + `$t('${val}')` + "}"
      })
      // console.log(value, 'new')
      return `:${value}`
    })
    template = template.replace(jsCnReg, (value) => {
      value = value.replace(qmCnReg, val => {
        console.log(val, 'dd')
        val = val.replace(/['"]/g, '')
        val = val.replace(cnReg, v => {
          // console.log(v)
          insetWord(langObj, v)
          return "${" + `this.$t('${v}')` + "}"
        })
        val = val.replace(punctuationReg, v => {
          // console.log(v)
          insetWord(langObj, v)
          return "${" + `this.$t('${v}')` + "}" 
        })
        return '`' + val + '`'
      })
      
      return value
    })

    template = template.replace(ternaryReg, (value) => {
      // console.log(value)
      value = value.replace(qmCnReg, val => {
        // console.log(val, 'dd')
        val = val.replace(/['"]/g, '')
        val = val.replace(cnReg, v => {
          // console.log(v)
          insetWord(langObj, v)
          return "${" + `$t('${v}')` + "}"
        })
        val = val.replace(punctuationReg, v => {
          // console.log(v)
          insetWord(langObj, v)
          return "${" + `$t('${v}')` + "}" 
        })
        return '`' + val + '`'
      })
      
      return value
    })
    template = template.replace(apiHintReg, (value) => {
      // console.log(value)
      value = value.replace(val => {
        return `this.$t(${val})`
      })
      return value
    })
    // let templatePath = file.replace(/views/, 'views1')
    // fs.writeFileSync(file, template)
  })
  return langObj
}
function insetWord (langObj, val) {
  for (let lan in langObj) {
    const message = langObj[lan]
    if(!message[val]) {
      message[val] = lan === 'zh' ? val : ''
    }
  }
}
// console.log(translateVal)

function translate(langObj, langSetting)  {
  const en = []
  const valueList = Object.keys(langObj)
  valueList.forEach((item, index) => {
    // console.log(`"${item}",`)
    langObj[item] = en[index]
  })
  fs.writeFileSync(langSetting.path, JSON.stringify(langObj))
  console.log(langObj)
}
