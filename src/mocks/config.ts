const mockResources = [
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/ScrollTrigger.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/TextPlugin.min.js',
];

export const CODES_RESPONSE_RESULT_MAP = {
  1: {
    codeList: [
      {
        id: '6361d5461292968b0f28f39f',
        title: 'gsap example',
        HTML: {
          language: 'HTML',
          content:
            '<span>123</span>\n<span class="cursor">_</span>\n<div class="box"></div>\n<div class="box2"></div>\n<div class="box3"></div>\n\n<section class="section4">\n  <ul class="loop">\n    <li>\n      <span> THE F2E THE F2E THE F2E THE F2E </span\n      ><span> THE F2E THE F2E THE F2E THE F2E </span>\n    </li>\n    <li>\n      <span> THE F2E THE F2E THE F2E THE F2E </span>\n      <span> THE F2E THE F2E THE F2E THE F2E </span>\n    </li>\n    <li>\n      <span> THE F2E THE F2E THE F2E THE F2E </span>\n      <span> THE F2E THE F2E THE F2E THE F2E </span>\n    </li>\n  </ul>\n</section>\n',
          resources: [],
        },
        CSS: {
          language: 'CSS',
          content:
            '.box {\n  background-color: aqua;\n  width: 50px;\n  height: 50px;\n}\n\n.box2 {\n  background-color: red;\n  width: 50px;\n  height: 50px;\n}\n\n.box3 {\n  background-color: pink;\n  width: 50px;\n  height: 50px;\n}\n\n.section4 {\n  height: 100vh;\n  overflow: hidden;\n  max-width: 100%;\n}\n\n.loop {\n  display: inline-block;\n  font-family: "Dela Gothic One";\n  font-size: 5rem;\n  color: transparent;\n  white-space: nowrap;\n  height: 100%;\n  -webkit-text-stroke: 1px black;\n}\n\n.loop > span {\n  display: inline-block;\n}\n',
          resources: [],
        },
        JS: {
          language: 'JavaScript',
          content:
            "gsap.registerPlugin(ScrollTrigger, TextPlugin);\ngsap.fromTo(\n  '.cursor',\n  0,\n  { visibility: 'hidden' },\n  {\n    visibility: 'visible',\n    yoyo: true,\n    repeat: -1,\n    repeatDelay: 0.3,\n  }\n);\ngsap.to('.box', { x: 100, duration: 1 });\ngsap.to('.box', { y: 100, duration: 1, delay: 1 });\ngsap.from('.box2', { x: 200, opacity: 0, duration: 1 });\ngsap.fromTo(\n  '.box3',\n  { autoAlpha: 0.3 },\n  { autoAlpha: 1, duration: 1, repeat: - 1 },\n);\n\ngsap.to('.loop', {\n  xPercent: '-50',\n  ease: 'none',\n  duration: 10,\n  repeat: -1,\n});\n",
          resources: mockResources,
        },
        VUE: {
          language: 'Vue',
          content: '',
          resources: [],
        },
        codeTemplate: 'ES6',
      },
      {
        id: '6361e441f9d1f613d4c83ac1',
        title: 'Gsap Timeline',
        HTML: {
          language: 'HTML',
          content: '<div class="box"></div>\r\n<div class="box2"></div>',
          resources: [],
        },
        CSS: {
          language: 'SCSS',
          content:
            '.box {\r\n  width: 50px;\r\n  height: 50px;\r\n  background-color: pink;\r\n}\r\n\r\n.box2 {\r\n  width: 50px;\r\n  height: 50px;\r\n  background-color: blue;\r\n}',
          resources: [],
        },
        JS: {
          language: 'JavaScript',
          content:
            "const timeline = gsap.timeline();\r\n\r\ntimeline\r\n  .to('.box', { x: 100, duration: 1 })\r\n  .to('.box', { y: 100, duration: 1 })\r\n  .to('.box2', { x: 100, duration: 1}, '<');",
          resources: mockResources,
        },
        VUE: {
          language: 'Vue',
          content: '',
          resources: [],
        },
        codeTemplate: 'ES6',
      },
      {
        id: '63620189596c5bf23ba1b47b',
        title: 'Gsap ScrollTrigger',
        HTML: {
          language: 'HTML',
          content:
            '<section class="section">\n  <div class="gate gate-left gate-left-1 z-20">\n    <i class="fa-solid fa-house"></i>\n  </div>\n  <div class="gate gate-right gate-right-1 z-20">\n    <h2>WEEK 1</h2>\n  </div>\n  <div class="gate gate-left gate-left-2 z-10">\n    <i class="fa-solid fa-cloud"></i>\n  </div>\n  <div class="gate gate-right gate-right-2 z-10">\n    <h2>WEEK 2</h2>\n  </div>\n  <div class="gate gate-left gate-left-3 z-0">\n    <i class="fa-solid fa-location-dot"></i>\n  </div>\n  <div class="gate gate-right gate-right-3 z-0">\n    <h2>WEEK 3</h2>\n  </div>\n</section>\n',
          resources: [],
        },
        CSS: {
          language: 'SCSS',
          content:
            'section {\r\n  position: relative;\r\n  display: flex;\r\n  height: 100vh;\r\n  overflow: hidden;\r\n  i {\r\n    font-size: 10rem;\r\n  }\r\n  .gate {\r\n    position: absolute;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    width: 50%;\r\n    height: 100%;\r\n    &-left {\r\n      left: 0;\r\n      &-1 {\r\n        background-color: #e7ffa9;\r\n        i {\r\n          color: #ffa09d;\r\n        }\r\n      }\r\n      &-2 {\r\n        background-color: #005f62;\r\n        i {\r\n          color: #ffa09d;\r\n        }\r\n      }\r\n      &-3 {\r\n        background-color: #ddfbed;\r\n        i {\r\n          color: #ffa09d;\r\n        }\r\n      }\r\n    }\r\n    &-right {\r\n      right: 0;\r\n      &-1 {\r\n        background-color: #ffe7a9;\r\n        i {\r\n          color: #69f0ae;\r\n        }\r\n      }\r\n      &-2 {\r\n        background-color: #559496;\r\n        i {\r\n          color: #69f0ae;\r\n        }\r\n      }\r\n      &-3 {\r\n        background-color: #69f0ae;\r\n        i {\r\n          color: #69f0ae;\r\n        }\r\n      }\r\n    }\r\n  }\r\n  .z-0 {\r\n    z-index: 0;\r\n  }\r\n  .z-10 {\r\n    z-index: 10;\r\n  }\r\n  .z-20 {\r\n    z-index: 20;\r\n  }\r\n}',
          resources: ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'],
        },
        JS: {
          language: 'JavaScript',
          content:
            "// gsap.registerPlugin(ScrollTrigger, TextPlugin);\r\n\r\nconst scrollTrigger = gsap.timeline({\r\n  scrollTrigger: {\r\n    trigger: '.section',\r\n    // markers: true,\r\n    pin: true,\r\n    scrub: true,\r\n  },\r\n});\r\n\r\nscrollTrigger\r\n  .to('.gate-left-1', { yPercent: '-100' })\r\n  .to('.gate-right-1', { yPercent: '100' }, '<')\r\n  .to('.gate-left-2', { yPercent: '-100' })\r\n  .to('.gate-right-2', { yPercent: '100' }, '<')",
          resources: mockResources,
        },
        VUE: {
          language: 'Vue',
          content: '',
          resources: [],
        },
        codeTemplate: 'ES6',
      },
      {
        id: '63647379431c6f96e1a9ddf8',
        title: 'Gsap ScrollTrigger Multiple',
        HTML: {
          language: 'HTML',
          content:
            '<div class="wrap"></div>\r\n<div class="wrap left">\r\n  <div class="box"></div>\r\n  <h2>\r\n    <span class="text"></span>\r\n    <span class="cursor">_</span>\r\n  </h2>\r\n</div>\r\n\r\n<div class="wrap right">\r\n  <div class="box"></div>\r\n  <h2>\r\n    <span class="text"></span>\r\n    <span class="cursor">_</span>\r\n  </h2>\r\n</div>\r\n\r\n<div class="wrap left">\r\n  <div class="box"></div>\r\n  <h2>\r\n    <span class="text"></span>\r\n    <span class="cursor">_</span>\r\n  </h2>\r\n</div>',
          resources: [],
        },
        CSS: {
          language: 'SCSS',
          content:
            '* {\r\n  background-color: rgb(0, 0, 131);\r\n  height: 200vh;\r\n}\r\n\r\n.wrap {\r\n  height: 100vh;\r\n  width: fit-content;\r\n  &.left {\r\n    padding-left: 120px;\r\n  }\r\n  &.right {\r\n    padding-left: calc(100% - 320px);\r\n  }\r\n  .box {\r\n    width: 200px;\r\n    height: 200px;\r\n    background-color: white;\r\n  }\r\n  h2 {\r\n    // padding: 50px;\r\n    color: white;\r\n  }\r\n}',
          resources: [],
        },
        JS: {
          language: 'JavaScript',
          content:
            "gsap.registerPlugin(ScrollTrigger, TextPlugin);\r\ngsap.utils.toArray('.wrap').forEach(wrap => {\r\n  ScrollTrigger.create({\r\n    trigger: wrap,\r\n    // markers: true,\r\n    onEnter() {\r\n      animated(wrap)\r\n    },\r\n    onLeave() {\r\n      hide(wrap)\r\n    },\r\n    onEnterBack() {\r\n      animated(wrap)\r\n    },\r\n  })\r\n});\r\n\r\ngsap.utils.toArray('.text').forEach((text, index) => {\r\n  gsap.to(text, {\r\n    text: `這是測試 GSAP${index} !!!!!!!!!!!!!`,\r\n    duration: 1.5,\r\n    scrollTrigger: {\r\n      trigger: text,\r\n      toggleActions: 'play pause resume reset',\r\n    },\r\n  })\r\n});\r\n\r\ngsap.fromTo(\r\n  '.cursor',\r\n  0,\r\n  { visibility: 'hidden'},\r\n  { \r\n    visibility: 'visible',\r\n    yoyo: true,\r\n    repeat: -1,\r\n    repeatDelay: 0.3,\r\n  },\r\n);\r\n\r\nfunction animated(element) {\r\n  const x = element.classList.contains('right') ? 200 : -200;\r\n\r\n  element.style.transform = `translate(${x}px, 0px)`;\r\n  gsap.fromTo(\r\n    element,\r\n    { x, y: 0, opacity: 0, visibility: 'hidden' },\r\n    {\r\n      x: 0,\r\n      y: 0,\r\n      duration: 1,\r\n      delay: 0.2,\r\n      visibility: 'visible',\r\n      opacity: 1,\r\n      ease: 'expo',\r\n      overwrite: 'auto',\r\n    }\r\n  )\r\n}\r\n\r\nfunction hide(element) {\r\n  gsap.set(element, { opacity: 0, visibility: 'hidden' });\r\n}",
          resources: mockResources,
        },
        VUE: {
          language: 'Vue',
          content: '',
          resources: [],
        },
        codeTemplate: 'ES6',
      },
      {
        id: '6364b39ce4d306caed2ba54a',
        title: 'Vanilla Tilt',
        HTML: {
          language: 'HTML',
          content:
            '<section class="section">\r\n  <img\r\n    src="https://cdn.pixabay.com/photo/2022/09/25/09/58/houses-7477950_960_720.jpg"\r\n    class="image"\r\n    alt="image1"\r\n    width="300"\r\n  />\r\n  <img\r\n    src="https://cdn.pixabay.com/photo/2022/08/22/19/02/landscape-7404347_960_720.jpg"\r\n    class="image"\r\n    alt="imgae2"\r\n    width="300"\r\n  />\r\n  <img\r\n    src="https://cdn.pixabay.com/photo/2022/08/25/09/59/mountains-7409870_960_720.jpg"\r\n    class="image"\r\n    alt="image3"\r\n    width="300"\r\n  />\r\n</section>',
          resources: [],
        },
        CSS: {
          language: 'SCSS',
          content:
            '.section {\r\n  padding: 20px;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-evenly;\r\n  gap: 20px;\r\n  background: #f5f5f5;\r\n  img {\r\n    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),\r\n      0 8px 10px -6px rgb(0 0 0 / 0.1);\r\n  }\r\n}',
          resources: [],
        },
        JS: {
          language: 'JavaScript',
          content:
            "import VanillaTilt from 'vanilla-tilt';\r\n\r\nArray.from(document.querySelectorAll('.image')).forEach(image => {\r\n  VanillaTilt.init(image, {\r\n    max: 25,\r\n    scale: 1.1,\r\n    speed: 1000,\r\n  });\r\n});\r\n",
          resources: [],
        },
        VUE: {
          language: 'Vue',
          content: '',
          resources: [],
        },
        codeTemplate: 'ES6',
      },
      {
        id: '6364c61278dfb8dffd1a61d4',
        title: 'PDF Sign',
        HTML: {
          language: 'HTML',
          content:
            '<canvas id="canvas"></canvas>\r\n<img class="show_img" width="250" height="150" />\r\n\r\n<div style="padding: 5px;">\r\n  <button class="clear_btn">Clear</button>\r\n  <button class="save_btn">Save</button>\r\n</div>\r\n\r\n<input type="file" accept="application/pdf" />\r\n<button class="download">download</button>',
          resources: [],
        },
        CSS: {
          language: 'SCSS',
          content:
            '#canvas {\r\n  margin-top: 5px;\r\n  margin-left: 5px;\r\n  border: 1px solid #000;\r\n}\r\n\r\n.show_img {\r\n  border: 1px solid;\r\n}',
          resources: [],
        },
        JS: {
          language: 'JavaScript',
          content:
            "const canvas = new fabric.Canvas('canvas');\r\nconst pdf = new jsPDF();\r\nconst ctx = canvas.getContext('2d');\r\nconst clearBtn = document.querySelector('.clear_btn');\r\nconst saveBtn = document.querySelector('.save_btn');\r\nconst sign = document.querySelector('.show_img');\r\nconst input = document.querySelector('input');\r\nconst download = document.querySelector('.download');\r\nconst Base64Prefix = 'data:application/pdf;base64,';\r\n\r\npdfjsLib.GlobalWorkerOptions.workerSrc = \"https://mozilla.github.io/pdf.js/build/pdf.worker.js\";\r\nctx.lineWidth = 4;\r\nctx.lineCap = 'round';\r\nsign.src = localStorage.getItem('PDF_Sign');\r\n// canvas.addEventListener('mousedown', startPosition);\r\n// canvas.addEventListener('mouseup', finishedPosition);\r\n// canvas.addEventListener(\"mouseleave\", finishedPosition);\r\n// canvas.addEventListener('mousemove', draw);\r\nsaveBtn.addEventListener('click', saveSign);\r\nclearBtn.addEventListener('click', clearSign);\r\ninput.addEventListener('change', async (event) => {\r\n  canvas.requestRenderAll();\r\n  const pdfData = await printPDF(event.target.files[0]);\r\n  const pdfImage = await pdfToImage(pdfData);\r\n\r\n  canvas.setWidth(pdfImage.width / window.devicePixelRatio);\r\n  canvas.setHeight(pdfImage.height / window.devicePixelRatio);\r\n  canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));\r\n});\r\n\r\nsign.addEventListener('click', () => {\r\n  fabric.Image.fromURL(sign.src, (image) => {\r\n\t  image.top = 400;\r\n\t\timage.scaleX = 0.5;\r\n    image.scaleY = 0.5;\r\n    canvas.add(image);\r\n  });\r\n});\r\n\r\ndownload.addEventListener('click', () => {\r\n  const image = canvas.toDataURL();\r\n  const width = pdf.internal.pageSize.width;\r\n  const height = pdf.internal.pageSize.height;\r\n\r\n  pdf.addImage(image, \"png\", 0, 0, width, height);\r\n  pdf.save('download.pdf');\r\n});\r\n\r\nfunction startPosition(event) {\r\n  event.preventDefault();\r\n  ctx.isPainting = true;\r\n  ctx.beginPath();\r\n}\r\n\r\nfunction finishedPosition() {\r\n  ctx.isPainting = false;\r\n  ctx.closePath();\r\n}\r\n\r\nfunction draw(event) {\r\n  if (!ctx.isPainting) return;\r\n  const { x, y } = getPaintPosition(event);\r\n\r\n  ctx.lineTo(x, y);\r\n  ctx.stroke();\r\n}\r\n\r\nfunction getPaintPosition(event) {\r\n  const canvasSize = canvas.getBoundingClientRect();\r\n  \r\n  return {\r\n    x: event.clientX - canvasSize.left,\r\n    y: event.clientY - canvasSize.top, \r\n  };\r\n}\r\n\r\nfunction clearSign() {\r\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\r\n}\r\n\r\nfunction saveSign() {\r\n  const sign = canvas.toDataURL();\r\n  sign.src = sign;\r\n  localStorage.setItem('PDF_Sign', sign);\r\n}\r\n\r\nfunction readBlob(blob) {\r\n  return new Promise((resolve, reject) => {\r\n    const reader = new FileReader();\r\n    reader.addEventListener('load', () => resolve(reader.result));\r\n    reader.addEventListener('error', reject);\r\n    reader.readAsDataURL(blob);\r\n  })\r\n}\r\n\r\nasync function printPDF(pdfData) {\r\n  const pdf = await readBlob(pdfData);\r\n  const data = atob(pdf.slice(Base64Prefix.length));\r\n  const pdfDoc = await pdfjsLib.getDocument({ data }).promise;\r\n  const pdfPage = await pdfDoc.getPage(1);\r\n  const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });\r\n  const canvas = document.createElement(\"canvas\");\r\n  const context = canvas.getContext(\"2d\");\r\n\r\n  canvas.height = viewport.height;\r\n  canvas.width = viewport.width;\r\n  const renderContext = {\r\n    canvasContext: context,\r\n    viewport,\r\n  };\r\n  const renderTask = pdfPage.render(renderContext);\r\n\r\n  return renderTask.promise.then(() => canvas);\r\n}\r\n\r\nfunction pdfToImage(pdfData) {\r\n  const scale = 1 / window.devicePixelRatio;\r\n\r\n  return new fabric.Image(pdfData, {\r\n    id: \"renderPDF\",\r\n    scaleX: scale,\r\n    scaleY: scale,\r\n  });\r\n}",
          resources: [
            'https://mozilla.github.io/pdf.js/build/pdf.js',
            'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.2.4/fabric.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.4/jspdf.min.js',
          ],
        },
        VUE: {
          language: 'Vue',
          content: '',
          resources: [],
        },
        codeTemplate: 'ES6',
      },
    ],
    page: '1',
    totalPage: 2,
    totalSize: 7,
  },
  2: {
    codeList: [
      {
        id: '6384835c90bb276dbedfc6ac',
        title: 'Glitch effect',
        HTML: {
          language: 'HTML',
          content:
            '<div class="text-magic" data-word="MixBlendMode">\r\n  MixBlendMode\r\n  <div class="white"></div>\r\n</div>',
          resources: [],
        },
        CSS: {
          language: 'SCSS',
          content:
            '.text-magic {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%) skewX(0deg);\n  font-size: 64px;\n  font-family: Raleway, Verdana, Arial, sans-serif;\n  animation: skewX 5s ease-in infinite;\n}\n\n.white {\n  position: absolute;\n  left: 0;\n  top: 15px;\n  width: 100%;\n  height: 3px;\n  background: #fff;\n  z-index: 4;\n  animation: whiteMove 3s ease-out infinite;\n  mix-blend-mode: luminosity;\n}\n\n.text-magic:before {\n  content: attr(data-word);\n  position: absolute;\n  top: 0;\n  left: 1px;\n  height: 0px;\n  color: rgba(255, 0, 0, 0.9);\n  overflow: hidden;\n  z-index: 2;\n  animation: redShadow 1.5s ease-in infinite;\n  -webkit-filter: contrast(200%);\n  text-shadow: 0.1px 0 0 red;\n  mix-blend-mode: color-burn;\n}\n\n.text-magic:after {\n  content: attr(data-word);\n  position: absolute;\n  top: 0;\n  left: -3px;\n  height: 64px;\n  color: rgba(0, 0, 0, 0.8);\n  overflow: hidden;\n  z-index: 3;\n  background: rgba(255, 255, 255, 0.9);\n  animation: redHeight 2s ease-out infinite;\n  -webkit-filter: contrast(200%);\n  mix-blend-mode: hard-light;\n}\n\n@keyframes redShadow {\n  20% {\n    left: -1px;\n    height: 32px;\n  }\n  60% {\n    left: 2px;\n    height: 6px;\n  }\n  100% {\n    left: -2px;\n    height: 42px;\n  }\n}\n\n@keyframes redHeight {\n  20% {\n    height: 42px;\n  }\n  35% {\n    height: 12px;\n  }\n  50% {\n    height: 40px;\n  }\n  60% {\n    height: 20px;\n  }\n  70% {\n    height: 34px;\n  }\n  80% {\n    height: 22px;\n  }\n  100% {\n    height: 0px;\n  }\n}\n\n@keyframes whiteMove {\n  8% {\n    top: 38px;\n  }\n  10% {\n    top: 8px;\n  }\n  12% {\n    top: 42px;\n  }\n  99% {\n    top: 36px;\n  }\n}\n\n@keyframes skewX {\n  78% {\n    transform: translate(-50%, -50%) skewX(0);\n  }\n  79% {\n    transform: translate(-50%, -50%) skewX(10deg);\n  }\n  80% {\n    transform: translate(-50%, -50%) skewX(-10deg);\n  }\n  81% {\n    transform: translate(-50%, -50%) skewX(0);\n  }\n}\n',
          resources: [],
        },
        JS: {
          language: 'JavaScript',
          content: '',
          resources: [],
        },
        VUE: {
          language: 'Vue',
          content: '',
          resources: [],
        },
        codeTemplate: 'ES6',
      },
    ],
    page: '2',
    totalPage: 2,
    totalSize: 7,
  },
} as const;
