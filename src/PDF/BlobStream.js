import { Writable as WritableStream } from "stream-browserify";

const URL = window.URL || window.webkitURL || window.mozURL;

class BlobStream extends WritableStream {
  constructor() {
    super();
    this._chunks = [];
    this._blob = null;
    this.length = 0;
  }

  _write(chunk, encoding, callback) {
    // convert chunks to Uint8Arrays (e.g. Buffer when array fallback is being used)
    if (!(chunk instanceof Uint8Array)) chunk = new Uint8Array(chunk);

    this.length += chunk.length;
    this._chunks.push(chunk);
    callback();
  }

  toBlob(type) {
    type = type || "application/octet-stream";

    // cache the blob if needed
    if (!this._blob) {
      this._blob = new Blob(this._chunks, {
        type: type,
      });

      this._chunks = []; // free memory
    }

    // if the cached blob's type doesn't match the requested type, make a new blob
    if (this._blob.type !== type)
      this._blob = new Blob([this._blob], { type: type });

    return this._blob;
  }

  toBlobURL(type) {
    return URL.createObjectURL(this.toBlob(type));
  }
}

export default BlobStream;
