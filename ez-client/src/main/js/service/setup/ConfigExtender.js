import Logger from "utils/Logger";
import JsonUtils from "utils/JsonUtils";
import GridLayoutService from "service/grid/GridLayoutService";

const logger = Logger.getLogger("ConfigExtender");

export default class ConfigExtender {

  /**
   * Extends dashboard configuration
   *
   * Replace, in all the configuration, all variables found in the env section by their value.
   *
   * If no theme is set, use the "default" theme.
   *
   * If no grid layout is set, generate a default one.
   * If no thresholds is set, generate an empty one. Same for avatars.
   *
   * If a widget doesn't override avatars configuration, the avatars configuration is taken from
   * the global scope. Same for thresholds.
   *
   * If a widget is not linked to any dataSources, property can be not set in configuration but
   * we then prefer to map it on an empty array.
   *
   * Generate a unique widget key (required for react-grid-layout)
   * Generate a unique id equals to the key.
   *
   * Can return a new instance of the configuration or a modified instance of the mutable arg, that means
   * you MUST use the returned object in all cases.
   */
  static extendsConfig(dashboardConfig, loadGrid = true) {
    if (!dashboardConfig.env) {
      dashboardConfig.env = {};
    } else {
      dashboardConfig = JsonUtils.replaceVars(dashboardConfig, dashboardConfig.env);
    }
    if (!dashboardConfig.theme) {
      dashboardConfig.theme = "default";
    }
    if (!dashboardConfig.thresholds) {
      dashboardConfig.thresholds = {};
    }
    if (!dashboardConfig.avatars) {
      dashboardConfig.avatars = {};
    }
    dashboardConfig.widgets.forEach((widgetConfig, index) => {
      if (!widgetConfig.avatars) {
        widgetConfig.avatars = dashboardConfig.avatars;
      }
      if (!widgetConfig.thresholds) {
        widgetConfig.thresholds = dashboardConfig.thresholds;
      }
      if (!widgetConfig.dataSource) {
        widgetConfig.dataSource = [];
      }
      if (!widgetConfig.className) {
        widgetConfig.className = widgetConfig.type.toLowerCase().replace("widget", "");
      }
      if (!widgetConfig.id) {
        widgetConfig.id = "wid_" + index;
      }
      widgetConfig.key = widgetConfig.id;
    });
    if (loadGrid) {
      GridLayoutService.loadGridLayout(dashboardConfig);
    }
    logger.info("Extended config:", dashboardConfig);
    return dashboardConfig;
  }

}
