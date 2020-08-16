import { v4 as uuid } from 'uuid';
import * as fp from 'fastify-plugin';
import { cls } from './logger.session';
import { REQUEST_INFO, REQUEST_ID_HEADER } from './logger.constants';

function requestContext(fastify, opts, next) {
  fastify.addHook('onRequest', (req, res, done) => {
    const requestId = req.headers[REQUEST_ID_HEADER] || uuid();
    cls.bindEmitter(req.raw);
    cls.bindEmitter(res.res);
    cls.runWith(() => {
      done();
    }, {
      [REQUEST_INFO]: { requestId }
    });
  });
  next();
}

// @ts-ignore
export const requestContextPlugin = fp(requestContext, {
  fastify: '3.x',
  name: 'fastify-request-context',
});