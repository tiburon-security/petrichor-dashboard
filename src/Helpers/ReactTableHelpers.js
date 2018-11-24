import React from 'react';
import Form from "react-jsonschema-form";


/**
 * A custom data accessor that crawls an array of objects to pull specific key(s)
 * and return it in a an array of objects. 
 * Typically utilized with the BulletedListFormatter, to display the array as a bulleted list.
 */
export function ArrayTabularDataAccessor(data, arrayKey, targetObjectKeys){
	
	let output = []
	if (arrayKey in data){
		
		for(let i of data[arrayKey]){
			let current = []
			for(let targetObjectKey of targetObjectKeys){
				current.push(
					{
						label:targetObjectKey["label"],
						key:targetObjectKey["key"],
						data: i[targetObjectKey["key"]]
					}
				)
			}
			output.push(current)
		}
	}
	return output
}

/**
 * Displays array data as a bulleted list within react-table. If the array of objects
 * only has one key, the list is displayed as a single level. If multiple keys exist
 * in the object, its displayed as a multi-level bulleted list
 */
export function BulletedListFormatter(data, showLabel){
	let output = null;
	
	if(data.length >= 1){
		
		let numberOfPropertiesInObjects = Object.keys(data[0]).length

		// If there is one property in the object, show it as a single layer bulleted list
		if(numberOfPropertiesInObjects === 1){
			
			output = (
				<ul>
				
					{data.map((currentData, index) => 
						<li key={index} >
							{(showLabel === undefined || showLabel) ? currentData[0]["label"] + ': ' + currentData[0]["data"] : currentData[0]["data"]}
						</li>
						
					)}
				</ul>
			);
			
		}
		
		// If there are multiple properties in the object, show it as a multiple
		// layer bulleted listed
		else if(numberOfPropertiesInObjects > 1){			
			
			output = (
				<ul>
					{data.map((currentData, index) => 
						<li key={index}>
							<ul>
								{currentData.map((currentSubdata, subIndex) => 
									<li key={subIndex}>
										{(showLabel === undefined || showLabel) ? currentSubdata["label"] + ': ' + currentSubdata["data"] : currentSubdata["data"]}
									</li>
									
								)}
							</ul>
						</li>
					)}
				</ul>
			)
		}
	}
	return output
}

/**
 * Displays array data as a bulleted list within react-table. If the array of objects
 * only has one key, the list is displayed as a single level. If multiple keys exist
 * in the object, its displayed as a multi-level bulleted list.
 *
 * In addition, uses the react-jsonschema-form library to display a form for collecting
 * and submitting data that is posted to a user-defined API
 */
export function SubmitAndAdditionalDataSubComponent(tableRow, columns, formConfiguration){
	
	// Additional Data SubComponent
	let data = AdditionalDataSubComponent(tableRow, columns);
	
	// Build Form elements based on configuration input
	return (
		<div>
			{data}
			<div style={{"width":"40%", "margin":"10px"}}>
				<Form 
					schema={formConfiguration.form_schema} 
					uiSchema={formConfiguration.ui_schema}
					onSubmit={(formData,e) =>{
						
						//e.preventDefault();
						
						fetch(formConfiguration.target_endpoint, {
							method: 'post',
							body: JSON.stringify(formData)
						}).then(function(response) {
							console.log('Submitted: ', response);
						});
					}}
				/>
			</div>
		</div>
	);
	
}


/**
 * Table dropdown row for displaying additional data
 */
export function AdditionalDataSubComponent(tableRow, columns){
	
	let output = [];
	
	for(let [index, col] of columns.entries()){

		let label = col.label
		let data = (
			<ul>
				<li>{tableRow.row._original[col.id]}</li>
			</ul>
		)
		
		// Determine if a custom accessor function is being utilized
		if("custom_accessor" in col){
			
			let rawData = null;
			
			switch(col.custom_accessor.method){
				
				case "ArrayTabularDataAccessor": {
					rawData =  ArrayTabularDataAccessor(tableRow.row._original, col.id, col.custom_accessor.keys)
					break;
				}	

				default : {
					break;
				}			
			
			}
			
			// Determine if a custom output formatter function is being utilized
			if("formatter" in col.custom_accessor){
				
				let showLabel = col.custom_accessor.formatter.show_label;
				
				// Display data based on the specified custom formatter
				switch(col.custom_accessor.formatter.method){
					
					case "BulletedListFormatter": {
						data = BulletedListFormatter(rawData, showLabel)
						break;
					}
					
					default : {
						break;
					}	
				}
			}
			
		}
		
		// Only append if there's actual data
		if(data !== null){
			output.push(
				<tr key={index}>
					<td><span>{label}</span></td>
					<td>{data}</td>			
				</tr>
			);	
			}
	}
	
	// Return null if there's no subdata
	let finalTable = (output.length <= 0) ? null :
		(
			<table 
				style={{
					"margin": "10px"
				}}
			>
				<tbody>
					{output}
				</tbody>
			</table>
		)
	
	return finalTable;
}

/**
 * Custom component for column filters which displays the unique items 
 * for a column in a drop-down Select menu
 */
export function SelectFilter(filter, onChange, allData, column){

	// Pluck target column value from each row via map, then convert to Set to deduplicate
	var uniqueColumnValues = allData.length > 0 ? [...(new Set(allData.map(row => row[column])))] : [];

	return (
		<select
		  onChange={e => onChange(e.target.value)}
		  style={{  width: '100%'  }}
		  value={filter ? filter.value : 'all'}
		>
			<option value="">Show All</option>
			{
				uniqueColumnValues.map( k => {
					
					// Validate that column only contains strings or numbers
					if(
						(typeof k === "number" && isFinite(k)) || 
						(typeof k === "string" || k instanceof String)
					){
						return <option key={k.toString()} value={k}>{k}</option>
					} else {
						return null;
					}
				  
				})
			}
		</select>
	)
}