  require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Editor"
  ], function (
    WebMap, MapView, Editor
  ) {

    const map = new WebMap({
      portalItem: { id: "736bed524f294e2e8866036b3dc72723" }
    });

    const view = new MapView({
      map,
      // center: [-71.13924874158702, 42.27664584928105],
      container: "viewDiv",
      padding: {
        left: 49
      },
      zoom: 20
    });

    // Hide the loading indicator; show the app
    view.when(() => {

      initializeWidgets();
      let activeWidget;

      const handleActionBarClick = ({ target }) => {
        if (target.tagName !== "CALCITE-ACTION") {
          return;
        }

        if (activeWidget) {
          document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
          document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
        }

        const nextWidget = target.dataset.actionId;
        if (nextWidget !== activeWidget) {
          document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
          document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
          activeWidget = nextWidget;
        } else {
          activeWidget = null;
        }
      };

      document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);

      let actionBarExpanded = false;

      document.addEventListener("calciteActionBarToggle", event => {
        actionBarExpanded = !actionBarExpanded;
        view.padding = {
          left: actionBarExpanded ? 157 : 45
        };
      });

      function initializeWidgets() {

      const editor = new Editor({
        map,
        view
      }, "editor");

      }

      // const editor = new Editor({
      //   map,
      //   view
      // }, "editor");

    });
  });