import { rest, type MockedRequest } from 'msw';
import type { CodePayload } from '@/types/codeContent';

const mockCodeApi = {
  getCodes: rest.get('*/code', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'success',
        status: 'success',
        resultMap: {
          codeList: [
            {
              id: '6361d5461292968b0f28f39f',
              title: 'gsap example',
              HTML: {
                language: 'HTML',
                content: '<span>123</span>\n<span class=\"cursor\">_</span>\n<div class=\"box\"></div>\n<div class=\"box2\"></div>\n<div class=\"box3\"></div>\n\n<section class=\"section4\">\n  <ul class=\"loop\">\n    <li>\n      <span> THE F2E THE F2E THE F2E THE F2E </span\n      ><span> THE F2E THE F2E THE F2E THE F2E </span>\n    </li>\n    <li>\n      <span> THE F2E THE F2E THE F2E THE F2E </span>\n      <span> THE F2E THE F2E THE F2E THE F2E </span>\n    </li>\n    <li>\n      <span> THE F2E THE F2E THE F2E THE F2E </span>\n      <span> THE F2E THE F2E THE F2E THE F2E </span>\n    </li>\n  </ul>\n</section>\n',
                resources: []
              },
              CSS: {
                language: 'CSS',
                content: '.box {\n  background-color: aqua;\n  width: 50px;\n  height: 50px;\n}\n\n.box2 {\n  background-color: red;\n  width: 50px;\n  height: 50px;\n}\n\n.box3 {\n  background-color: pink;\n  width: 50px;\n  height: 50px;\n}\n\n.section4 {\n  height: 100vh;\n  overflow: hidden;\n  max-width: 100%;\n}\n\n.loop {\n  display: inline-block;\n  font-family: \"Dela Gothic One\";\n  font-size: 5rem;\n  color: transparent;\n  white-space: nowrap;\n  height: 100%;\n  -webkit-text-stroke: 1px black;\n}\n\n.loop > span {\n  display: inline-block;\n}\n',
                resources: []
              },
              JS: {
                language: 'JavaScript',
                content: "gsap.registerPlugin(ScrollTrigger, TextPlugin);\ngsap.fromTo(\n  '.cursor',\n  0,\n  { visibility: 'hidden' },\n  {\n    visibility: 'visible',\n    yoyo: true,\n    repeat: -1,\n    repeatDelay: 0.3,\n  }\n);\ngsap.to('.box', { x: 100, duration: 1 });\ngsap.to('.box', { y: 100, duration: 1, delay: 1 });\ngsap.from('.box2', { x: 200, opacity: 0, duration: 1 });\ngsap.fromTo(\n  '.box3',\n  { autoAlpha: 0.3 },\n  { autoAlpha: 1, duration: 1, repeat: - 1 },\n);\n\ngsap.to('.loop', {\n  xPercent: '-50',\n  ease: 'none',\n  duration: 10,\n  repeat: -1,\n});\n",
                resources: [
                  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js',
                  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/ScrollTrigger.min.js',
                  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/TextPlugin.min.js'
                ]
              },
              VUE: {
                language: 'Vue',
                content: '',
                resources: []
              },
              codeTemplate: 'ES6'
            },
            {
              id: '6364b39ce4d306caed2ba54a',
              title: 'Vanilla Tilt',
              HTML: {
                language: 'HTML',
                content: "<section class=\"section\">\r\n  <img\r\n    src=\"https://cdn.pixabay.com/photo/2022/09/25/09/58/houses-7477950_960_720.jpg\"\r\n    class=\"image\"\r\n    alt=\"image1\"\r\n    width=\"300\"\r\n  />\r\n  <img\r\n    src=\"https://cdn.pixabay.com/photo/2022/08/22/19/02/landscape-7404347_960_720.jpg\"\r\n    class=\"image\"\r\n    alt=\"imgae2\"\r\n    width=\"300\"\r\n  />\r\n  <img\r\n    src=\"https://cdn.pixabay.com/photo/2022/08/25/09/59/mountains-7409870_960_720.jpg\"\r\n    class=\"image\"\r\n    alt=\"image3\"\r\n    width=\"300\"\r\n  />\r\n</section>",
                resources: []
              },
              CSS: {
                language: 'SCSS',
                content: ".section {\r\n  padding: 20px;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-evenly;\r\n  gap: 20px;\r\n  background: #f5f5f5;\r\n  img {\r\n    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),\r\n      0 8px 10px -6px rgb(0 0 0 / 0.1);\r\n  }\r\n}",
                resources: []
              },
              JS: {
                language: 'JavaScript',
                content: "import VanillaTilt from 'vanilla-tilt';\r\n\r\nArray.from(document.querySelectorAll('.image')).forEach(image => {\r\n  VanillaTilt.init(image, {\r\n    max: 25,\r\n    scale: 1.1,\r\n    speed: 1000,\r\n  });\r\n});\r\n",
                resources: []
              },
              VUE: {
                language: 'Vue',
                content: '',
                resources: []
              },
              codeTemplate: 'ES6'
            },
          ],
          page: 1,
          totalPage: 1,
          totalSize: 2
        },
      }),
    );
  }),
  postCode: rest.post('*/code', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'save code success',
        status: 'success',
        resultMap: {
          code: { _id: 'post123' },
        },
      }),
    );
  }),
  putCode: rest.put('*/code/:codeId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'update code success',
        status: 'success',
        resultMap: {
          code: { _id: req.params.codeId },
        },
      }),
    );
  }),
};

export default mockCodeApi;
