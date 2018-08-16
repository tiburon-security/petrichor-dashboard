import React from 'react';

/**
 * A custom data accessor that crawls an array of objects to pull specific key(s)
 * and return it in a an array of objects. 
 * Typically utilized with the BulletedListFormatter, to display the array as a bulleted list.
 */
export function ArrayTabularDataAccessor(data, arrayKey, targetObjectKeys){
	
	let output = []
	
	if (arrayKey in data){
		
		for(let i of data[arrayKey]){
			
			let obj = {}
			
			for(let targetObjectKey of targetObjectKeys){
				obj[targetObjectKey.label] = i[targetObjectKey.key]
			}
						
			output.push(obj)
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
	
	if(data.length > 1){
		
		let numberOfPropertiesInObjects = Object.keys(data[0]).length

		// If there is one property in the object, show it as a single later bulleted list
		if(numberOfPropertiesInObjects === 1){
			
			let targetKey = Object.keys(data[0])[0];
			
			output = (
				<ul>
					{data.map((currentData, index) => 
						<li key={index} >{currentData[targetKey]}</li>
					)}
				</ul>
			);
			
		}
		
		// If there are multiple properties in the object, show it as a multiple
		// layer bulleted listed
		else if(numberOfPropertiesInObjects > 1){
						
			let targetKeys =  Object.keys(data[0]);
			
			output = (
				<ul>
					{data.map((currentData, index) => 
						
						<li key={index}>
							<ul>
								{targetKeys.map((currentKey, subIndex) =>
									<li key={subIndex}>
										{(showLabel === undefined || showLabel) ? currentKey + ': ' + currentData[currentKey] : currentData[currentKey]}
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


export function AdditionalDataSubComponent(tableRow, columns){
	console.log(tableRow.row.first_name)
	/*return (
		<div style={{ padding: "20px" }}>
			Another Sub Component!
		</div>
	);*/
	
	let output = [];
	
	for(let col of columns){
		
		let label = col.label
		let data = col.id;
		
		// Determine if a custom accessor function is being utilized
		if("custom_accessor" in col){
			
			let rawData = null;
			
			switch(col.custom_accessor.method){
				
				case "ArrayTabularDataAccessor": {
					rawData =  ArrayTabularDataAccessor(tableRow.row, col.id, col.custom_accessor.keys)
					break;
				}					
			
			}
			
			// Determine if a custom output formatter function is being utilized
			if("formatter" in col.custom_accessor){
				
				// Generates an array of the target keys that will be displayed
				let targetKeys = col.custom_accessor.keys.map((i) => {
					return i["label"]
				})
				
				let showLabel = col.custom_accessor.formatter.show_label;
				
				// Filters a dataset to return only the target data that will be displayed
				let filterData = ( val => {
					
					let targetData = val.row[col.id].map((i) => {
						let filteredObj = {};

						for(let key of targetKeys){
							if(key in i){
								filteredObj[key] = i[key];
							}
						}
						
						return filteredObj;
					})						
					
					return targetData;
				})
				
				// Display data based on the specified custom formatter
				switch(col.custom_accessor.formatter.method){
					
					case "BulletedListFormatter": {
						console.log(rawData)
						let filteredData = filterData(rawData)
						console.log(filteredData)
						data = BulletedListFormatter(rawData, showLabel)
						
						break;
					}
					
					default : {
						break;
					}	
				}
			}
		}
		
		output.push(<li><span>{label}</span>{data}</li>)	
	}
	
	return (
		<ul>
			{output}
		</ul>
	)
	
}
