import "./chunk-N3ETBM74.js";

// src/loaders.ts
import { createExternalPackageIconLoader } from "@iconify/utils/lib/loader/external-pkg";
import { FileSystemIconLoader as IconifyFileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";
function FileSystemIconLoader(dir, transform) {
  return IconifyFileSystemIconLoader(dir, transform);
}
function ExternalPackageIconLoader(packageName, autoInstall) {
  return createExternalPackageIconLoader(packageName, autoInstall);
}
export {
  ExternalPackageIconLoader,
  FileSystemIconLoader
};
