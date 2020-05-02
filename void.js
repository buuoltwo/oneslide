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
// let raw = `
// # nihao 
// enfon
// ## diosnf

// ### einfw

// ### infwefn

// ## enknr

// kndwekldn
// `
// let res = convert(raw)
// console.log(res)