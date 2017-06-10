/**
 * Created by Yannick Lacaute on 06/06/17.
 * Copyright 2015-2016 the original author or authors.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.thorpora.ezdashing.core;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/dashboard")
@RestController
public class DashboardController {

    private DashboardProperties dashboardProperties;

    @Autowired
    public DashboardController(DashboardProperties dashboardProperties) {
        this.dashboardProperties = dashboardProperties;
    }

    @GetMapping("/config")
    public String getDashboardConfig() {
        return dashboardProperties.getDashboardConfig();
    }

}