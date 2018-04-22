/**
 * Helper function for recursively walking routes structure
 * and applying a user-defined function(UDF) to each route, output of
 * UDF appened to array and returned as final output.
 */
export function recursivelyWalkRoutes(array, func, key="routes", fullPath = null, level = 0, data = []){
	
	//let data = []
	
	for(const [index, obj] of array.entries()){

		let newfullPath = "";
		let newLevel = 0;
	
		if(fullPath === null){
			newfullPath = obj["route"];
			newLevel = level;
		} else {
			newfullPath = fullPath + obj["route"];
			newLevel++;
		}
	
		if(key in obj && obj[key] !== null){
			data.push(func(index, obj, newfullPath, newLevel));
			recursivelyWalkRoutes(obj[key], func, key, newfullPath, newLevel++, data);
		} else {
			data.push(func(index, obj, newfullPath, newLevel));
		}
		
	};
	
	return data;
	
}