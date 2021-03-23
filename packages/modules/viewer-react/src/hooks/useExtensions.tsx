/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  ExternalServerExtensionLoader,
  IModelApp,
} from "@bentley/imodeljs-frontend";
import { useEffect, useState } from "react";

import { ExtensionInstance, ExtensionUrl, ViewerExtension } from "../types";

export function useExtensions(extensions?: ViewerExtension[]): boolean {
  const [extensionUrls, setExtensionUrls] = useState<ExtensionUrl[]>([]);
  const [extensionInstances, setExtensionInstances] = useState<
    ExtensionInstance[]
  >([]);
  const [extensionsLoaded, setExtensionsLoaded] = useState<boolean>(
    !extensions
  );

  useEffect(() => {
    //TODO add the ability to remove extensions?
    const urls = [...extensionUrls];
    const instances = [...extensionInstances];
    let urlsUpdated = false;
    let instancesUpdated = false;
    extensions?.forEach((extension) => {
      const url = extension.url;
      if (url) {
        if (!urls.some((extensionUrl) => extensionUrl.url === url)) {
          urls.push({ url, loaded: false });
          urlsUpdated = true;
        }
      }

      if (
        !instances.some(
          (extensionInstance) => extensionInstance.name === extension.name
        )
      ) {
        instances.push({
          name: extension.name,
          loaded: false,
          version: extension.version,
          args: extension.args,
        });
        instancesUpdated = true;
      }
    });
    if (urlsUpdated) {
      setExtensionUrls(urls);
    }
    if (instancesUpdated) {
      setExtensionInstances(instances);
    }
  }, [extensions]);

  useEffect(() => {
    extensionUrls?.forEach((extensionUrl) => {
      if (!extensionUrl.loaded) {
        IModelApp.extensionAdmin.addExtensionLoaderFront(
          new ExternalServerExtensionLoader(extensionUrl.url)
        );
        extensionUrl.loaded = true;
      }
    });
  }, [extensionUrls]);

  useEffect(() => {
    extensionInstances?.forEach((extensionInstance) => {
      if (!extensionInstance.loaded) {
        IModelApp.extensionAdmin
          .loadExtension(
            extensionInstance.name,
            extensionInstance.version,
            extensionInstance.args
          )
          .then(() => (extensionInstance.loaded = true))
          .catch((error) => {
            throw error;
          });
      }
    });
    setExtensionsLoaded(true);
  }, [extensionInstances]);

  return extensionsLoaded;
}
