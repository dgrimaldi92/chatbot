// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var get_content_request_pb = require('./get_content_request_pb.js');
var get_content_response_pb = require('./get_content_response_pb.js');

function serialize_scrape_GetScrapeRequest(arg) {
  if (!(arg instanceof get_content_request_pb.GetScrapeRequest)) {
    throw new Error('Expected argument of type scrape.GetScrapeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_scrape_GetScrapeRequest(buffer_arg) {
  return get_content_request_pb.GetScrapeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_scrape_GetScrapedResponse(arg) {
  if (!(arg instanceof get_content_response_pb.GetScrapedResponse)) {
    throw new Error('Expected argument of type scrape.GetScrapedResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_scrape_GetScrapedResponse(buffer_arg) {
  return get_content_response_pb.GetScrapedResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ScraperServiceService = exports.ScraperServiceService = {
  getScrapedText: {
    path: '/scrape.ScraperService/GetScrapedText',
    requestStream: false,
    responseStream: false,
    requestType: get_content_request_pb.GetScrapeRequest,
    responseType: get_content_response_pb.GetScrapedResponse,
    requestSerialize: serialize_scrape_GetScrapeRequest,
    requestDeserialize: deserialize_scrape_GetScrapeRequest,
    responseSerialize: serialize_scrape_GetScrapedResponse,
    responseDeserialize: deserialize_scrape_GetScrapedResponse,
  },
};

exports.ScraperServiceClient = grpc.makeGenericClientConstructor(ScraperServiceService, 'ScraperService');
