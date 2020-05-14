import posts from './_posts';
import { Http2ServerResponse } from 'http2';

const lookup = new Map();
posts.forEach((post) => {
  lookup.set(post.slug, JSON.stringify(post));
});

export function get(req: any, res: Http2ServerResponse, _next: (err?: any) => void) {
  // the `slug` parameter is available because
  // this file is called [slug].json.js
  const { slug } = req.params;

  if (lookup.has(slug)) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    res.end(lookup.get(slug));
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json'
    });

    res.end(
      JSON.stringify({
        message: `Not found`
      })
    );
  }
}
