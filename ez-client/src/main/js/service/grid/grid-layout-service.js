import Logger from "utils/logger";
import GridLayoutGenerator from "service/setup/grid-layout-generator";
import RestClient from "utils/rest-client";
import Constants from "constant";
import isEmpty from "lodash/isEmpty";

const logger = Logger.getLogger("GridLayoutService");

const LAYOUT_KEY_SUFFIX = "EZ_LAYOUT_KEY_6";

export default class GridLayoutService {

  /**
   * Get the full loaded dashboard configuration as argument.
   */
  constructor(dashboardConfig) {
    this.dashboardConfig = dashboardConfig;
  };

  static getLSKey(dashboardConfig) {
    return dashboardConfig.dashboardId + LAYOUT_KEY_SUFFIX;
  }

  /**
   * Try to load the grid layout configuration in this order:
   *  - from local storage first
   *  - from the dashboard.json configuration file then
   *  - finally, we generate one if no configuration is available
   */
  static loadGridLayout(dashboardConfig) {
    let layout = localStorage.getItem(GridLayoutService.getLSKey(dashboardConfig));

    if (layout != null) {
      dashboardConfig.grid.layouts = JSON.parse(layout);
      logger.info("Use the grid layout defined in the local storage");
      return;
    }
    if (isEmpty(dashboardConfig.grid.layouts)) {
      dashboardConfig.grid.layouts = GridLayoutGenerator.generate(dashboardConfig);
      logger.info("Use auto-generated grid layout configuration", dashboardConfig.grid.layouts);
    } else {
      logger.info("Use the grid layout defined in the configuration file");
    }
  }

  /**
   * Set the redux store in order to emit events and read the current state
   */
  setStore(store) {
    this.store = store;
  }

  resetLayout() {
    logger.info("Reset dashboard layout from localStorage and reload layout from configuration");
    localStorage.removeItem(GridLayoutService.getLSKey(this.dashboardConfig));
    location.reload(true);
  }

  onGridLayoutChange(action) {
    localStorage.setItem(
      GridLayoutService.getLSKey(this.dashboardConfig),
      JSON.stringify(action.payload.allLayouts));
  }

  // FIXME
  saveLayout() {
    let layouts = this.store.getState().grid.layouts;
    logger.info("update grid layouts: ", layouts);

    RestClient.patch(Constants.UPDATE_GRID_LAYOUTS_PATH, layouts, () => {
      logger.info("Grid layout saved successfully");
      // const result = {
      //   type: GridEvent.UpdateGridLayouts,
      //   payload: action.payload
      // };
      //logger.debug("Dispatching updated widget config:", result);
      //this.store.dispatch(result);
    }, exception => {
      logger.error("Error during grid layout update, details:", exception);
    });

  }

}
