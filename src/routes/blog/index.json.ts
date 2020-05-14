import posts from './_posts';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

const contents = JSON.stringify(
  posts.map((post) => {
    return {
      title: post.title,
      slug: post.slug
    };
  })
);

export function get(req: Http2ServerRequest, res: Http2ServerResponse) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(contents);
}
