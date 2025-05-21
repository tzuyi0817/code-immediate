import { http, HttpResponse } from 'msw';

export const mockCdnApi = {
  search: http.get('*/libraries', async ({ request }) => {
    const search = new URL(request.url).searchParams.get('search');

    if (search === 'cdnjs') {
      return HttpResponse.json({ message: 'cdnjs search error' }, { status: 400 });
    }
    return HttpResponse.json({
      results: [
        {
          description:
            'Responsive jQuery slider, featuring modular architecture, CSS3 animations, touch swipe, animated layers, retina, lazy loading and much more.',
          fileType: 'css',
          filename: 'css/slider-pro.min.css',
          latest: 'https://cdnjs.cloudflare.com/ajax/libs/slider-pro/1.6.0/css/slider-pro.min.css',
          name: 'slider-pro',
          objectID: 'e2b6d3885efe3_dashboard_generated_id',
          version: '1.6.0',
        },
        {
          description:
            'Easy to use CSS Colors in your project with simple class you can colorize your text or background with the class of color name.',
          fileType: 'css',
          filename: 's3-colors.min.css',
          latest: 'https://cdnjs.cloudflare.com/ajax/libs/s3colors/1.0/s3-colors.min.css',
          name: 's3colors',
          objectID: 'e27553d4e33f4_dashboard_generated_id',
          version: '1.0',
        },
      ],
    });
  }),
};
