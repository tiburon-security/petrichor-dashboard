/**
 * Strips leading question mark, a.k.a the query string seperator, from a given react
 * search string. I.e. '?fake=string&and=more' is converted to 'fake=string&and=more'
 */
export function stripQueryStringSeperator(searchString){
	return  searchString.replace(/^\?/, '');
}