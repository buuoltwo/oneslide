let $ = s => document.querySelector(s)
let $$ = s => document.querySelectorAll(s)

const isMain = s => (/^#{1,2}(?!#)/).test(s)
const isSub =  s => (/^#{3}(?!#)/).test(s)
const convert = raw => {
  let arr = raw.split(/\n(?=\s*#)/).filter(s => s !== "").map(a => a.trim())
  let html = ""
  for(let i = 0; i < arr.length; i++) {
    if(arr[i+1] !== undefined) {
      if(isMain(arr[i]) && isMain(arr[i+1])) {
        html +=`
        <section data-markdown>
          <textarea data-template>
          ${arr[i]}
          </textarea>
        </section>
        `
      }
      else if(isMain(arr[i]) && isSub(arr[i+1])) {
        html +=`
        <section>
          <section data-markdown>
            <textarea data-template>
            ${arr[i]}
            </textarea>
          </section>
        `
      }
      else if(isSub(arr[i]) && isSub(arr[i+1])) {
        html +=`
        <section data-markdown>
          <textarea data-template>
          ${arr[i]}
          </textarea>
        </section>
        `
      }
      else if(isSub(arr[i]) && isMain(arr[i+1])) {
        html +=`
        <section data-markdown>
          <textarea data-template>
          ${arr[i]}
          </textarea>
        </section>
      </section>
        `
      }
    }
    else{
      if(isSub(arr[i])) {
        html +=`
        <section data-markdown>
          <textarea data-template>
          ${arr[i]}
          </textarea>
        </section>
      </section>
        `
      }
      else if(isMain(arr[i])) {
        html +=`
        <section data-markdown>
          <textarea data-template>
          ${arr[i]}
          </textarea>
        </section>
        `
      }

    }
  }
  return html
}


const Editor = {
  init(){
    console.log("Editor init...")
    this.$input = $(".content .body textarea")
    this.$btn = $(".content .body button")


    this.bind()
    this.start()
  },

  bind() {
    this.$btn.onclick = () => {
      localStorage.markdown = this.$input.value
      location.reload()
    }
  },

  start() {
    let TPL = `
# One Slide
- **朋友，**快到碗里来！

极简Markdown-PPT项目基于reveal.js进行开发。

## Trying!
- 在页面顶端可以进入设置菜单>
- 空格键让你不会错过子页面！

### 我代表子页面

### 更多功能请查看菜单指引！

## 欢迎你的使用！
buuoltwo©2020
`
    this.markdown = localStorage.markdown || TPL
    this.$input.value = this.markdown
    let html = convert(this.markdown)
    // console.log(html)
    document.querySelector(".slides").innerHTML = html
    // More info https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize({
      controls: true,
      progress: true,
      center: localStorage.align === "left-top" ? false : true,
      hash: true,
    
      transition: localStorage.transition || 'slide', // none/fade/slide/convex/concave/zoom
    
      // More info https://github.com/hakimel/reveal.js#dependencies
      dependencies: [
        { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'plugin/highlight/highlight.js' },
        { src: 'plugin/search/search.js', async: true },
        { src: 'plugin/zoom-js/zoom.js', async: true },
        { src: 'plugin/notes/notes.js', async: true }
      ]
    });
  }
  
}



const imgLoader = {
  init() {
    console.log("imgLoader init..")
    this.$textarea = $(".content .body textarea")
    this.$input = $(".content .body input[type='file']")

    // this.AVinit()
    AV.init({
      appId: "trDSLVcojssAIwRJBp6YWjML-gzGzoHsz",
      appKey: "i2zInAUMkf2TmIznArfNB0Sv",
      serverURL: "https://trdslvco.lc-cn-n1-shared.com"
    })
    
    this.bind()
  },

  // AVinit() {
  //   AV.init({
  //     appId: "trDSLVcojssAIwRJBp6YWjML-gzGzoHsz",
  //     appKey: "i2zInAUMkf2TmIznArfNB0Sv",
  //     serverURL: "https://trdslvco.lc-cn-n1-shared.com"
  //   })
  // },

  bind() {
    console.log("bind ..")
    let self = this
    this.$input.onchange = function() {
      console.log("click")
      if (this.files.length > 0) {
        console.log(this.files)
        const localFile = this.files[0]
        const file = new AV.File(encodeURI(localFile.name), localFile)
        console.log(localFile)
        self.insertText(`![图片上传中0%]()`)
        file.save({ 
          keepFileName: true,
          onprogress: (progress) => {
            console.log(progress)
            self.insertText(`![图片上传中${progress}]()`)
          }
        })
        .then((file) => {
          console.log(`文件保存完成。objectId：${file.id}`)
          console.log(file)
          console.log(`${file.attributes.name} + ${file.attributes.url}`)
          // $textarea.value = decodeURI(file.attributes.name) + file.attributes.url
          self.insertText(`![${file.attributes.name}](${file.attributes.url})`)
        }, (error) => {
        console.log(error)
        })
      }
    }
  },

  insertText(insertText="") {
    let $textarea = this.$textarea
    let start = $textarea.selectionStart
    let end = $textarea.selectionEnd
    let oldText = $textarea.value
  
    $textarea.value = `${oldText.substring(0, start)}${insertText} ${oldText.substring(end)}`
    $textarea.focus()
    $textarea.setSelectionRange(start, start + insertText.length)
  }
}



const Menu = {
  init() {
    console.log("Menu init...")
    this.$iconSetting = $(".control .iconfont")
    this.$iconClose = $(".menu .icon-close")
    this.$menu = $(".menu")
    this.$$tabs = $$(".menu .tab")
    this.$$panels = $$(".menu .content")

    this.bind()
  },

  bind() {
    this.$iconSetting.onclick = () => {
      this.$menu.classList.add("open")
    }
    this.$iconClose.onclick = () => {
      this.$menu.classList.remove("open")
    }
    this.$$tabs.forEach($tab => $tab.onclick = () => {
      this.$$tabs.forEach($tab => $tab.classList.remove("active"))
      $tab.classList.add("active")
      let index = Array.from(this.$$tabs).indexOf($tab)
      this.$$panels.forEach($panels => $panels.classList.remove("active"))
      this.$$panels[index].classList.add("active")
    })
  }
}



const Theme = {
  init() {
    console.log("Theme init>>")
    this.$$figures = $$(".content .body .themes figure")
    this.theme = localStorage.theme || "serif"
    this.$transition = $('.theme .transition')
    this.$align = $('.theme .align')
    this.$reveal = $(".reveal")

    this.bind()
    this.start()
  },

  bind(){
    this.$$figures.forEach($figure => $figure.onclick = () => {
      this.$$figures.forEach($figure => $figure.classList.remove("select"))
      $figure.classList.add("select")
      localStorage.theme = $figure.dataset.theme
      location.reload()

    })
    this.$transition.onchange = function() {
      localStorage.transition = this.value
      location.reload()
    }

    this.$align.onchange = function() {
      localStorage.align = this.value
      location.reload()
    }
  },

  start() {
    // <link rel="stylesheet" href="css/theme/blood.css" id="theme">
    let link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = `css/theme/${this.theme}.css`
    document.head.appendChild(link)
    // document.head.removeChild(link)

    $(`[data-theme=${this.theme}]`).classList.add("select")
    this.$transition.value = localStorage.transition || 'slide'
    this.$align.value = localStorage.align || 'center'
    if( this.$align.value === "left-top") {
      this.$reveal.classList.add("left-top")
    }
  }
}



const Download = {
  init() {
    console.log("Download init..")
    this.$download = $(".menu .download")

    this.bind()
  },

  bind() {
    this.$download.addEventListener("click", () => {
      console.log("second event")
      this.href()
    })
  },

  href() {
    let $link = document.createElement('a')
    $link.setAttribute('target', '_blank')
    // $link.setAttribute('href', "https://www.baidu.com")
    // $link.setAttribute('href', location.href.replace(/#\/.+/, '?print-pdf'))
    $link.setAttribute('href', location.href.replace(/#\//, '?print-pdf'))
    $link.click()

  }
}



const App = {
  init() {
    [...arguments].forEach(Module => Module.init())
  }
}
App.init(Menu, Editor, Theme, Download, imgLoader)

