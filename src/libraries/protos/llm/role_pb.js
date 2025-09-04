// source: role.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() {
  if (this) { return this; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  if (typeof self !== 'undefined') { return self; }
  return Function('return this')();
}.call(null));

goog.exportSymbol('proto.llm.Role', null, global);
/**
 * @enum {number}
 */
proto.llm.Role = {
  ROLE_UNSPECIFIED: 0,
  ROLE_ASSISTANT: 1,
  ROLE_USER: 2,
  ROLE_SYSTEM: 3
};

goog.object.extend(exports, proto.llm);
