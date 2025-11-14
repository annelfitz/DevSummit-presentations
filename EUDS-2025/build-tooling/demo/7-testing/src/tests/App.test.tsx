import { render, fireEvent } from "@testing-library/react";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { setupWorker } from "msw/browser";
import { http, HttpResponse, passthrough } from "msw";
import { beforeEach, it as itBase, expect, vi } from "vitest";
import Point from "@arcgis/core/geometry/Point";
import nearbySchoolsStub from "../__mock_data__/nearby-schools.json";
import App from "../App";

/**********************************
 * Mock service setup.
 **********************************/
const placesServiceInfo = {
  authentication: ApiKeyManager.fromKey("stub-api-key"),
  endpoint: "/arcgis/rest/services/places-service/v1/places/near-point",
};

const worker = setupWorker(
  // override request to the places service to return mock data
  http.get(placesServiceInfo.endpoint, () =>
    HttpResponse.json(nearbySchoolsStub),
  ),
  http.get("*", () => {
    passthrough(); // pass through remaining requests
  }),
);

const it = itBase.extend({
  worker: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      // Start the worker before the test.
      await worker.start({ quiet: true });
      // Expose the worker object on the test's context.
      await use(worker);
      // Stop the worker after the test is done.
      worker.stop();
    },
    {
      auto: true,
    },
  ],
});

/**********************************
 * Tests.
 **********************************/

let map: HTMLArcgisMapElement;
let results: ReturnType<typeof render>;

// render the app and send in the places service info, wait for map to stop updating
beforeEach(async () => {
  results = render(<App placesServiceInfo={placesServiceInfo} />);
  map = results.container.querySelector("arcgis-map")!;
  await vi.waitFor(() => expect(map.updating).toEqual(false), {
    timeout: 15000,
  });
});


// assert that app contains the elements we expect
it("renders", () => {
  const { container } = results;
  expect(container.querySelector("calcite-shell")).toBeInTheDocument();
  expect(container.querySelector("calcite-shell-panel")).toBeInTheDocument();
  expect(container.querySelector("arcgis-map")).toBeInTheDocument();
});

// simulate map click and assert that popup shows details for clicked feature
it("shows a popup details when a feature is clicked", async () => {
  const { container } = results;
  const mapPoint = new Point({ latitude: 40.9384275, longitude: -73.735152 });
  const event = new CustomEvent("arcgisViewClick", { detail: { mapPoint } });

  fireEvent(map, event);

  const popup = container.querySelector("arcgis-features")!;
  const panel = container.querySelector("calcite-panel")!;
  await vi.waitFor(() => {
    expect(popup.features).toHaveLength(1);
    expect(panel.description).toContain("Census tract");
  });
});

// simulate loading nearby schools for selected feature
// simulate loading nearby schools for selected feature
it("loads nearby schools for the selected feature", async () => {
  const { container } = results;
  const mapPoint = new Point({ latitude: 40.9384275, longitude: -73.735152 });
  const event = new CustomEvent("arcgisViewClick", { detail: { mapPoint } });

  fireEvent(map, event);
  const popup = queryShadowDOM<HTMLArcgisFeaturesElement>(
    "arcgis-features",
    container,
  )!;
  await vi.waitFor(() => expect(popup.features).toHaveLength(1));
  const action = queryShadowDOM<HTMLCalciteActionElement>(
    "calcite-action[title='Load nearby schools']",
    popup.shadowRoot!,
  );
  action!.click();

  await vi.waitFor(() =>
    expect(container.querySelectorAll("calcite-list-item")).toHaveLength(1),
  );
});

// simulate error when loading nearby schools
it("shows an error when loading schools fails", async () => {
  const { container } = results;
  worker.use(
    http.get(placesServiceInfo.endpoint, () =>
      // return a 500 error instead of stub response
      HttpResponse.json({ error: "error" }, { status: 500 }),
    ),
  );
  const mapPoint = new Point({ latitude: 40.9384275, longitude: -73.735152 });
  const event = new CustomEvent("arcgisViewClick", { detail: { mapPoint } });

  fireEvent(map, event);
  const popup = queryShadowDOM<HTMLArcgisFeaturesElement>(
    "arcgis-features",
    container,
  )!;
  await vi.waitFor(() => expect(popup.features).toHaveLength(1));
  const action = queryShadowDOM<HTMLCalciteActionElement>(
    "calcite-action[title='Load nearby schools']",
    popup.shadowRoot!,
  );
  action!.click();

  await vi.waitFor(() =>
    expect(container.querySelector("calcite-alert")).toBeInTheDocument(),
  );
});

// Test utilities
function queryShadowDOM<T extends Element>(
  selector: string,
  root: Document | DocumentFragment | Element = document,
): T | null {
  return _queryShadowDOM(selector, root) as T | null;
}

function queryShadowDOMAll<T extends Element>(
  selector: string,
  root: Document | DocumentFragment | Element = document,
): T[] {
  return _queryShadowDOMAll(selector, root) as T[];
}

function _queryShadowDOM(
  selector: string,
  root: Document | DocumentFragment | Element = document,
): Element | null {
  let element = root.querySelector(selector);
  if (element) return element;

  const allElements = root.querySelectorAll("*");
  for (const el of allElements) {
    if (el.shadowRoot) {
      element = queryShadowDOM(selector, el.shadowRoot);
      if (element) return element;
    }
  }

  return null;
}

function _queryShadowDOMAll(
  selector: string,
  root: Document | DocumentFragment | Element = document,
): Element[] {
  const results: Element[] = [];

  results.push(...Array.from(root.querySelectorAll(selector)));

  const allElements = root.querySelectorAll("*");
  for (const el of allElements) {
    if (el.shadowRoot) {
      results.push(...queryShadowDOMAll(selector, el.shadowRoot));
    }
  }

  return results;
}
 