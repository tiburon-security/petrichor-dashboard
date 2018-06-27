
export function ArrayTabularDataAccessor(data, arrayKey, targetObjectKey){
	
	let output = []
	
	if (arrayKey in data){
		for(let i of data[arrayKey]){
			output.push(i[targetObjectKey])
		}
	}
	
	return output.join(", ")
}