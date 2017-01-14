# Analytics Dashboard

Analytics Dashboard is a ReactJS application for visualizing data. In essence, you already have some kinda of standalone analytic system processing data (Pandas, Apache Pig, etc...) and a mechanism for exposing the results via a REST interface. This application allows for the creation of widgets that utilize REST to consume the resutls and display them in your desired form (tables, graphics, etc.). Each Widget is a user defined react Component that is rendered onto a dashboard grid. Each widget is movable and resizable. Dashboards can be statically defined in the configuration, allowing the developer to specify which widgets are loaded into the dashboard, and in what layout.

## Configuration 

The global configuration for the applications is stored in routes_menu_config.json. This configuration controls routing, menus, notifications, dashboards, and widgets. The following sections will demonstrated how to use correctly use and modify the configuration.

### JSON Schema
```
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "index_route": {
      "type": "object",
      "properties": {
        "route_name": {
          "type": "string"
        },
        "visible_in_menu": {
          "type": "boolean"
        },
        "menu_title": {
          "type": "string"
        },
        "menu_font_awesome_icon": {
          "type": "string"
        },
        "component": {
          "type": "string"
        }
      },
      "required": [
        "route_name",
        "visible_in_menu",
        "menu_title",
        "menu_font_awesome_icon",
        "component"
      ]
    },
    "routes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "route_name": {
            "type": "string"
          },
          "route": {
            "type": "string"
          },
		  "link": {
            "type": "string"
          },
          "visible_in_menu": {
            "type": "boolean"
          },
          "menu_title": {
            "type": "string"
          },
          "menu_font_awesome_icon": {
            "type": "string"
          },
          "component": {
            "type": "string"
          },
          "child_routes": {
            "type": "array"
          }
        },
        "required": [
          "route_name",
          "route",
          "visible_in_menu",
          "menu_title",
          "menu_font_awesome_icon",
          "component",
          "child_routes"
        ]
      }
    },
    "dashboards": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "route_name": {
            "type": "string"
          },
          "auto_position_widgets": {
            "type": "boolean"
          },
          "supported_widgets": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "layout": {
                  "type": "object",
                  "properties": {
                    "x": {
                      "type": "integer"
                    },
                    "y": {
                      "type": "integer"
                    },
                    "w": {
                      "type": "integer"
                    },
                    "h": {
                      "type": "integer"
                    }
                  },
                  "required": [
                    "x",
                    "y",
                    "w",
                    "h"
                  ]
                }
              },
              "required": [
                "name",
                "layout"
              ]
            }
          }
        },
        "required": [
          "route_name",
          "auto_position_widgets",
          "supported_widgets"
        ]
      }
    },
    "dashboard_widgets": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "widget_class_name": {
            "type": "string"
          },
          "widget_url": {
            "type": "string"
          },
          "min_grid_size": {
            "type": "object",
            "properties": {
              "w": {
                "type": "integer"
              },
              "h": {
                "type": "integer"
              }
            },
            "required": [
              "w",
              "h"
            ]
          }
        },
        "required": [
          "widget_class_name",
          "widget_url",
          "min_grid_size"
        ]
      }
    },
    "notifications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "iso_datetime": {
            "type": "string"
          },
          "font_awesome_icon": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "iso_datetime",
          "font_awesome_icon",
          "message"
        ]
      }
    }
  },
  "required": [
    "index_route",
    "routes",
    "dashboards",
    "dashboard_widgets",
    "notifications"
  ]
}
```

### Schema Explained

#### Routes & Menu

The routes and menu in the application are completly controlled by the configuration. The `index_route` represents the default path for the application (ie localhost/). The `routes` specify all other url locations supported by the application. For each route, you can specify whether or not it should be displayed in the menu, the icon you'd like to be associated with it, a unique name/identifier, and a React component that will render the be rendered when the URL is called. Additionally, optional `child_routes`, whic allows for nesting of URLs; currently only 1 level of nesting is allowed (ie localhost/parent/child). Lastly, each route can specify an optional `link`, which slightly differs from the `route`. The `route` tells the application how to handle the request, the `link` points to the application. In doing so, we can support parameters in the route, while still allowing the base URL to be clicked in the menu.

#### Dashboards & Widgets

Each Widget definition specifies the name of the React component's class, in addition the path where the class is found. Within the dashboard, these widgets are dynamically loaded and added to the DOM. The must also specify a minimum grid size, which represents the smallest size they may be instantiated to within a dashboard. This is important because each dashboard can define a different size and layout for each widget. The dashboard can also chose to omit changing the size of a given widget, at which point the size will default to the size in the widget definition. Each dashboard indicates which `route_name` it belongs to, when the `route` for that `route_name` is reached the dashboard is loaded. Each widget defined in the `supported_widgets` property is added to the dashboard. There is a `auto_position_widgets` property, which will automatically position each widget. If this property is set to true, no layout is required; if one is supplied it is ignored. `auto_position_widgets` will utilize the default widget sizes and will arrange them as best fits on the the grid. **NOTE: this feature has not been fully implemented yet.**

#### Notifications

Notifications can be used for showing alerts of you liking, such as application updates, outages, etc. Each notification must be provided an ISO formatted timestamp, the message to be displayed, and a font awesome icon to indicate the notification type (alert, warning, info, etc). Every notiication is displayed, so be prudent to keep the notifications to a limit. Notifications added within the last 24 hours are indicated by a count in the user interface.

## Technologies

Analytics Dashboard is built entirely in ReactJS, using the ES6 Javascript standard. The current codebase utilizes create-react-app (https://github.com/facebookincubator/create-react-app) to manage compilation and dependencies (Babel, Wepack, JSLint and others under the hood). The Gentella Alella theme (https://github.com/puikinsh/gentelella) was utilized for the user interface, with all JQuery dependencies being re-written in React. The dashboard utilizes react-grid-layout (https://github.com/STRML/react-grid-layout) for the grid implementation. Additionally, Font Awesome, Lodash, and react-bootstrap were utilized for minor functionality.