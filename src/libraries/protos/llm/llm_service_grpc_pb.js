// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var post_text_request_pb = require('./post_text_request_pb.js');
var post_text_response_pb = require('./post_text_response_pb.js');

function serialize_llm_GenerateRequest(arg) {
  if (!(arg instanceof post_text_request_pb.GenerateRequest)) {
    throw new Error('Expected argument of type llm.GenerateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_llm_GenerateRequest(buffer_arg) {
  return post_text_request_pb.GenerateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_llm_GenerateResponse(arg) {
  if (!(arg instanceof post_text_response_pb.GenerateResponse)) {
    throw new Error('Expected argument of type llm.GenerateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_llm_GenerateResponse(buffer_arg) {
  return post_text_response_pb.GenerateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var LLMService = exports.LLMService = {
  // Simple generation call
generateText: {
    path: '/llm.LLM/GenerateText',
    requestStream: false,
    responseStream: false,
    requestType: post_text_request_pb.GenerateRequest,
    responseType: post_text_response_pb.GenerateResponse,
    requestSerialize: serialize_llm_GenerateRequest,
    requestDeserialize: deserialize_llm_GenerateRequest,
    responseSerialize: serialize_llm_GenerateResponse,
    responseDeserialize: deserialize_llm_GenerateResponse,
  },
};

exports.LLMClient = grpc.makeGenericClientConstructor(LLMService, 'LLM');
