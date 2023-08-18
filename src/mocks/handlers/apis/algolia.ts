import { rest, type RestRequest } from 'msw';

const searchUrl = /https:\/\/.*algolia.*\/1\/indexes\/code-immediate\/query/;
const mockAlgoliaApi = {
  search: rest.all(searchUrl, (req: RestRequest<string>, res, ctx) => {
    const { query } = JSON.parse(req.body);

    if (query === 'algolia') {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'algolia search error',
        }),
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        hits: [
          {
            description: "Responsive jQuery slider, featuring modular architecture, CSS3 animations, touch swipe, animated layers, retina, lazy loading and much more.",
            fileType: "CSS",
            filename: "css/slider-pro.min.css",
            latest: "https://cdnjs.cloudflare.com/ajax/libs/slider-pro/1.6.0/css/slider-pro.min.css",
            name: "slider-pro",
            objectID: "e2b6d3885efe3_dashboard_generated_id",
            version: "1.6.0",
          },
          {
            description: "Easy to use CSS Colors in your project with simple class you can colorize your text or background with the class of color name.",
            fileType: "CSS",
            filename: "s3-colors.min.css",
            latest: "https://cdnjs.cloudflare.com/ajax/libs/s3colors/1.0/s3-colors.min.css",
            name: "s3colors",
            objectID: "e27553d4e33f4_dashboard_generated_id",
            version: "1.0",
          }
        ],
      }),
    );
  }),
};

export default mockAlgoliaApi;
