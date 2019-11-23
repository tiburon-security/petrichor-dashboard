# Petrichor Dashboard

Petrichor Dashboard is a ReactJS application for visualizing data. In essence, you already have some kinda of standalone analytic system processing data (Pandas, Apache Pig, Spark, etc...) and a mechanism for exposing the results of the analytic via a REST interface or other web-accesible interface. This application allows for the creation of widgets that utilize those pre-existing interfaces to consume the resutls and display them in your desired form (tables, graphics, etc.). Each Widget is a user defined react Component that is rendered onto a dashboard grid. Each widget is movable and resizable. Dashboards can be statically defined in the configuration, allowing the developer to specify which widgets are loaded into the dashboard, and in what layout.

![img](https://zippy.gfycat.com/CrispCarefulAmericancreamdraft.gif)

## Configuration 

The global configuration for the applications is stored in routes_menu_config.json. This configuration controls routing, menus, notifications, dashboards, and widgets. The following sections will demonstrated how to use correctly use and modify the configuration.

### JSON Schema
```
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
	"website_name" : {
	  "type": "string"
	}
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

The routes and menu in the application are completly controlled by the configuration. The `index_route` represents the default path for the application (ie localhost/). The `routes` specify all other url locations supported by the application. For each route, you can specify whether or not it should be displayed in the menu, the icon you'd like to be associated with it, a unique name/identifier, and a React component that will render the be rendered when the URL is called. Additionally, optional `child_routes`, which allows for nesting of URLs; currently only 1 level of nesting is allowed (ie localhost/parent/child). Lastly, each route can specify an optional `link`, which slightly differs from the `route`. The `route` tells the application how to handle the request, the `link` points to the application. In doing so, we can support parameters in the route, while still allowing the base URL to be clicked in the menu.

#### Dashboards & Widgets

Each Widget definition specifies the name of the React component's class, in addition the path where the class is found. Within the dashboard, these widgets are dynamically loaded and added to the DOM. The must also specify a minimum grid size, which represents the smallest size they may be instantiated to within a dashboard. This is important because each dashboard can define a different size and layout for each widget. The dashboard can also chose to omit changing the size of a given widget, at which point the size will default to the size in the widget definition. Each dashboard indicates which `route_name` it belongs to, when the `route` for that `route_name` is reached the dashboard is loaded. Each widget defined in the `supported_widgets` property is added to the dashboard. 

#### Views

Each view utilized in the application must be made routable by being added to `RouteableViews.js`; this allows dynamic loading upon initial load. Once added as a routable view, the views can be defined in the schema using the `component` property in each route.

## Widgets

Widgets are composoble UI boxes that display data on a dashboard. They are user defined React components that can be rendered in the common dashboard boxes. Several built in widgets are inculuded as part of this project to demonstrate common functions such as displaying data in a table, in a chart, or for filtering data.

### TabularDataFromAPIWidget.js

Fetches data from an API and displays it in a highly customizable table. This is the most advanced widget included in the dashboard and offers a plethora of options for displaying & even sending data.

At a basic level, the table can be utilized for display "flat" data, where one piece of data is displayed in each column/row:

```
"props" : {

	// Options to allow for table page sizes
	"pageSizeOptions": [50, 100, 250, 500, 1000],
	
	// Default page size for table
	"defaultPageSize": 500,
	
	// API endpoint from which to fetch data
	"endpoint" : "/sample_nested_table_data_api.json",	
	
	// Key the API returns containing target data
	"api_response_data_key" : "users",
	
	// Name to display for the table
	"table_name" : "Sample Table 2 (Nested Table Example)",
	
	// Parameters that are sent to API
	api_page_number_variable_name 		: "page",
	api_page_size_variable_name 		: "per_page",
	api_sort_variable_name 			: "sort_by",
	api_filter_variable_name 		: "filter_by",
	api_start_date_variable_name	 	: "start_date",
	api_end_date_variable_name	 	: "end_date",
	api_response_data_key 			: "data",
	api_response_number_of_pages_key 	: "total_pages",	
	api_page_number_offset 			: 1,
		
	// Query String Params that are added to current URL
	query_string_page_variable_name 	: "page",
	query_string_page_size_variable_name    : "page_size",
	query_string_filter_variable_name	: "filter_by",
	query_string_sorts_variable_name 	: "sort_by",
	
	//
	"columns" : [
		{
			"label": "ID",
			"id": "id"
		}
	]

},
```

#### Accessors & Formatters

Accessors & formatters are used for displaying non-flat, but related data. For example, if you wanted to display a name and birth date in a column as a bulleted list or in a sub-table. In essence, the Accessor defines how to read the JSON returned from the API to retrieve the target data, and the formatter defines how to display the data; both must be used in concert.

This feature can be utilized by leveraging the `custom_accessor` property definable for every column element.

##### ArrayTabularDataAccessor

This is the only accessor included as it covers most use cases involving tables. Essentially,  it crawls an array of objects to pull specific key(s) and return it in a an array of objects to be used by a Formatter

For example, assume data from your API was returned in the follow format:

```
{
	"users": [{
		"id": 1,
		"first_name": "George",
		"last_name": "Bluth",
		"avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg",
		"siblings" :
			[
				{
					"id": 1,
					"first_name" : "Sarah",
					"last_name" : "Bluth"
				},		
				{
					"id": 1,
					"first_name" : "Gob",
					"last_name" : "Bluth"				
				}
			],
... [snip] ...

```

And you wanted to display the first/last name of all the sibling in a single column for every row as a bulleted list, this accessor could be used as such:

```
"columns" : [
	{
		"label" : "Siblings",
		"id": "siblings",
		"filterable" : false,
		"custom_accessor":  {
			"method" : "ArrayTabularDataAccessor",
			"keys" : [
				{
					"label" : "First Name",
					"key" : "first_name"										
				},										
				{
					"label" : "Last Name",
					"key" : "last_name"										
				}
			],
			"formatter" : {
				"method": "BulletedListFormatter",
				"show_label" : true
			}
		}
	}
]
```

##### BulletedListFormatter

![img](https://imgur.com/7xoHkF4.png)

As seen in the `ArrayTabularDataAccessor` section above, this Formatter is utilized for displaying multiple pieces of data in a given column for every row as a bulled list. Any data passed to it by the Accessor is displayed. Its only property is `show_label` which optionally displays the data's Label field defined in the accessor.

##### NestedTableFormatter

![img](https://imgur.com/l8VMK9r.png)

This formatter displays an array of data as a nested react-table. It caan only be used as a formatter in the "SubmitAndAdditionalDataSubComponent" "AdditionalDataSubComponent" subcomponents, **not** in the column of a table - see those upcoming sections for more details.

Like the `BulletListFormatter`, its only property is `show_label` which optionally displays the data's Label field defined in the accessor.

#### Column Filters

Within each column definition, you can optionally define a filter for the column. By default, the filter is a free-form textbox and any data typed into it is passed back to the underlying API serving the table's data. Filters can also be disabled using the boolean `filterable` property. Included are two custom filters described below. Custom filters are set utilizing the `custom_filter_ui` property.

##### UniqueValuesSelectFilter

![img](https://imgur.com/B4B4vBB.png)

This custom filters which displays the unique datapoint within the active page of the table and allows them to be selected in in a drop-down Select menu.

##### ArrayValuesSelectFilter

This custom filter is similar to the above, but the difference is that it allows options to be statically defined. This is useful in cases where you only want users to be able to filter for a subset of options. The definition is as follows:

```
"custom_filter_ui" :"ArrayValuesSelectFilter",
"custom_filter_array" : [
	{
		"key" : "Bluth",
		"label" : "Bluth"
	},							
	{
		"key" : "Weaver",
		"label" : "Weaver"
	}
]
```

#### Sub Components

Subcomponents are powerful modifications that allow for data to be nested within the table. It functions by adding as arrow on each row that a user can expand and view additional information. Two subcomponenets are included and can utilized via the `sub_component`.

##### AdditionalDataSubComponent

This component allows additional data to be displayed upon expanding a row. This sub component can take the core column definition properties of a standard Tabular Data widget.

Of particular interest, this sub component can utilize both `BulletedListFormatter` and `NestedTableFormatter`

```
"sub_component" : {
	"method" : "AdditionalDataSubComponent",
	"columns" : [
		{
			"label": "First Name",
			"id": "first_name"
		},
		{
			"label" : "Degrees",
			"id": "degrees",
			"custom_accessor":  {
				"method" : "ArrayTabularDataAccessor",
				"keys" : [
					{
						"label" : "Name",
						"key" : "name"										
					},
					{
						"label" : "Level",
						"key" : "level"										
					}
				],
				"formatter" : {
					"method": "NestedTableFormatter",
					"show_label" : true
				}
			}
		}
	]
}
```

##### SubmitAndAdditionalDataSubComponent
 
![img](https://imgur.com/8KCvBb3.png)
 
This sub component expands on the `AdditionalDataSubComponent` by also allowing the row to capture data via a form and send it to a desired API. It leverages the `react-jsonschema-form` for defining the forms that will capture data:

```
// If true, deletes row from UI when form submitted
"delete_row_on_submit" : true,

"form_configuration" : {

	// API where data is sent
	"target_endpoint" : "fake.php",
	
	// Data (by their key) from current row that is sent to API
	"api_data_to_send" : [
		{
			"label" : "name_im_sending_to_api_first",
			"key" : "first_name"
		},							
		{
			"label" : "name_im_sending_to_api",
			"key" : "last_name"
		}
	],
	
	// react-jsonschema-form form schema - see project docs for breakdown on usage
	"form_schema" : {
		"type": "object",
		"required": ["status", "comments"],
		"properties": {
			"status": {"type": "string", "title": "Status", "enum": ["Ongoing", "Complete"]},
			"comments": {"type": "string", "title": "Comments"}
		}								
	},
	
	// react-jsonschema-form UI schema - see project docs for breakdown on usage
	"ui_schema" : {
		"comments" : {
			"ui:widget": "textarea"
		}
	}
}
```

### GraphingChartAPIWidget.js

![img](https://i.imgur.com/lqNyhwvr.png)

Fetches data from an API and displays it in a highly customizable series of graphs including a bar, pie, line, or doughnut chart.

**TODO**

### FilteringWidget.js

**TODO**

## Technologies

Petrichor Dashboard is built entirely in ReactJS, using the ES6 Javascript standard. The current codebase utilizes create-react-app (https://github.com/facebookincubator/create-react-app) to manage compilation and dependencies (Babel, Wepack, JSLint and others under the hood). The Gentelella Alella theme (https://github.com/puikinsh/gentelella) was utilized for the user interface, with all JQuery dependencies being re-written in React. The dashboard utilizes react-grid-layout (https://github.com/STRML/react-grid-layout) for the grid implementation. Additionally, Font Awesome, Lodash, and react-bootstrap were utilized for minor functionality.
