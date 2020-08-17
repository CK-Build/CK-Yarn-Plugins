import {MessageName, ReportError, Report, Workspace, scriptUtils, Manifest} from '@yarnpkg/core';
import {FakeFS, JailFS, xfs, PortablePath, ppath, Filename}                 from '@yarnpkg/fslib';
import {PassThrough, Stream}                                                from 'stream';
import tar                                                                  from 'tar-stream';
import {createGzip, gunzip}                                                 from 'zlib';



/**
 * Retrieve the manifest from a gzipped tarball.
 * @param tarballPath The path to the gzipped tarball.
 */
export async function getManifestFromTarball(tarballPath: PortablePath) {
  const tgz = await xfs.readFilePromise(tarballPath);
  return await getManifestFromTgzBuffer(tgz);
}

function gunzipPromise(data: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    gunzip(data, (error, result) => {
      if (error !== null) reject(error);
      resolve(result);
    });
  });
}

/**
 * Retrieve the manifest from a Buffer of a gzipped tarball.
 * @param buffer The gzipped tarball.
 */
async function getManifestFromTgzBuffer(buffer: Buffer) {
  return await getManifestFromTarballBuffer(await gunzipPromise(buffer));
}

function getManifestFromTarballBuffer(buffer: Buffer): Promise<Manifest | null> {
    const manifestPath = ppath.join(`package` as PortablePath, Manifest.fileName).toString();
    const extract = tar.extract();
    return new Promise<Manifest | null>((resolve) => {
      extract.on(`entry`, (header: { name: string }, stream: Stream, next: ()=>void) => {
        if (header.name !== manifestPath) {
          next();//we only seek for the manifest.
          return;
        }
        let chunks = ``;
        stream.on(`data`, data => chunks += data);
        stream.on(`end`, () => {
          extract.destroy();//destroy the stream, we dont need more data.
          resolve(Manifest.fromText(chunks));
        });
      });
      extract.on(`finish`, () => { //this should'nt be emitted if we destroy the stream, but it is :(
        //so we check here if the stream was destroyed.
        if (!extract.destroyed) {
          resolve(null);
        }
      });
      extract.write(buffer);
      extract.end();
    });
  }
