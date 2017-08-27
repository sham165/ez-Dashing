import { createStore, combineReducers, applyMiddleware } from "redux";
import LoggerMiddleware from "redux/middleware/LoggerMiddleware";
import CrashReporterMiddleware from "redux/middleware/CrashReporter";
import DataSourceMiddleware from "redux/middleware/DataSourceMiddleware";
import StartupReducer from "redux/reducer/StartupReducer";
import DataSourceReducer from "redux/reducer/DataSourceReducer";
import WidgetReducer from "redux/reducer/WidgetReducer";
import RestClient from "utils/RestClient";
import WidgetFactory from "service/setup/WidgetFactory";
import DataSourceService from "service/datasource/DataSourceService";
import Logger from "utils/Logger";
import ConfigExtender from "service/setup/ConfigExtender";


const logger = Logger.getLogger("StartupService");

export const SetupEvent = {
  ConfigLoadSuccess: "CONFIG_LOAD_SUCCESS"
};

export default class SetupService {

  getServerConfigPath() {
    return "/api/dashboard/config";
  };

  /**
   * If the initial state depends on the configuration it can be initialized here
   */
  generateInitialState(dashboardConfig) {
    let initialState = {};
    initialState.widget = {};
    dashboardConfig.widgets.forEach(widgetConfig => {
      initialState.widget[widgetConfig.id] = {
        sizeInfo: {}
      };
    });
    logger.info("Initial application state initialized to ", initialState);
    return initialState;
  };

  createReducers() {
    return combineReducers({
      startup: StartupReducer,
      dataSource: DataSourceReducer,
      widget: WidgetReducer
    });
  };

  createMiddlewares(dataSourceService) {
    return applyMiddleware(
      LoggerMiddleware,
      CrashReporterMiddleware,
      DataSourceMiddleware(dataSourceService)
    );
  };

  /**
   * Load server dashboard configuration
   */
  getDashboardConfig(callback) {
    const path = this.getServerConfigPath();
    RestClient.get(path, callback, exception => {
      logger.error("Error during application initialization, details:", exception);
    });
  };

  /**
   * Application starting point
   */
  initialize(callback) {
    logger.info("Starting ez-Dashing...");

    this.getDashboardConfig(dashboardConfig => {
      const cfg = ConfigExtender.extendsConfig(dashboardConfig);
      logger.info("Extended config:", cfg);

      const dataSourceService = new DataSourceService(cfg);
      const store = createStore(
        this.createReducers(),
        this.generateInitialState(cfg),
        this.createMiddlewares(dataSourceService)
      );

      dataSourceService.setStore(store);
      store.dispatch({
        type: SetupEvent.ConfigLoadSuccess,
        dataSources: dataSourceService.getDataSources(),
        dashboardConfig: cfg,
        widgetComponents: WidgetFactory.createAllWidgets(cfg)
      });

      callback(store);
    });
  }


}
